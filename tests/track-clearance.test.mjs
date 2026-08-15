import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";

const TRACK_WIDTH=16;

async function loadTrack(){
  const source=await readFile(new URL("../app/game/track-data.ts",import.meta.url),"utf8");
  const match=source.match(/TRACK_POINTS[^=]*=\s*(\[[\s\S]*?\]);/);
  assert.ok(match,"TRACK_POINTS deve continuar sendo uma lista literal");
  const points=JSON.parse(match[1].replace(/,\s*]/g,"]"));
  return new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point)),true,"centripetal");
}

test("mantém corredores separados nos cruzamentos da pista",async()=>{
  const curve=await loadTrack();
  let minimumDistance=Infinity;
  const samples=520;
  for(let i=0;i<samples;i++){
    const progress=i/samples,point=curve.getPointAt(progress);
    for(let j=i+1;j<samples;j++){
      const otherProgress=j/samples,separation=Math.min(otherProgress-progress,1-(otherProgress-progress));
      if(separation<.04)continue;
      minimumDistance=Math.min(minimumDistance,point.distanceTo(curve.getPointAt(otherProgress)));
    }
  }
  assert.ok(minimumDistance>TRACK_WIDTH*1.5,`distância mínima entre trechos: ${minimumDistance.toFixed(2)}m`);
});
