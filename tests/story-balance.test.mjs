import assert from "node:assert/strict";
import test from "node:test";
import { STORY_EVENTS,storyTrackId } from "../app/game/game-data.ts";
import { rivalTargetSpeed } from "../app/game/mechanics.ts";

test("campanha percorre as cinco pistas na ordem da temporada",()=>{
  assert.deepEqual(STORY_EVENTS.map(event=>event.trackId),[
    "helix-verge",
    "rift-ascent",
    "solar-foundry",
    "magma-crown",
    "cloudline-metro",
  ]);
  STORY_EVENTS.forEach((event,index)=>assert.equal(storyTrackId(index),event.trackId));
  assert.equal(storyTrackId(-5),"helix-verge");
  assert.equal(storyTrackId(99),"cloudline-metro");
});

test("IA ocupa uma faixa intermediária e progride sem superar automaticamente o jogador",()=>{
  const openingGrid=Array.from({length:5},(_,index)=>rivalTargetSpeed("story",index,0));
  const finalGrid=Array.from({length:5},(_,index)=>rivalTargetSpeed("story",index,4));
  assert.deepEqual(openingGrid.map(value=>Number(value.toFixed(1))),[103,106.1,109.2,112.3,115.4]);
  assert.deepEqual(finalGrid.map(value=>Number(value.toFixed(1))),[109.2,112.3,115.4,118.5,121.6]);
  assert.ok(finalGrid.at(-1)<126,"a rival mais rápida deve permanecer abaixo da velocidade-base máxima do jogador");
  assert.ok(openingGrid[0]>99,"a abertura precisa ser mais competitiva que o balanceamento anterior");
});
