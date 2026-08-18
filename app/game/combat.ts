import type { WeaponId,WeaponSlot } from "./types";

export const STARTING_LIVES=3;
export const MACHINE_GUN_AMMO=20;
export const SHIELD_HITS=2;
export const WEAPON_RESPAWN_SECONDS=7;
export const RACER_RESPAWN_SECONDS=1;

export const WEAPON_LABELS:Record<WeaponId,string>={"machine-gun":"Metralhadora",missile:"Míssil teleguiado",shield:"Escudo prismático"};
export const WEAPON_COLORS:Record<WeaponId,number>={"machine-gun":0x69f6ff,missile:0xff7a38,shield:0xb66cff};

export function rollWeapon(random=Math.random):WeaponId{const roll=Math.max(0,Math.min(.999999,random()));return (["machine-gun","missile","shield"] as const)[Math.floor(roll*3)];}
export function weaponAmmo(weapon:WeaponId){return weapon==="machine-gun"?MACHINE_GUN_AMMO:1;}
export function storeWeapon(slots:readonly [WeaponSlot,WeaponSlot],activeSlot:number,weapon:WeaponId){const empty=slots.findIndex(slot=>slot.weapon===null),target=empty>=0?empty:Math.max(0,Math.min(1,activeSlot)),replaced=slots[target].weapon,next=slots.map(slot=>({...slot})) as [WeaponSlot,WeaponSlot];next[target]={weapon,ammo:weaponAmmo(weapon)};return{slots:next,target,replaced};}
export function applyAttack(lives:number,shieldHits:number){if(shieldHits>0)return{lives,shieldHits:shieldHits-1,destroyed:false,eliminated:false,absorbed:true};const remaining=Math.max(0,lives-1);return{lives:remaining,shieldHits:0,destroyed:true,eliminated:remaining===0,absorbed:false};}
export function circularDistance(a:number,b:number,length:number){const raw=((a-b)%length+length)%length;return raw>length/2?raw-length:raw;}
