import * as THREE from "three";

/** Move head AND controllers together, never replace the runtime reference space. */
export class VrOrigin {
  readonly root=new THREE.Group();
  private space:XRReferenceSpace|null=null;
  private pending=true;
  private height=1.5;
  private readonly reset=()=>{this.pending=true;};

  begin(space:XRReferenceSpace){this.end();this.space=space;space.addEventListener("reset",this.reset);this.pending=true;}
  end(){this.space?.removeEventListener("reset",this.reset);this.space=null;this.pending=true;this.height=1.5;this.root.position.set(0,0,0);this.root.quaternion.identity();}
  update(frame:XRFrame|undefined,eyeHeight:number){
    if(!frame||!this.space)return;
    if(this.pending){
      const pose=frame.getViewerPose(this.space);
      if(!pose||pose.emulatedPosition)return;
      const {position,orientation}=pose.transform;
      const forward=new THREE.Vector3(0,0,-1).applyQuaternion(new THREE.Quaternion(orientation.x,orientation.y,orientation.z,orientation.w));
      // Keep head pitch/roll free; align only the horizontal direction with the menu/ship.
      const yaw=Math.hypot(forward.x,forward.z)>.01?Math.atan2(-forward.x,-forward.z):0;
      this.root.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),-yaw);
      this.root.position.set(position.x,position.y,position.z).applyQuaternion(this.root.quaternion).negate();
      this.root.position.add(new THREE.Vector3(0,eyeHeight,.12));
      this.height=eyeHeight;this.pending=false;
    }else if(eyeHeight!==this.height){
      // Only menu/race transitions alter nominal eye height; physical movement is untouched.
      this.root.position.y+=eyeHeight-this.height;this.height=eyeHeight;
    }
    this.root.updateMatrixWorld(true);
  }
}
