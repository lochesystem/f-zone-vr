"use client";

import { useEffect,useRef,useState } from "react";
import * as THREE from "three";
import { FZoneEngine } from "./engine";
import { formatTime } from "./mechanics";
import { GAP_RANGES,TRACK_POINTS,isGap } from "./track-data";
import { INITIAL_SNAPSHOT,type OpponentMarker,type RaceSnapshot } from "./types";

const MAP_CURVE=new THREE.CatmullRomCurve3(TRACK_POINTS.map(point=>new THREE.Vector3(...point)),true,"centripetal");

function TrackMap({progress,opponents}:{progress:number;opponents:OpponentMarker[]}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current,context=canvas?.getContext("2d");if(!canvas||!context)return;
    const width=canvas.width,height=canvas.height;
    const project=(point:{x:number;z:number})=>({x:24+(point.x+250)/530*(width-48),y:20+(210-point.z)/385*(height-40)}),mapPoint=(p:number,lane=0)=>{const center=MAP_CURVE.getPointAt(p),tangent=MAP_CURVE.getTangentAt(p).normalize(),right=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();return project(center.clone().addScaledVector(right,lane));};
    context.clearRect(0,0,width,height);context.fillStyle="rgba(2,12,20,.94)";context.fillRect(0,0,width,height);
    context.strokeStyle="rgba(105,246,255,.12)";context.lineWidth=1;for(let x=0;x<width;x+=24){context.beginPath();context.moveTo(x,0);context.lineTo(x,height);context.stroke();}for(let y=0;y<height;y+=24){context.beginPath();context.moveTo(0,y);context.lineTo(width,y);context.stroke();}
    context.strokeStyle="#69f6ff";context.lineWidth=6;context.lineJoin="round";context.lineCap="round";let drawing=false;for(let index=0;index<=240;index++){const p=index/240;if(isGap(p)){if(drawing)context.stroke();drawing=false;continue;}const mapped=project(MAP_CURVE.getPointAt(p));if(!drawing){context.beginPath();context.moveTo(mapped.x,mapped.y);drawing=true;}else context.lineTo(mapped.x,mapped.y);}if(drawing)context.stroke();
    context.strokeStyle="#ffc25e";context.lineWidth=3;context.setLineDash([7,6]);for(const [start,end] of GAP_RANGES){context.beginPath();for(let index=0;index<=12;index++){const mapped=project(MAP_CURVE.getPointAt(start+(end-start)*index/12));if(index===0)context.moveTo(mapped.x,mapped.y);else context.lineTo(mapped.x,mapped.y);}context.stroke();}context.setLineDash([]);
    opponents.forEach(opponent=>{const marker=mapPoint(opponent.progress,opponent.lane);context.fillStyle=opponent.color;context.strokeStyle="#031018";context.lineWidth=2;context.beginPath();context.arc(marker.x,marker.y,4.5,0,Math.PI*2);context.fill();context.stroke();});
    const player=mapPoint(progress);context.fillStyle=isGap(progress)?"#ffc25e":"#ff3e93";context.shadowColor=context.fillStyle;context.shadowBlur=12;context.beginPath();context.arc(player.x,player.y,7,0,Math.PI*2);context.fill();context.shadowBlur=0;
  },[opponents,progress]);
  return <canvas ref={canvasRef} width={360} height={300} className="track-map-canvas" aria-label="Minimapa do circuito Helix Verge"/>;
}

