import assert from 'node:assert/strict';
import test from 'node:test';
import {menuCardLayout,menuHit,sweptHit,steerShip,collisionRetention} from '../app/game/race-systems.ts';

test('laser selects every visible VR option including handedness and back',()=>{
  for(const [step,count] of [['options',6],['ship',5],['track',5],['pause',5]]){
    const box=menuCardLayout(step,count);
    for(let i=0;i<count;i++){
      const y=box.top+i*(box.height+box.gap);
      assert.ok(y+box.height<=720,`${step} ${i} outside canvas`);
      assert.equal(menuHit(step,count,box.x+20,y+box.height/2),i);
      assert.equal(menuHit(step,count,box.x+20,y+box.height+2),null);
    }
    assert.equal(menuHit(step,count,0,300),null);
  }
});
test('fast shot hits an opponent between frames and does not hit outside its segment',()=>{
  const start={x:0,y:0,z:0},end={x:0,y:0,z:-12};
  assert.ok(sweptHit(start,end,{x:0,y:0,z:-6},2));
  assert.ok(!sweptHit(start,end,{x:4,y:0,z:-6},2));
  assert.ok(!sweptHit(start,end,{x:0,y:0,z:-16},2));
  assert.ok(sweptHit(start,start,start,2));
});
test('steering changes trajectory and countersteering reverses lateral motion',()=>{
  let state={heading:0,lateralVelocity:0,forwardSpeed:100};
  for(let i=0;i<120;i++)state=steerShip(state.heading,state.lateralVelocity,1,100,4,0,false,0,1/120);
  assert.ok(state.heading>0&&state.lateralVelocity>10&&state.forwardSpeed<100);
  for(let i=0;i<120;i++)state=steerShip(state.heading,state.lateralVelocity,-1,100,4,0,false,0,1/120);
  assert.ok(state.lateralVelocity<0);
  const parked=steerShip(0,0,1,0,4,0,false,0,.02);
  assert.equal(parked.lateralVelocity,0);
});
test('steering remains similar at 72 and 120 Hz and curves require correction',()=>{
  const simulate=hz=>{let s={heading:0,lateralVelocity:0};for(let i=0;i<hz*2;i++)s=steerShip(s.heading,s.lateralVelocity,.4,100,4,0,false,0,1/hz);return s;};
  assert.ok(Math.abs(simulate(72).lateralVelocity-simulate(120).lateralVelocity)<.4);
  assert.ok(steerShip(0,0,0,100,4,0,false,.02,.02).heading<0);
  assert.ok(collisionRetention(5)>collisionRetention(1));
});
