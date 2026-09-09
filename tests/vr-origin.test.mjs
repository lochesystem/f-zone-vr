import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {VrOrigin} from '../app/game/vr-origin.ts';

function pose(x,y,z,yaw=0,pitch=0){return {emulatedPosition:false,transform:{position:new THREE.Vector3(x,y,z),orientation:new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'))}};}
const frame=p=>({getViewerPose:()=>p});
const near=(actual,expected)=>assert.ok(actual.distanceTo(expected)<1e-8,`${actual.toArray()} != ${expected.toArray()}`);
function mapped(origin,p){origin.root.updateMatrixWorld(true);return p.clone().applyMatrix4(origin.root.matrixWorld);}

test('seated and standing players start centered at menu eye height, including rotated rooms',()=>{
  for(const height of [1.05,1.75])for(const yaw of [0,Math.PI/2,-Math.PI*.8]){
    const origin=new VrOrigin(),space=new EventTarget(),p=pose(2,height,-3,yaw,.12);
    origin.begin(space);origin.update(frame(p),1.5);
    near(mapped(origin,p.transform.position),new THREE.Vector3(0,1.5,.12));
    const forward=new THREE.Vector3(0,0,-1).applyQuaternion(p.transform.orientation).applyQuaternion(origin.root.quaternion);
    assert.ok(Math.abs(forward.x)<1e-8&&forward.z<-.9);
    assert.ok(forward.y>.1,'head pitch must remain free');
  }
});
test('controllers and head share one transform and preserve physical movement',()=>{
  const origin=new VrOrigin(),p=pose(2,1.1,4,Math.PI/2);origin.begin(new EventTarget());origin.update(frame(p),1.5);
  const hand=new THREE.Vector3(.3,-.4,-.5).applyQuaternion(p.transform.orientation).add(p.transform.position);
  near(mapped(origin,hand),new THREE.Vector3(.3,1.1,-.38));
  const before=origin.root.matrixWorld.clone();origin.update(frame(pose(2.2,1.2,4.1,Math.PI/2)),1.5);
  assert.deepEqual(origin.root.matrixWorld.elements,before.elements,'normal tracking cannot recenter continuously');
});
test('menu/cockpit transitions use separate heights without cumulative offsets',()=>{
  const origin=new VrOrigin(),p=pose(-1,1.8,3);origin.begin(new EventTarget());
  for(const target of [1.5,1.28,1.5,1.28,1.5]){origin.update(frame(p),target);near(mapped(origin,p.transform.position),new THREE.Vector3(0,target,.12));}
});
test('runtime reset recenters position and yaw repeatedly; null tracking waits',()=>{
  const origin=new VrOrigin(),space=new EventTarget();origin.begin(space);origin.update(frame(pose(2,1.2,3)),1.5);
  for(const yaw of [Math.PI/2,-Math.PI/3,0]){
    space.dispatchEvent(new Event('reset'));
    const before=origin.root.matrixWorld.clone();origin.update(frame(null),1.28);assert.deepEqual(origin.root.matrixWorld.elements,before.elements);
    const p=pose(-3,1.65,5,yaw);origin.update(frame(p),1.28);
    near(mapped(origin,p.transform.position),new THREE.Vector3(0,1.28,.12));
  }
  origin.end();near(origin.root.position,new THREE.Vector3());assert.equal(origin.root.quaternion.w,1);
  space.dispatchEvent(new Event('reset'));origin.update(frame(pose(1,1,1)),1.5);near(origin.root.position,new THREE.Vector3());
});
test('an emulated initial pose is not used to calibrate floor height',()=>{
  const origin=new VrOrigin();origin.begin(new EventTarget());const p=pose(0,0,0);p.emulatedPosition=true;
  origin.update(frame(p),1.5);near(origin.root.position,new THREE.Vector3());
  const tracked=pose(1,1.7,2);origin.update(frame(tracked),1.5);near(mapped(origin,tracked.transform.position),new THREE.Vector3(0,1.5,.12));
});
