export function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,value));}
export function deadzone(value:number,threshold=.14){const magnitude=Math.abs(value);if(magnitude<=threshold)return 0;return Math.sign(value)*(magnitude-threshold)/(1-threshold);}
export function advanceSpeed(speed:number,throttle:number,brake:number,boosting:boolean,dt:number){const topSpeed=boosting?178:126;const drive=throttle*(speed<35?62:39);const braking=brake*88;const drag=5.4+speed*.035;return clamp(speed+(drive-braking-drag)*dt,0,topSpeed);}
export function formatTime(seconds:number){const minutes=Math.floor(seconds/60);const remainder=Math.max(0,seconds-minutes*60);return `${String(minutes).padStart(2,"0")}:${remainder.toFixed(2).padStart(5,"0")}`;}
