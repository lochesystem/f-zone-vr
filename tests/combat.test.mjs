import assert from "node:assert/strict";
import test from "node:test";
import { applyAttack,circularDistance,MACHINE_GUN_AMMO,rollWeapon,SHIELD_HITS,STARTING_LIVES,weaponAmmo } from "../app/game/combat.ts";

test("caixas sorteiam as três armas e entregam a munição correta",()=>{
  assert.equal(rollWeapon(()=>0),"machine-gun");
  assert.equal(rollWeapon(()=>.34),"missile");
  assert.equal(rollWeapon(()=>.67),"shield");
  assert.equal(weaponAmmo("machine-gun"),MACHINE_GUN_AMMO);
  assert.equal(MACHINE_GUN_AMMO,20);
  assert.equal(weaponAmmo("missile"),1);
  assert.equal(weaponAmmo("shield"),1);
});

test("escudo absorve dois ataques antes de consumir uma vida",()=>{
  const first=applyAttack(STARTING_LIVES,SHIELD_HITS),second=applyAttack(first.lives,first.shieldHits),third=applyAttack(second.lives,second.shieldHits);
  assert.deepEqual(first,{lives:3,shieldHits:1,destroyed:false,eliminated:false,absorbed:true});
  assert.deepEqual(second,{lives:3,shieldHits:0,destroyed:false,eliminated:false,absorbed:true});
  assert.deepEqual(third,{lives:2,shieldHits:0,destroyed:true,eliminated:false,absorbed:false});
});

test("terceira destruição elimina a nave",()=>{
  assert.equal(applyAttack(2,0).lives,1);
  assert.deepEqual(applyAttack(1,0),{lives:0,shieldHits:0,destroyed:true,eliminated:true,absorbed:false});
});

test("distância circular encontra alvos à frente na troca de volta",()=>{
  assert.equal(circularDistance(5,995,1000),10);
  assert.equal(circularDistance(995,5,1000),-10);
});
