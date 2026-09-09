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

export function createAstraCabin(){
  const cabin=new THREE.Group();cabin.name="astra-window-frame";
  const trim=new THREE.MeshStandardMaterial({color:0x10262c,metalness:.6,roughness:.42});
  const dark=new THREE.MeshStandardMaterial({color:0x050c10,metalness:.15,roughness:.8});
  const rail=(points:THREE.Vector3[],radius:number)=>{
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,radius,6,false),trim);cabin.add(mesh);
  };
  // Panoramic canopy with no central pillar. The eye remains at the normal rig origin.
  for(const side of [-1,1]){
    rail([new THREE.Vector3(side*.7,.55,.75),new THREE.Vector3(side*.78,1.35,.48),new THREE.Vector3(side*.65,1.96,-.28),new THREE.Vector3(side*.56,1.3,-1.05),new THREE.Vector3(side*.45,.66,-1.32)],.027);
    rail([new THREE.Vector3(side*.7,.56,.8),new THREE.Vector3(side*.65,.61,-.6),new THREE.Vector3(side*.45,.66,-1.32)],.04);
  }
  rail([new THREE.Vector3(-.45,.66,-1.32),new THREE.Vector3(0,.64,-1.47),new THREE.Vector3(.45,.66,-1.32)],.035);
  // Small recessed instrument mounts, not a full-width dashboard.
  for(const side of [-1,1]){
    const mount=new THREE.Mesh(new THREE.BoxGeometry(.43,.025,.25),dark);mount.position.set(side*.52,.64,-.73);mount.rotation.x=-.35;cabin.add(mount);
  }
  const floor=new THREE.Mesh(new THREE.BoxGeometry(1.15,.035,1.55),dark);floor.position.set(0,.13,.24);cabin.add(floor);
  const seat=new THREE.Mesh(new THREE.BoxGeometry(.57,.8,.12),dark);seat.position.set(0,.62,.76);cabin.add(seat);
  return cabin;
}
