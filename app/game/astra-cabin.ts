import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Display pose and bezel share the same source of truth. Coordinates are in pilot-rig space.
export const ASTRA_DISPLAYS={
  speed:{position:[0,.79,-1.03],rotation:[-.26,0,0],size:[.5,.25]},
  map:{position:[.46,.67,-.87],rotation:[-.32,-.35,0],size:[.31,.22]},
} as const;

export function mountAstraDisplay(mesh:THREE.Mesh,kind:keyof typeof ASTRA_DISPLAYS){
  const spec=ASTRA_DISPLAYS[kind];mesh.position.set(spec.position[0],spec.position[1],spec.position[2]);mesh.rotation.set(spec.rotation[0],spec.rotation[1],spec.rotation[2]);
  const original=kind==="speed"?[.38,.2]:[.48,.34];mesh.scale.set(spec.size[0]/original[0],spec.size[1]/original[1],1);
  const material=mesh.material as THREE.MeshBasicMaterial;
  material.depthTest=true;material.depthWrite=true;material.transparent=false;material.side=THREE.FrontSide;material.needsUpdate=true;
  mesh.renderOrder=0;
}

export function createAstraCabin(pulse=false){
  const cabin=new THREE.Group();cabin.name=pulse?"pulse-interior":"astra-interior";
  const materials={
    shell:new THREE.MeshStandardMaterial({color:0x183239,metalness:.48,roughness:.55,emissive:0x10282c,emissiveIntensity:.17,side:THREE.DoubleSide}),
    dark:new THREE.MeshStandardMaterial({color:0x081217,metalness:.25,roughness:.72,emissive:0x07151b,emissiveIntensity:.22}),
    rubber:new THREE.MeshStandardMaterial({color:0x17212a,roughness:.95,emissive:0x10181e,emissiveIntensity:.15}),
    metal:new THREE.MeshStandardMaterial({color:0x526971,metalness:.65,roughness:.4}),
    cyan:new THREE.MeshBasicMaterial({color:0x4daab6,toneMapped:false}),
    amber:new THREE.MeshBasicMaterial({color:0xb78843,toneMapped:false}),
  };
  type Surface=keyof typeof materials;
  if(pulse){materials.shell.color.set(0x30213f);materials.shell.emissive.set(0x251638);materials.cyan.color.set(0x9c83dc);materials.amber.color.set(0x83c6d2);}
  const batches=new Map<Surface,THREE.BufferGeometry[]>();
  const add=(geometry:THREE.BufferGeometry,surface:Surface,position:readonly number[]=[0,0,0],rotation:readonly number[]=[0,0,0])=>{
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(position[0],position[1],position[2]),new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation[0],rotation[1],rotation[2])),new THREE.Vector3(1,1,1));
    const plain=geometry.index?geometry.toNonIndexed():geometry;plain.deleteAttribute("uv");plain.applyMatrix4(matrix);
    if(plain!==geometry)geometry.dispose();const list=batches.get(surface)??[];list.push(plain);batches.set(surface,list);
  };
  const box=(size:readonly number[],position:readonly number[],surface:Surface,rotation:readonly number[]=[0,0,0])=>add(new THREE.BoxGeometry(size[0],size[1],size[2]),surface,position,rotation);
  const plate=(width:number,height:number,depth:number)=>{
    const x=width/2,y=height/2,c=Math.min(.035,width*.12,height*.18),shape=new THREE.Shape();
    shape.moveTo(-x+c,-y);shape.lineTo(x-c,-y);shape.lineTo(x,-y+c);shape.lineTo(x,y-c);shape.lineTo(x-c,y);shape.lineTo(-x+c,y);shape.lineTo(-x,y-c);shape.lineTo(-x,-y+c);shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.007,bevelThickness:.005});geometry.translate(0,0,-depth);return geometry;
  };
  const rail=(points:number[][],radius:number,surface:Surface="shell")=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),20,radius,6,false),surface);

  // Continuous cockpit tub: floor and wraparound liners meet at every lower edge.
  const outline=[[-.55,-1.48],[.55,-1.48],[.82,-.72],[.84,.95],[-.84,.95],[-.82,-.72]];
  const floorShape=new THREE.Shape();outline.forEach(([x,z],i)=>i?floorShape.lineTo(x,z):floorShape.moveTo(x,z));floorShape.closePath();
  const floor=new THREE.ExtrudeGeometry(floorShape,{depth:.06,bevelEnabled:false});floor.rotateX(Math.PI/2);floor.translate(0,.13,0);add(floor,"dark");
  const wallPositions:number[]=[],wallIndices:number[]=[];
  outline.forEach(([x,z],i)=>{const top=z>.9?1.12:.68;wallPositions.push(x,.08,z,x,top,z);const n=(i+1)%outline.length;wallIndices.push(i*2,n*2,i*2+1,n*2,n*2+1,i*2+1);});
  const liner=new THREE.BufferGeometry();liner.setAttribute("position",new THREE.Float32BufferAttribute(wallPositions,3));liner.setIndex(wallIndices);liner.computeVertexNormals();add(liner,"shell");
  // Seams, non-slip footwell and pedals make the floor read as an actual interior.
  for(const side of [-1,1]){
    box([.38,.018,1.2],[side*.24,.143,-.22],"rubber");
    for(let i=0;i<10;i++)box([.32,.008,.012],[side*.24,.157,-.75+i*.105],"metal");
    box([.24,.035,.32],[side*.24,.22,-.93],"metal",[-.5,0,0]);
    box([.016,.016,1.25],[side*.63,.18,-.06],"cyan");
    box([.14,.21,1.35],[side*.7,.38,-.08],"dark");
    box([.18,.055,1.27],[side*.68,.51,-.04],"shell");
    rail([[side*.7,.57,.82],[side*.73,.67,-.5],[side*.5,.68,-1.4]],.036);
    rail([[side*.7,.57,.75],[side*.78,1.35,.48],[side*.65,1.96,-.28],[side*.56,1.3,-1.05],[side*.45,.66,-1.32]],.025);
    for(let i=0;i<4;i++)box([.012,.09,.055],[side*.775,.45,-.25+i*.16],"metal");
  }
  rail([[-.45,.66,-1.32],[0,.64,-1.47],[.45,.66,-1.32]],.035);
  // Seat, rear bulkhead and console supports close views down, to the sides and behind.
  add(plate(.62,.7,.1),"rubber",[0,.67,.78],[.12,0,0]);
  box([.6,.13,.56],[0,.28,.38],"rubber");
  add(plate(.3,.23,.1),"rubber",[0,1.1,.83]);
  box([.48,.34,.36],[0,.45,-1.15],"dark");
  for(const side of [-1,1])box([.19,.16,.3],[side*.57,.43,-1.02],"dark");

  for(const [kind,spec] of Object.entries(ASTRA_DISPLAYS)){
    const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...spec.rotation));
    const local=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z).applyQuaternion(q).add(new THREE.Vector3(...spec.position)).toArray();
    const [w,h]=spec.size;
    add(plate(w+.105,h+.1,.105),"shell",local(0,0,-.012),spec.rotation);
    add(plate(w+.032,h+.032,.02),"dark",local(0,0,-.012),spec.rotation);
    // Screen is at local Z=0, in front of its housing. Bolts and switches are physical geometry.
    for(const side of [-1,1])for(const edge of [-1,1])add(new THREE.CylinderGeometry(.008,.008,.006,8),"metal",local(side*(w/2+.035),edge*(h/2+.03),.001),[spec.rotation[0]+Math.PI/2,spec.rotation[1],0]);
    for(let i=0;i<5;i++)box([.025,.009,.01],local(-w*.36+i*w*.18,-h/2-.032,.001),i===0?"cyan":"metal",spec.rotation);
    box([w*.55,.006,.008],local(0,h/2+.032,.001),kind==="speed"?"cyan":"amber",spec.rotation);
  }
  // Port-side auxiliary switch bank; no floating geometry above the windscreen.
  add(plate(.29,.2,.07),"shell",[-.57,.65,-.75],[-.4,.35,0]);
  for(let i=0;i<3;i++){box([.043,.023,.04],[-.65+i*.075,.68,-.71],"metal",[-.4,.35,0]);box([.024,.005,.008],[-.65+i*.075,.706,-.724],i===2?"amber":"cyan");}
  // Merge static detail by material: six draw calls, no cockpit point lights or shadow passes.
  for(const [surface,geometries] of batches){const merged=mergeGeometries(geometries,false);if(!merged)throw new Error("Astra cabin geometry merge failed");const mesh=new THREE.Mesh(merged,materials[surface]);mesh.name=`astra-cabin-${surface}`;cabin.add(mesh);geometries.forEach(geometry=>geometry.dispose());}
  return cabin;
}
