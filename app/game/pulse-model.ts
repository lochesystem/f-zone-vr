import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let template:Promise<THREE.Group>|undefined;
export function isPulseWindow(x:number,y:number,z:number){return y>.23 && (x/.115)**2+((z-.035)/.29)**2<1;}

export function preparePulseModel(source:THREE.Group,interior:boolean){
  const model=source.clone(true);model.name=interior?"pulse-interior-hull":"pulse-glb";model.scale.setScalar(interior?8:6);
  model.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    const geometry=object.geometry.clone(),position=geometry.getAttribute("position"),indices=geometry.index;
    const original=Array.isArray(object.material)?object.material[0]:object.material;
    const material=original.clone() as THREE.MeshStandardMaterial;material.side=THREE.FrontSide;material.metalness=.35;material.roughness=.42;object.material=material;
    if(interior&&indices){
      const hull:number[]=[],window:number[]=[];
      for(let i=0;i<indices.count;i+=3){const a=indices.getX(i),b=indices.getX(i+1),c=indices.getX(i+2);const x=(position.getX(a)+position.getX(b)+position.getX(c))/3,y=(position.getY(a)+position.getY(b)+position.getY(c))/3,z=(position.getZ(a)+position.getZ(b)+position.getZ(c))/3;(isPulseWindow(x,y,z)?window:hull).push(a,b,c);}
      geometry.setIndex([...hull,...window]);geometry.clearGroups();geometry.addGroup(0,hull.length,0);geometry.addGroup(hull.length,window.length,1);
      object.material=[material,new THREE.MeshBasicMaterial({color:0xcfc1ff,transparent:true,opacity:.025,depthWrite:false,side:THREE.DoubleSide})];
    }
    // Export faces +Z. Move the cockpit around the existing seat, never the XR origin.
    geometry.rotateY(Math.PI);if(interior)geometry.translate(0,-.12,-.167);object.geometry=geometry;
  });return model;
}

export function attachPulseModel(root:THREE.Group,interior:boolean){
  const fallback=[...root.children].filter(child=>child.name!=="propulsion-trail");
  for(const child of fallback)child.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.addEventListener("dispose",()=>{if(!root.userData.installingModel)root.userData.disposed=true;});});
  template??=new GLTFLoader().loadAsync(new URL("models/pulse.glb",document.baseURI).href).then(gltf=>gltf.scene).catch(error=>{template=undefined;throw error;});
  void template.then(source=>{
    if(root.userData.disposed)return;root.userData.installingModel=true;
    for(const child of fallback){root.remove(child);child.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());}});}
    root.add(preparePulseModel(source,interior));
    const scale=interior?8:6;root.getObjectByName("propulsion-trail")?.children.forEach((jet,index)=>jet.position.set((index===0?-1:1)*.32*scale,(.18-(interior?.12:0))*scale,(.44-(interior?.167:0))*scale));
    root.userData.modelLoaded=true;root.userData.installingModel=false;
  }).catch(error=>console.warn("Pulse GLB unavailable; retaining procedural ship",error));
}
