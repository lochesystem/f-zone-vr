import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createAstraCabin,mountAstraDisplay,ASTRA_DISPLAYS} from '../app/game/astra-cabin.ts';

test('Astra interior closes floor and sides with bounded static geometry',()=>{
  const cabin=createAstraCabin();cabin.updateMatrixWorld(true);
  assert.equal(cabin.children.length,6);
  let triangles=0;
  for(const mesh of cabin.children){const p=mesh.geometry.attributes.position;triangles+=p.count/3;assert.ok([...p.array].every(Number.isFinite));}
  assert.ok(triangles<15000);
  for(const direction of [[0,-1,0],[1,-1,0],[-1,-1,0],[0,-.4,1]]){
    const ray=new THREE.Raycaster(new THREE.Vector3(0,1.28,.12),new THREE.Vector3(...direction).normalize());
    assert.ok(ray.intersectObject(cabin,true).length,'interior covers '+direction);
  }
  assert.equal(new THREE.Raycaster(new THREE.Vector3(0,1.28,.12),new THREE.Vector3(0,0,-1)).intersectObject(cabin,true).length,0);
});

test('Astra instruments sit in front of their bezel, with physical depth',()=>{
  const cabin=createAstraCabin();
  for(const kind of ['speed','map']){
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(kind==='speed'?.38:.48,kind==='speed'?.2:.34),new THREE.MeshBasicMaterial());
    mountAstraDisplay(screen,kind);cabin.add(screen);cabin.updateMatrixWorld(true);
    assert.equal(screen.material.depthTest,true);assert.equal(screen.material.transparent,false);
    const normal=new THREE.Vector3(0,0,1).applyQuaternion(screen.quaternion);
    const ray=new THREE.Raycaster(screen.position.clone().addScaledVector(normal,.15),normal.negate());
    assert.equal(ray.intersectObject(cabin,true)[0].object,screen,'bezel does not hide '+kind);
    assert.equal(screen.position.y,ASTRA_DISPLAYS[kind].position[1]);
  }
});
