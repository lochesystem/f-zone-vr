import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import * as THREE from 'three';
import {preparePulseModel,isPulseWindow} from '../app/game/pulse-model.ts';

function sourceModel(){
  const b=fs.readFileSync(new URL('../public/models/pulse.glb',import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');
  const len=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+len)),bin=b.subarray(28+len),p=j.meshes[0].primitives[0];
  const read=(index,Type)=>{const a=j.accessors[index],v=j.bufferViews[a.bufferView],offset=(v.byteOffset??0)+(a.byteOffset??0);return new Type(Uint8Array.from(bin.subarray(offset,offset+a.count*(a.type==='VEC3'?3:1)*Type.BYTES_PER_ELEMENT)).buffer);};
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(read(p.attributes.POSITION,Float32Array),3));g.setIndex(new THREE.BufferAttribute(read(p.indices,Uint32Array),1));const root=new THREE.Group();root.add(new THREE.Mesh(g,new THREE.MeshStandardMaterial()));return root;
}
test('Pulse preserves asset and exterior, rotates export toward -Z and isolates glass',()=>{
  const source=sourceModel(),out=preparePulseModel(source,false),inside=preparePulseModel(source,true),a=source.children[0].geometry.attributes.position,b=out.children[0].geometry.attributes.position;
  assert.equal(source.children[0].geometry.index.count/3,9621);assert.equal(out.children[0].geometry.groups.length,0);
  assert.ok(Math.abs(a.getZ(0)+b.getZ(0))<1e-6);assert.ok(Math.abs(a.getX(0)+b.getX(0))<1e-6);
  const g=inside.children[0].geometry;assert.equal(g.groups.length,2);assert.ok(g.groups[1].count>0);assert.ok(g.groups[0].count>g.index.count*.5);
  assert.equal(inside.children[0].material[1].depthWrite,false);assert.equal(isPulseWindow(.32,.3,0),false);
});
test('Pulse seated forward view is not blocked by opaque hull',()=>{
  const model=preparePulseModel(sourceModel(),true);model.scale.multiplyScalar(.72);model.position.set(0,.02,.62);model.updateMatrixWorld(true);
  const hits=new THREE.Raycaster(new THREE.Vector3(0,1.28,.12),new THREE.Vector3(0,0,-1)).intersectObject(model,true);
  assert.ok(hits.length>0);assert.ok(hits.every(hit=>hit.face.materialIndex===1));
});
