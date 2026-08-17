import * as THREE from "three";
import { getTrackLayout,isGap,isEnergyZone } from "./track-data";

const PREVIEW_SAMPLES=240;
const TRACK_WIDTH=48;

function previewCurve(trackId:string){
  const layout=getTrackLayout(trackId);
  return {layout,curve:new THREE.CatmullRomCurve3(layout.points.map(point=>new THREE.Vector3(...point).multiplyScalar(layout.scale)),true,"centripetal")};
}

function sideAt(curve:THREE.CatmullRomCurve3,progress:number){
  const tangent=curve.getTangentAt(progress).normalize(),side=new THREE.Vector3(tangent.z,0,-tangent.x);
  if(side.lengthSq()<.0001)side.set(1,0,0);
  return side.normalize();
}

function addRibbon(group:THREE.Group,trackId:string){
  const {layout,curve}=previewCurve(trackId),positions:number[]=[],colors:number[]=[],trackColor=new THREE.Color(layout.theme.track),stripeColor=new THREE.Color(layout.theme.stripe);
  for(let index=0;index<PREVIEW_SAMPLES;index++){
    const start=index/PREVIEW_SAMPLES,end=(index+1)/PREVIEW_SAMPLES,middle=(start+end)/2;
    if(isGap(start,layout)||isGap(end,layout)||isGap(middle,layout))continue;
    const a=curve.getPointAt(start),b=curve.getPointAt(end),sideA=sideAt(curve,start),sideB=sideAt(curve,end),half=TRACK_WIDTH/2;
    const leftA=a.clone().addScaledVector(sideA,-half),rightA=a.clone().addScaledVector(sideA,half),leftB=b.clone().addScaledVector(sideB,-half),rightB=b.clone().addScaledVector(sideB,half);
    positions.push(...leftA.toArray(),...rightA.toArray(),...leftB.toArray(),...rightA.toArray(),...rightB.toArray(),...leftB.toArray());
    const color=index%12<2?stripeColor:trackColor;for(let vertex=0;vertex<6;vertex++)colors.push(color.r,color.g,color.b);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
  group.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,metalness:.82,roughness:.28,side:THREE.DoubleSide})));
}

function addRails(group:THREE.Group,trackId:string){
  const {layout,curve}=previewCurve(trackId),positions:number[]=[];
  for(let index=0;index<PREVIEW_SAMPLES;index++){
    const start=index/PREVIEW_SAMPLES,end=(index+1)/PREVIEW_SAMPLES,middle=(start+end)/2;if(isGap(start,layout)||isGap(end,layout)||isGap(middle,layout))continue;
    for(const direction of [-1,1]){const a=curve.getPointAt(start).addScaledVector(sideAt(curve,start),direction*TRACK_WIDTH/2),b=curve.getPointAt(end).addScaledVector(sideAt(curve,end),direction*TRACK_WIDTH/2);positions.push(...a.toArray(),...b.toArray());}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
  group.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:layout.theme.rail,transparent:true,opacity:.95,toneMapped:false})));
}

function addSpecialSections(group:THREE.Group,trackId:string){
  const {layout,curve}=previewCurve(trackId),energyPositions:number[]=[];
  for(let index=0;index<PREVIEW_SAMPLES;index++){
    const start=index/PREVIEW_SAMPLES,end=(index+1)/PREVIEW_SAMPLES,middle=(start+end)/2;if(!isEnergyZone(middle,layout)||isGap(middle,layout))continue;
    for(const direction of [-1,1]){const a=curve.getPointAt(start).addScaledVector(sideAt(curve,start),direction*(TRACK_WIDTH/2-3)),b=curve.getPointAt(end).addScaledVector(sideAt(curve,end),direction*(TRACK_WIDTH/2-3));a.y+=1;b.y+=1;energyPositions.push(...a.toArray(),...b.toArray());}
  }
  const energyGeometry=new THREE.BufferGeometry();energyGeometry.setAttribute("position",new THREE.Float32BufferAttribute(energyPositions,3));group.add(new THREE.LineSegments(energyGeometry,new THREE.LineBasicMaterial({color:0x4dffb8,toneMapped:false})));
  for(const [start,end] of layout.gaps){const points=Array.from({length:18},(_,index)=>curve.getPointAt(start+(end-start)*index/17)),geometry=new THREE.BufferGeometry().setFromPoints(points),line=new THREE.Line(geometry,new THREE.LineDashedMaterial({color:0xffc25e,dashSize:10,gapSize:7,toneMapped:false}));line.computeLineDistances();group.add(line);}
  const markerGeometry=new THREE.SphereGeometry(5.5,10,7),markerMaterial=new THREE.MeshBasicMaterial({color:layout.theme.accent,toneMapped:false});for(const progress of layout.boostPads){const marker=new THREE.Mesh(markerGeometry,markerMaterial);marker.position.copy(curve.getPointAt(progress));marker.position.y+=2;group.add(marker);}
}

export function createTrackPreviewModel(trackId:string,targetSpan=5.2){
  const {curve}=previewCurve(trackId),content=new THREE.Group(),root=new THREE.Group();addRibbon(content,trackId);addRails(content,trackId);addSpecialSections(content,trackId);
  const samples=Array.from({length:PREVIEW_SAMPLES},(_,index)=>curve.getPointAt(index/PREVIEW_SAMPLES)),bounds=new THREE.Box3().setFromPoints(samples),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3()),scale=targetSpan/Math.max(size.x,size.z,1);content.scale.setScalar(scale);content.position.copy(center).multiplyScalar(-scale);root.add(content);root.userData.trackId=trackId;root.userData.previewScale=scale;return root;
}

export function disposeTrackPreview(root:THREE.Object3D){
  const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(object=>{if(!(object instanceof THREE.Mesh||object instanceof THREE.Line||object instanceof THREE.LineSegments))return;geometries.add(object.geometry);const entries=Array.isArray(object.material)?object.material:[object.material];entries.forEach(material=>materials.add(material));});geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());
}
