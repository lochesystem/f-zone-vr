export interface AudioSettings { master:number;music:number;sfx:number;muted:boolean; }
export const DEFAULT_AUDIO_SETTINGS:AudioSettings={master:.72,music:.55,sfx:.4,muted:false};
const AUDIO_SETTINGS_KEY="f-zone-vr-audio-settings";

function clampLevel(value:unknown,fallback:number){return typeof value==="number"&&Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;}
export function loadAudioSettings():AudioSettings{try{const stored=localStorage.getItem(AUDIO_SETTINGS_KEY);if(!stored)return{...DEFAULT_AUDIO_SETTINGS};const value=JSON.parse(stored) as Partial<AudioSettings>;return{master:clampLevel(value.master,DEFAULT_AUDIO_SETTINGS.master),music:clampLevel(value.music,DEFAULT_AUDIO_SETTINGS.music),sfx:clampLevel(value.sfx,DEFAULT_AUDIO_SETTINGS.sfx),muted:Boolean(value.muted)};}catch{return{...DEFAULT_AUDIO_SETTINGS};}}
export function saveAudioSettings(settings:AudioSettings){try{localStorage.setItem(AUDIO_SETTINGS_KEY,JSON.stringify(settings));}catch{/* Preferências continuam válidas nesta sessão. */}}

export class RaceAudio{
  private context:AudioContext|null=null;private master:GainNode|null=null;private musicGain:GainNode|null=null;private sfxGain:GainNode|null=null;private engineGain:GainNode|null=null;private engineFilter:BiquadFilterNode|null=null;private background:HTMLAudioElement|null=null;private boostGain:GainNode|null=null;private engineOscillators:OscillatorNode[]=[];private boostNoise:AudioBufferSourceNode|null=null;private settings:AudioSettings={...DEFAULT_AUDIO_SETTINGS};private racing=false;

  async start(){
    if(this.context){void this.background?.play();await this.context.resume();return;}
    const AudioContextClass=window.AudioContext;
    if(!AudioContextClass)return;
    const context=new AudioContextClass();this.context=context;
    this.master=context.createGain();this.master.connect(context.destination);
    this.musicGain=context.createGain();this.musicGain.connect(this.master);
    this.sfxGain=context.createGain();this.sfxGain.connect(this.master);this.applySettings();
    const background=new Audio(new URL("audio/background.mp3",document.baseURI).href);background.loop=true;background.preload="auto";background.volume=1;context.createMediaElementSource(background).connect(this.musicGain);this.background=background;void background.play().catch(()=>undefined);
    const engineFilter=context.createBiquadFilter();engineFilter.type="lowpass";engineFilter.frequency.value=260;engineFilter.Q.value=.45;this.engineFilter=engineFilter;
    this.engineGain=context.createGain();this.engineGain.gain.value=0;this.engineGain.connect(engineFilter);engineFilter.connect(this.sfxGain);
    for(const [type,detune] of [["sine",-4],["triangle",5]] as const){const oscillator=context.createOscillator();oscillator.type=type;oscillator.frequency.value=38;oscillator.detune.value=detune;oscillator.connect(this.engineGain);oscillator.start();this.engineOscillators.push(oscillator);}
    const noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);const data=noiseBuffer.getChannelData(0);for(let index=0;index<data.length;index++)data[index]=(Math.random()*2-1)*(1-index/data.length*.18);
    const noise=context.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;const boostFilter=context.createBiquadFilter();boostFilter.type="bandpass";boostFilter.frequency.value=980;boostFilter.Q.value=.62;this.boostGain=context.createGain();this.boostGain.gain.value=0;noise.connect(boostFilter);boostFilter.connect(this.boostGain);this.boostGain.connect(this.sfxGain);noise.start();this.boostNoise=noise;
    await context.resume();
  }

  update(speed:number,throttle:number,boosting:boolean,racing:boolean){
    this.racing=racing;const context=this.context;if(!context||!this.engineGain||!this.engineFilter||!this.boostGain||!this.musicGain)return;const now=context.currentTime,velocity=Math.min(1,speed/178);
    this.engineOscillators.forEach((oscillator,index)=>oscillator.frequency.setTargetAtTime(38+speed*(index?.82:.62),now,.07));
    this.engineFilter.frequency.setTargetAtTime(190+velocity*390+throttle*70,now,.11);
    this.engineGain.gain.setTargetAtTime(racing?(.0025+throttle*.013+velocity*.01):0,now,.14);
    this.boostGain.gain.setTargetAtTime(boosting?.06:0,now,.07);
    this.musicGain.gain.setTargetAtTime((racing?.18:.045)*this.settings.music,now,.35);
  }

  setSettings(settings:AudioSettings){this.settings={master:clampLevel(settings.master,DEFAULT_AUDIO_SETTINGS.master),music:clampLevel(settings.music,DEFAULT_AUDIO_SETTINGS.music),sfx:clampLevel(settings.sfx,DEFAULT_AUDIO_SETTINGS.sfx),muted:Boolean(settings.muted)};this.applySettings();}

  private applySettings(){const context=this.context;if(!context||!this.master||!this.musicGain||!this.sfxGain)return;const now=context.currentTime;this.master.gain.setTargetAtTime(this.settings.muted?0:this.settings.master*.72,now,.04);this.sfxGain.gain.setTargetAtTime(this.settings.sfx,now,.04);this.musicGain.gain.setTargetAtTime((this.racing?.18:.045)*this.settings.music,now,.08);}

  boostHit(){
    const context=this.context,gainTarget=this.sfxGain;if(!context||!gainTarget)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type="sawtooth";oscillator.frequency.setValueAtTime(90,now);oscillator.frequency.exponentialRampToValueAtTime(310,now+.28);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.07,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+.34);oscillator.connect(gain);gain.connect(gainTarget);oscillator.start(now);oscillator.stop(now+.36);
  }

  weaponPickup(){this.tone(420,920,.18,.035,"sine");}
  weaponFire(kind:"machine-gun"|"missile"){if(kind==="machine-gun")this.tone(210,105,.07,.018,"square");else this.tone(145,520,.34,.052,"sawtooth");}
  shieldOn(){this.tone(260,760,.42,.038,"sine");}
  shieldImpact(){this.tone(760,240,.2,.045,"triangle");}
  explosion(){this.tone(115,32,.48,.065,"sawtooth");}

  private tone(from:number,to:number,duration:number,volume:number,type:OscillatorType){const context=this.context,gainTarget=this.sfxGain;if(!context||!gainTarget)return;const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(from,now);oscillator.frequency.exponentialRampToValueAtTime(Math.max(1,to),now+duration);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);oscillator.connect(gain);gain.connect(gainTarget);oscillator.start(now);oscillator.stop(now+duration+.02);}

  destroy(){this.background?.pause();if(this.background)this.background.src="";this.engineOscillators.forEach(oscillator=>oscillator.stop());this.boostNoise?.stop();void this.context?.close();this.context=null;}
}
