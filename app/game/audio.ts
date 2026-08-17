const NOTE=[55,55,65.41,73.42,55,82.41,73.42,65.41];

export class RaceAudio{
  private context:AudioContext|null=null;private master:GainNode|null=null;private musicGain:GainNode|null=null;private engineGain:GainNode|null=null;private boostGain:GainNode|null=null;private engineOscillators:OscillatorNode[]=[];private boostNoise:AudioBufferSourceNode|null=null;private timer:number|null=null;private step=0;private racing=false;

  async start(){
    if(this.context){await this.context.resume();return;}
    const AudioContextClass=window.AudioContext;
    if(!AudioContextClass)return;
    const context=new AudioContextClass();this.context=context;
    this.master=context.createGain();this.master.gain.value=.24;this.master.connect(context.destination);
    this.musicGain=context.createGain();this.musicGain.gain.value=.04;this.musicGain.connect(this.master);
    const engineFilter=context.createBiquadFilter();engineFilter.type="lowpass";engineFilter.frequency.value=720;
    this.engineGain=context.createGain();this.engineGain.gain.value=0;this.engineGain.connect(engineFilter);engineFilter.connect(this.master);
    for(const [type,detune] of [["sawtooth",-8],["square",7]] as const){const oscillator=context.createOscillator();oscillator.type=type;oscillator.frequency.value=48;oscillator.detune.value=detune;oscillator.connect(this.engineGain);oscillator.start();this.engineOscillators.push(oscillator);}
    const noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);const data=noiseBuffer.getChannelData(0);for(let index=0;index<data.length;index++)data[index]=(Math.random()*2-1)*(1-index/data.length*.18);
    const noise=context.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;const boostFilter=context.createBiquadFilter();boostFilter.type="bandpass";boostFilter.frequency.value=1180;boostFilter.Q.value=.72;this.boostGain=context.createGain();this.boostGain.gain.value=0;noise.connect(boostFilter);boostFilter.connect(this.boostGain);this.boostGain.connect(this.master);noise.start();this.boostNoise=noise;
    this.timer=window.setInterval(()=>this.scheduleMusic(),190);await context.resume();
  }

  update(speed:number,throttle:number,boosting:boolean,racing:boolean){
    this.racing=racing;const context=this.context;if(!context||!this.engineGain||!this.boostGain||!this.musicGain)return;const now=context.currentTime,velocity=Math.min(1,speed/178);
    this.engineOscillators.forEach((oscillator,index)=>oscillator.frequency.setTargetAtTime(42+speed*(index?1.18:1.48),now,.035));
    this.engineGain.gain.setTargetAtTime(racing?(.006+throttle*.045+velocity*.027):0,now,.08);
    this.boostGain.gain.setTargetAtTime(boosting?.105:0,now,.045);
    this.musicGain.gain.setTargetAtTime(racing?.115:.035,now,.35);
  }

  boostHit(){
    const context=this.context,gainTarget=this.master;if(!context||!gainTarget)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type="sawtooth";oscillator.frequency.setValueAtTime(90,now);oscillator.frequency.exponentialRampToValueAtTime(310,now+.28);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.09,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);oscillator.connect(gain);gain.connect(gainTarget);oscillator.start(now);oscillator.stop(now+.36);
  }

  private scheduleMusic(){
    const context=this.context,gainTarget=this.musicGain;if(!context||!gainTarget||context.state!=="running")return;const now=context.currentTime,frequency=NOTE[this.step%NOTE.length];this.step+=1;
    const bass=context.createOscillator(),bassGain=context.createGain();bass.type="sawtooth";bass.frequency.value=frequency;bassGain.gain.setValueAtTime(.0001,now);bassGain.gain.exponentialRampToValueAtTime(this.racing?.085:.035,now+.012);bassGain.gain.exponentialRampToValueAtTime(.0001,now+.16);bass.connect(bassGain);bassGain.connect(gainTarget);bass.start(now);bass.stop(now+.18);
    if(this.step%4===1){const pulse=context.createOscillator(),pulseGain=context.createGain();pulse.type="triangle";pulse.frequency.value=frequency*4;pulseGain.gain.setValueAtTime(.0001,now);pulseGain.gain.exponentialRampToValueAtTime(.045,now+.02);pulseGain.gain.exponentialRampToValueAtTime(.0001,now+.32);pulse.connect(pulseGain);pulseGain.connect(gainTarget);pulse.start(now);pulse.stop(now+.34);}
  }

  destroy(){if(this.timer!==null)window.clearInterval(this.timer);this.engineOscillators.forEach(oscillator=>oscillator.stop());this.boostNoise?.stop();void this.context?.close();this.context=null;}
}
