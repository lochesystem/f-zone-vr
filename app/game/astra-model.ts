import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// The Tripo export faces -Z, with Y up. Keep the original asset untouched.
let template:Promise<THREE.Group>|undefined;
function loadAstra(){
  return template??=new GLTFLoader().loadAsync(new URL("models/astra.glb",document.baseURI).href).then(gltf=>gltf.scene).catch(error=>{template=undefined;throw error;});
}

export function isAstraWindow(x:number,y:number,z:number){
  return y>.155 && (x/.135)**2+((z+.055)/.33)**2<1;
}

export function prepareAstraModel(source:THREE.Group,interior:boolean){
  const model=source.clone(true);
  model.name=interior?"astra-interior-hull":"astra-glb";
  model.scale.setScalar(interior?8:6);
  model.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    object.geometry=object.geometry.clone();
    const original=Array.isArray(object.material)?object.material[0]:object.material;
    const material=original.clone() as THREE.MeshStandardMaterial;
    material.side=THREE.FrontSide;material.metalness=.35;material.roughness=.42;
    // Texture belongs to the cached template and is shared across instances (Quest memory).
    // Per-instance cleanup disposes materials/geometry, never this shared texture.
    object.material=material;
    if(!interior)return;
    const geometry=object.geometry,position=geometry.getAttribute("position"),indices=geometry.index;
    if(!indices)return;
    const hull:number[]=[],window:number[]=[];
    for(let i=0;i<indices.count;i+=3){
      const a=indices.getX(i),b=indices.getX(i+1),c=indices.getX(i+2);
      const x=(position.getX(a)+position.getX(b)+position.getX(c))/3;
      const y=(position.getY(a)+position.getY(b)+position.getY(c))/3;
      const z=(position.getZ(a)+position.getZ(b)+position.getZ(c))/3;
      (isAstraWindow(x,y,z)?window:hull).push(a,b,c);
    }
    geometry.setIndex([...hull,...window]);geometry.clearGroups();
    geometry.addGroup(0,hull.length,0);geometry.addGroup(hull.length,window.length,1);
    // No screen-space refraction or transmission pass on Quest. Nearly invisible glass.
    const glass=new THREE.MeshBasicMaterial({color:0xb9faff,transparent:true,opacity:.025,depthWrite:false,side:THREE.DoubleSide});
    object.material=[material,glass];
  });
  return model;
}

export function attachAstraModel(root:THREE.Group,interior:boolean){
  const fallback=[...root.children].filter(child=>child.name!=="propulsion-trail");
  // Existing engine/preview cleanup disposes geometry even when it keeps the parent.
  for(const child of fallback)child.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.addEventListener("dispose",()=>{if(!root.userData.installingModel)root.userData.disposed=true;});});
  void loadAstra().then(source=>{
    if(root.userData.disposed)return;
    root.userData.installingModel=true;
    for(const child of fallback){root.remove(child);child.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});}
    root.add(prepareAstraModel(source,interior));
    const trail=root.getObjectByName("propulsion-trail");
    trail?.children.forEach((jet,index)=>jet.position.set((index===0?-1:1)*(interior?1.3:.975),interior?.85:.64,interior?3.85:2.89));
    root.userData.modelLoaded=true;
    root.userData.installingModel=false;
  }).catch(error=>{console.warn("Astra GLB unavailable; retaining procedural ship",error);});
}
