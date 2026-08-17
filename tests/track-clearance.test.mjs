import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";

const TRACK_WIDTH=48,SAMPLES=720;

async function loadTrack(constant,scale=1.8){
  const source=await readFile(new URL("../app/game/track-data.ts",import.meta.url),"utf8");
  const match=source.match(new RegExp(`${constant}[^=]*=\\s*(\\[[\\s\\S]*?\\]);`));
  assert.ok(match,`${constant} deve continuar sendo uma lista literal auditável`);
  const points=JSON.parse(match[1].replace(/,\s*]/g,"]"));
  return new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point).multiplyScalar(scale)),true,"centripetal");
}

function minimumSeparatedDistance(curve){
  let minimum=Infinity;
  for(let i=0;i<SAMPLES;i++){
    const progress=i/SAMPLES,point=curve.getPointAt(progress);
    for(let j=i+1;j<SAMPLES;j++){
      const otherProgress=j/SAMPLES,separation=Math.min(otherProgress-progress,1-(otherProgress-progress));
      if(separation<.045)continue;
      minimum=Math.min(minimum,point.distanceTo(curve.getPointAt(otherProgress)));
    }
  }
  return minimum;
}

test("Helix Verge preserva a correção contra cruzamentos",async()=>{
  const curve=await loadTrack("TRACK_POINTS"),minimum=minimumSeparatedDistance(curve);
  assert.ok(curve.getLength()>3500,`comprimento de Helix Verge: ${curve.getLength().toFixed(2)}m`);
  assert.ok(minimum>TRACK_WIDTH+12,`distância mínima entre trechos de Helix Verge: ${minimum.toFixed(2)}m`);
});

test("Rift Ascent é longa, larga e não cruza outros trechos",async()=>{
  const curve=await loadTrack("RIFT_ASCENT_POINTS"),minimum=minimumSeparatedDistance(curve);
  assert.ok(curve.getLength()>5000,`comprimento da Rift Ascent: ${curve.getLength().toFixed(2)}m`);
  assert.ok(minimum>TRACK_WIDTH+12,`distância mínima entre trechos da Rift Ascent: ${minimum.toFixed(2)}m`);
});

test("Solar Foundry é longa, recortada e mantém separação segura",async()=>{
  const curve=await loadTrack("SOLAR_FOUNDRY_POINTS"),minimum=minimumSeparatedDistance(curve);
  assert.ok(curve.getLength()>6500,`comprimento da Solar Foundry: ${curve.getLength().toFixed(2)}m`);
  assert.ok(minimum>TRACK_WIDTH+12,`distância mínima entre trechos da Solar Foundry: ${minimum.toFixed(2)}m`);
});

test("corridas completas não terminam em aproximadamente um minuto",async()=>{
  const maximumMetresPerSecond=600/3.6;
  for(const constant of ["TRACK_POINTS","RIFT_ASCENT_POINTS","SOLAR_FOUNDRY_POINTS"]){const curve=await loadTrack(constant),minimumRaceSeconds=curve.getLength()*4/maximumMetresPerSecond;assert.ok(minimumRaceSeconds>85,`${constant}: duração teórica mínima ${minimumRaceSeconds.toFixed(1)}s`);}
});

test("Rift Ascent tem inclinação forte sem mudança vertical instantânea",async()=>{
  const curve=await loadTrack("RIFT_ASCENT_POINTS");let maximumGrade=0,maximumStep=0;
  for(let index=0;index<SAMPLES;index++){
    const tangent=curve.getTangentAt(index/SAMPLES),next=curve.getTangentAt((index+1)/SAMPLES);
    maximumGrade=Math.max(maximumGrade,Math.abs(Math.asin(tangent.y))*180/Math.PI);
    maximumStep=Math.max(maximumStep,tangent.angleTo(next)*180/Math.PI);
  }
  assert.ok(maximumGrade>=28&&maximumGrade<=36,`inclinação máxima progressiva: ${maximumGrade.toFixed(2)}°`);
  assert.ok(maximumStep<7,`mudança angular máxima por amostra: ${maximumStep.toFixed(2)}°`);
});

