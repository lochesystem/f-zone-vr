"use client";

import { useEffect,useRef,useState } from "react";
import * as THREE from "three";
import { FZoneEngine } from "./engine";
import { formatTime } from "./mechanics";
import { GAP_RANGES,TRACK_POINTS,isGap } from "./track-data";
import { INITIAL_SNAPSHOT,type RaceSnapshot } from "./types";

const MAP_CURVE=new THREE.CatmullRomCurve3(TRACK_POINTS.map(point=>new THREE.Vector3(...point)),true,"centripetal");

function TrackMap({progress}:{progress:number}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current,context=canvas?.getContext("2d");if(!canvas||!context)return;
    const width=canvas.width,height=canvas.height;
    const project=(point:{x:number;z:number})=>({x:24+(point.x+250)/530*(width-48),y:20+(210-point.z)/385*(height-40)});
    context.clearRect(0,0,width,height);context.fillStyle="rgba(2,12,20,.94)";context.fillRect(0,0,width,height);
    context.strokeStyle="rgba(105,246,255,.12)";context.lineWidth=1;for(let x=0;x<width;x+=24){context.beginPath();context.moveTo(x,0);context.lineTo(x,height);context.stroke();}for(let y=0;y<height;y+=24){context.beginPath();context.moveTo(0,y);context.lineTo(width,y);context.stroke();}
    context.strokeStyle="#69f6ff";context.lineWidth=6;context.lineJoin="round";context.lineCap="round";let drawing=false;for(let index=0;index<=240;index++){const p=index/240;if(isGap(p)){if(drawing)context.stroke();drawing=false;continue;}const mapped=project(MAP_CURVE.getPointAt(p));if(!drawing){context.beginPath();context.moveTo(mapped.x,mapped.y);drawing=true;}else context.lineTo(mapped.x,mapped.y);}if(drawing)context.stroke();
    context.strokeStyle="#ffc25e";context.lineWidth=3;context.setLineDash([7,6]);for(const [start,end] of GAP_RANGES){context.beginPath();for(let index=0;index<=12;index++){const mapped=project(MAP_CURVE.getPointAt(start+(end-start)*index/12));if(index===0)context.moveTo(mapped.x,mapped.y);else context.lineTo(mapped.x,mapped.y);}context.stroke();}context.setLineDash([]);
    const player=project(MAP_CURVE.getPointAt(progress));context.fillStyle=isGap(progress)?"#ffc25e":"#ff3e93";context.shadowColor=context.fillStyle;context.shadowBlur=12;context.beginPath();context.arc(player.x,player.y,7,0,Math.PI*2);context.fill();context.shadowBlur=0;
  },[progress]);
  return <canvas ref={canvasRef} width={360} height={300} className="track-map-canvas" aria-label="Minimapa do circuito Helix Verge"/>;
}

export function FZoneGame(){
  const canvasRef=useRef<HTMLCanvasElement>(null),engineRef=useRef<FZoneEngine|null>(null);const [race,setRace]=useState<RaceSnapshot>(INITIAL_SNAPSHOT);
  useEffect(()=>{if(!canvasRef.current)return;const engine=new FZoneEngine(canvasRef.current,setRace);engineRef.current=engine;return()=>{engine.destroy();engineRef.current=null;};},[]);
  const toggleMap=()=>engineRef.current?.toggleMinimap();
  return <main className="fz-shell">
    <canvas ref={canvasRef} className="fz-canvas" aria-label="F-Zone VR, corrida antigravidade futurista"/><div className="fz-grain"/><div key={race.impactPulse} className={`fz-vignette ${race.impactPulse?"hit":""}`}/>
    {race.phase!=="menu"&&<section className="race-hud" aria-live="polite">
      <div className="race-top"><div><div className="race-brand"><i/> F-Zone VR</div><div className="race-sector">Circuito 01 · {race.sector}</div></div><div className="race-position">Posição<strong>{race.position}<span>/{race.racers}</span></strong></div></div>
      <button className={`map-toggle ${race.minimapVisible?"active":""}`} onClick={toggleMap} aria-pressed={race.minimapVisible}>M · Mapa</button>
      {race.minimapVisible&&<aside className="minimap-shell"><div className="minimap-title"><span>Helix Verge</span><b>{race.airborne?"SALTO":race.magnetic?"MAG-LOCK":"ONLINE"}</b></div><TrackMap progress={race.progress}/><div className="minimap-legend"><span><i className="map-you"/>Você</span><span><i className="map-gap"/>Trecho aéreo</span></div></aside>}
      <div className="speed-hud"><div className="speed-number"><strong>{Math.round(race.speed*7.2)}</strong><span>km/h</span></div><div className="energy-label"><span>Fluxo de impulso</span><b>{Math.round(race.boost)}%</b></div><div className="energy-track"><div className={`energy-fill ${race.boost<24?"low":""}`} style={{width:`${race.boost}%`}}/></div></div>
      <div className="lap-hud"><small>Volta {race.lap}/{race.totalLaps}</small><b>{formatTime(race.lapTime)}</b><span>Melhor {race.bestLap===null?"--:--.--":formatTime(race.bestLap)}</span></div>{race.message&&<div key={race.messagePulse} className="race-message">{race.message}</div>}
    </section>}
    {(race.phase==="menu"||race.phase==="paused"||race.phase==="finished")&&<section className="fz-overlay"><div className="fz-grid"/><div className="fz-brief"><div className="fz-eyebrow">Liga experimental · Temporada zero</div><h1>F-Zone<span>Virtual velocity</span></h1><div className="fz-line"/><p>{race.phase==="finished"?`Prova concluída. Melhor volta: ${race.bestLap===null?"--:--.--":formatTime(race.bestLap)}.`:"Atravesse dois saltos orbitais, escale o setor Zenith e mantenha a aderência nos túneis magnéticos. Faça três voltas e use o minimapa para antecipar cada mudança do circuito."}</p><ul className="fz-specs"><li><b>Direção</b>Analógico esquerdo / A D</li><li><b>Propulsão</b>Gatilho direito / W</li><li><b>Mapa</b>Botão Y / M</li></ul><div className="fz-actions"><button className="fz-button" onClick={()=>engineRef.current?.start()}>{race.phase==="paused"?"Retomar":race.phase==="finished"?"Correr novamente":"Iniciar corrida"}</button><button className="fz-button secondary" disabled={!race.vrSupported} onClick={()=>void engineRef.current?.enterVR()}>{race.vrActive?"VR ativo":race.vrSupported?"Entrar em VR":"VR indisponível"}</button></div><div className="fz-status">{race.vrSupported?"Headset WebXR detectado":"Modo desktop · conecte um gamepad ou use o teclado"}</div></div><div className="fz-controls">Esc pausa · M mapa · Shift boost</div></section>}
  </main>;
}
