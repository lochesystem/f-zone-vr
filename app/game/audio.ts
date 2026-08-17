export class RaceAudio{
  private context:AudioContext|null=null;private master:GainNode|null=null;private musicGain:GainNode|null=null;private background:HTMLAudioElement|null=null;private engineGain:GainNode|null=null;private boostGain:GainNode|null=null;private engineOscillators:OscillatorNode[]=[];private boostNoise:AudioBufferSourceNode|null=null;

  async start(){
    if(this.context){void this.background?.play();await this.context.resume();return;}
    const AudioContextClass=window.AudioContext;
    if(!AudioContextClass)return;
    const context=new AudioContextClass();this.context=context;
    this.master=context.createGain();this.master.gain.value=.24;this.master.connect(context.destination);
    this.musicGain=context.createGain();this.musicGain.gain.value=.04;this.musicGain.connect(this.master);
    const background=new Audio(new URL("audio/background.mp3",document.baseURI).href);background.loop=true;background.preload="auto";background.volume=1;context.createMediaElementSource(background).connect(this.musicGain);this.background=background;void background.play().catch(()=>undefined);
    const engineFilter=context.createBiquadFilter();engineFilter.type="lowpass";engineFilter.frequency.value=720;
    this.engineGain=context.createGain();this.engineGain.gain.value=0;this.engineGain.connect(engineFilter);engineFilter.connect(this.master);
    for(const [type,detune] of [["sawtooth",-8],["square",7]] as const){const oscillator=context.createOscillator();oscillator.type=type;oscillator.frequency.value=48;oscillator.detune.value=detune;oscillator.connect(this.engineGain);oscillator.start();this.engineOscillators.push(oscillator);}
    const noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);const data=noiseBuffer.getChannelData(0);for(let index=0;index<data.length;index++)data[index]=(Math.random()*2-1)*(1-index/data.length*.18);
    const noise=context.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;const boostFilter=context.createBiquadFilter();boostFilter.type="bandpass";boostFilter.frequency.value=1180;boostFilter.Q.value=.72;this.boostGain=context.createGain();this.boostGain.gain.value=0;noise.connect(boostFilter);boostFilter.connect(this.boostGain);this.boostGain.connect(this.master);noise.start();this.boostNoise=noise;
    await context.resume();
  }

  update(speed:number,throttle:number,boosting:boolean,racing:boolean){
    const context=this.context;if(!context||!this.engineGain||!this.boostGain||!this.musicGain)return;const now=context.currentTime,velocity=Math.min(1,speed/178);
    this.engineOscillators.forEach((oscillator,index)=>oscillator.frequency.setTargetAtTime(42+speed*(index?1.18:1.48),now,.035));
    this.engineGain.gain.setTargetAtTime(racing?(.006+throttle*.045+velocity*.027):0,now,.08);
    this.boostGain.gain.setTargetAtTime(boosting?.105:0,now,.045);
    this.musicGain.gain.setTargetAtTime(racing?.16:.04,now,.35);
  }

  boostHit(){
    const context=this.context,gainTarget=this.master;if(!context||!gainTarget)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type="sawtooth";oscillator.frequency.setValueAtTime(90,now);oscillator.frequency.exponentialRampToValueAtTime(310,now+.28);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.09,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);oscillator.connect(gain);gain.connect(gainTarget);oscillator.start(now);oscillator.stop(now+.36);
  }

  destroy(){this.background?.pause();if(this.background)this.background.src="";this.engineOscillators.forEach(oscillator=>oscillator.stop());this.boostNoise?.stop();void this.context?.close();this.context=null;}
}