test("saltos de Rift Ascent mantêm aterrissagens alinhadas",async()=>{
  const curve=await loadTrack("RIFT_ASCENT_POINTS"),gaps=[[.211,.226],[.709,.721]];
  for(const [start,end] of gaps){
    const distance=curve.getPointAt(start).distanceTo(curve.getPointAt(end)),angle=curve.getTangentAt(start).angleTo(curve.getTangentAt(end))*180/Math.PI;
    assert.ok(distance>=60&&distance<=85,`salto deve ter vão controlado, recebeu ${distance.toFixed(2)}m`);
    assert.ok(angle<18,`aterrissagem deve estar alinhada, recebeu ${angle.toFixed(2)}°`);
  }
});

test("Rift Ascent usa cenário isolado e inclinações magnéticas confortáveis",async()=>{
  const source=await readFile(new URL("../app/game/track-data.ts",import.meta.url),"utf8");
  assert.match(source,/environment:"aurora-ridge"/);
  assert.match(source,/magnetic:\[\[\.355,\.435,Math\.PI\*\.32\],\[\.79,\.865,-Math\.PI\*\.18\]\]/);
  assert.doesNotMatch(source,/rift-ascent[\s\S]*?Math\.PI\*\.72/);
});

test("Solar Foundry tem elevação progressiva e saltos alinhados",async()=>{
  const curve=await loadTrack("SOLAR_FOUNDRY_POINTS"),gaps=[[.079,.091],[.618,.63]];let maximumGrade=0,maximumStep=0;
  for(let index=0;index<SAMPLES;index++){
    const tangent=curve.getTangentAt(index/SAMPLES),next=curve.getTangentAt((index+1)/SAMPLES);
    maximumGrade=Math.max(maximumGrade,Math.abs(Math.asin(tangent.y))*180/Math.PI);
    maximumStep=Math.max(maximumStep,tangent.angleTo(next)*180/Math.PI);
  }
  assert.ok(maximumGrade>=24&&maximumGrade<=28,`inclinação máxima da Solar Foundry: ${maximumGrade.toFixed(2)}°`);
  assert.ok(maximumStep<7,`mudança angular máxima da Solar Foundry: ${maximumStep.toFixed(2)}°`);
  for(const [start,end] of gaps){const distance=curve.getPointAt(start).distanceTo(curve.getPointAt(end)),angle=curve.getTangentAt(start).angleTo(curve.getTangentAt(end))*180/Math.PI;assert.ok(distance>=70&&distance<=88,`vão controlado da Solar Foundry: ${distance.toFixed(2)}m`);assert.ok(angle<14,`aterrissagem alinhada da Solar Foundry: ${angle.toFixed(2)}°`);}
});

test("cenário da Solar Foundry permanece fora do volume dirigível",async()=>{
  const engine=await readFile(new URL("../app/game/engine.ts",import.meta.url),"utf8");
  assert.match(engine,/private addSolarFoundry\(\)/);
  assert.match(engine,/radius=1180\+\(index%6\)\*45/);
  assert.match(engine,/radius=1120\+\(index%3\)\*150/);
});

test("seleção de pistas usa o mesmo traçado em miniaturas 3D",async()=>{
  const [preview,ui,engine]=await Promise.all([readFile(new URL("../app/game/track-preview.ts",import.meta.url),"utf8"),readFile(new URL("../app/game/FZoneGame.tsx",import.meta.url),"utf8"),readFile(new URL("../app/game/engine.ts",import.meta.url),"utf8")]);
  assert.match(preview,/getTrackLayout\(trackId\)/);
  assert.match(preview,/createTrackPreviewModel/);
  assert.match(ui,/TrackTurntablePreview/);
  assert.match(engine,/refreshVrTrackPreview/);
  assert.match(engine,/TRAÇADO 3D REAL À DIREITA/);
});
