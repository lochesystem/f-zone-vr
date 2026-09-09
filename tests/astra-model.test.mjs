import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import * as THREE from 'three';
import {prepareAstraModel,isAstraWindow} from '../app/game/astra-model.ts';

function sourceModel(){
  const bytes=fs.readFileSync(new URL('../public/models/astra.glb',import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'glTF');
  const jsonLength=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+jsonLength));
  const bin=bytes.subarray(28+jsonLength),primitive=json.meshes[0].primitives[0];
  const read=(accessorIndex,Type)=>{const a=json.accessors[accessorIndex],v=json.bufferViews[a.bufferView],chunk=bin.subarray(v.byteOffset+(a.byteOffset??0),v.byteOffset+(a.byteOffset??0)+a.count*(a.type==='VEC3'?3:1)*Type.BYTES_PER_ELEMENT);return new Type(Uint8Array.from(chunk).buffer);};
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(read(primitive.attributes.POSITION,Float32Array),3));geometry.setIndex(new THREE.BufferAttribute(read(primitive.indices,Uint32Array),1));
  const source=new THREE.Group();source.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial()));return source;
}
test('Astra asset retains its original exterior and creates separate cockpit glass',()=>{
  const source=sourceModel(),outside=prepareAstraModel(source,false),inside=prepareAstraModel(source,true);
  assert.equal(source.children[0].geometry.index.count/3,10033);
  assert.equal(outside.children[0].geometry.groups.length,0);
  const mesh=inside.children[0];assert.equal(mesh.geometry.groups.length,2);
  assert.ok(mesh.geometry.groups[1].count>0);
  assert.ok(mesh.geometry.groups[0].count>mesh.geometry.index.count*.5);
  assert.equal(mesh.material[1].depthWrite,false);assert.ok(mesh.material[1].opacity<.05);
  assert.notEqual(mesh.geometry,source.children[0].geometry);
  assert.ok(!isAstraWindow(0,.11,-.48),'nose remains solid');
  assert.ok(!isAstraWindow(.35,.2,.3),'wings remain solid');
});
test('forward view from the Astra seat does not hit opaque hull',()=>{
  const model=prepareAstraModel(sourceModel(),true);model.updateMatrixWorld(true);
  // Player scale .72 and rig offset (.02,.62), measured against the actual GLB.
  const eye=new THREE.Vector3(0,(1.28-.02)/.72,(.12-.62)/.72);
  const ray=new THREE.Raycaster(eye,new THREE.Vector3(0,0,-1));
  const hits=ray.intersectObject(model,true);
  assert.ok(hits.length>0,'ray passes through canopy');
  assert.ok(hits.every(hit=>hit.face.materialIndex===1),'forward opening contains only transparent glass');
});