export function FZoneGame(){
  const canvasRef=useRef<HTMLCanvasElement>(null),engineRef=useRef<FZoneEngine|null>(null);const [race,setRace]=useState<RaceSnapshot>(INITIAL_SNAPSHOT),[xrError,setXrError]=useState("");
  useEffect(()=>{if(!canvasRef.current)return;const engine=new FZoneEngine(canvasRef.current,setRace);engineRef.current=engine;return()=>{engine.destroy();engineRef.current=null;};},[]);
  const toggleMap=()=>engineRef.current?.toggleMinimap();
  const enterVR=()=>{const engine=engineRef.current;if(!engine)return;setXrError("");void engine.enterVR().catch(error=>setXrError(error instanceof Error?error.message:"Não foi possível iniciar o modo VR"));};
  const displaySpeed=race.speed<.75?0:Math.round(race.speed*7.2),nearestOpponents=[...race.opponents].sort((a,b)=>Math.abs(a.delta)-Math.abs(b.delta)).slice(0,3);
  return <main className="fz-shell">
    <canvas ref={canvasRef} className="fz-canvas" aria-label="F-Zone VR, corrida antigravidade futurista"/><div className="fz-grain"/><div className={`boost-fx ${race.boosting?"active":""}`} aria-hidden="true"/><div key={race.impactPulse} className={`fz-vignette ${race.impactPulse?"hit":""}`}/>
    {race.phase!=="menu"&&<section className="race-hud" aria-live="polite">
      <div className="race-top"><div><div className="race-brand"><i/> F-Zone VR</div><div className="race-sector">Circuito 01 · {race.sector}</div></div><div className="race-standing"><div className="race-position">Posição<strong>{race.position}<span>/{race.racers}</span></strong></div><div className="opponent-radar">{nearestOpponents.map(opponent=><div key={`${opponent.color}-${opponent.place}`}><i style={{background:opponent.color}}/><b>P{opponent.place}</b><span>{opponent.delta>=0?"+":"−"}{Math.round(Math.abs(opponent.delta))} m</span></div>)}</div></div></div>
      <button className={`map-toggle ${race.minimapVisible?"active":""}`} onClick={toggleMap} aria-pressed={race.minimapVisible}>M · Mapa</button>
      {race.minimapVisible&&<aside className="minimap-shell"><div className="minimap-title"><span>Helix Verge</span><b>{race.airborne?"SALTO":race.magnetic?"MAG-LOCK":"ONLINE"}</b></div><TrackMap progress={race.progress} opponents={race.opponents}/><div className="minimap-legend"><span><i className="map-you"/>Você</span><span><i className="map-rival"/>Rivais</span><span><i className="map-gap"/>Trecho aéreo</span></div></aside>}
      <div className="speed-hud"><div className="speed-label">Velocidade</div><div className="speed-number"><strong>{displaySpeed}</strong><span><b>km/h</b><small>{race.boosting?"Nitro":"Propulsão"}</small></span></div>{(race.drafting||race.drifting||race.boosting)&&<div className={`race-technique ${race.drafting?"drafting":""} ${race.boosting?"nitro":""}`}>{race.boosting?"Nitro ativo":race.drafting?"Vácuo ativo + velocidade":"Derrapagem"}</div>}<div className="energy-label"><span>Fluxo de impulso</span><b>{Math.round(race.boost)}%</b></div><div className="energy-track"><div className={`energy-fill ${race.boost<24?"low":""}`} style={{width:`${race.boost}%`}}/></div></div>
      <div className="lap-hud"><small>Volta {race.lap}/{race.totalLaps}</small><b>{formatTime(race.lapTime)}</b><span>Melhor {race.bestLap===null?"--:--.--":formatTime(race.bestLap)}</span></div>{race.message&&<div key={race.messagePulse} className="race-message">{race.message}</div>}
    </section>}
    {(race.phase==="menu"||race.phase==="paused"||race.phase==="finished")&&<section className="fz-overlay"><div className="fz-grid"/><div className="fz-brief"><div className="fz-eyebrow">Liga experimental · Temporada zero</div><h1>F-Zone<span>Virtual velocity</span></h1><div className="fz-line"/><p>{race.phase==="finished"?`Prova concluída. Melhor volta: ${race.bestLap===null?"--:--.--":formatTime(race.bestLap)}.`:"Atravesse dois saltos orbitais, dispute espaço com os rivais e use o vácuo antes da ultrapassagem. Freio e direção juntos iniciam uma derrapagem controlada."}</p><ul className="fz-specs"><li><b>Direção</b>Analógico com inércia / A D</li><li><b>Derrapagem</b>Freio + direção</li><li><b>Mapa</b>Botão Y / M</li></ul><div className="fz-actions"><button className="fz-button" disabled={!race.vrChecked||race.vrActive} onClick={enterVR}>{race.vrActive?"VR ativo":!race.vrChecked?"Preparando WebXR":race.vrSupported?"Entrar em VR":"Tentar entrar em VR"}</button><button className="fz-button secondary" onClick={()=>engineRef.current?.start()}>{race.phase==="paused"?"Retomar na tela":race.phase==="finished"?"Correr na tela":"Jogar na tela"}</button></div><div className={`fz-status ${xrError?"error":""}`}>{xrError||(!race.vrChecked?"Preparando o acesso imersivo":race.vrSupported?"Meta Quest detectado · selecione Entrar em VR":race.vrApiAvailable?"API WebXR presente · tentativa direta liberada":"WebXR não detectado · use o Meta Quest Browser em HTTPS")}</div></div><div className="fz-controls">Esc pausa · M mapa · Shift boost</div></section>}
  </main>;
}
