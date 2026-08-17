export type TrackPoint=readonly [number,number,number];
export type TrackRange=readonly [number,number];
export type MagneticRange=readonly [number,number,number];
export type TrackEnvironment="orbital-city"|"aurora-ridge"|"solar-foundry";
export interface TrackTheme {sky:number;fog:number;fogDensity:number;track:number;stripe:number;magnetic:number;rail:number;accent:number;ground:number;environment:TrackEnvironment;}

export interface TrackLayout {
  id:string;name:string;points:ReadonlyArray<TrackPoint>;gaps:ReadonlyArray<TrackRange>;
  magnetic:ReadonlyArray<MagneticRange>;energy:ReadonlyArray<TrackRange>;boostPads:ReadonlyArray<number>;
  sectors:ReadonlyArray<readonly [number,number,string]>;scale:number;theme:TrackTheme;
}

export const TRACK_POINTS:ReadonlyArray<TrackPoint> = [
  [0,20,120],[0,20,40],[30,24,-45],[95,45,-115],[180,85,-130],[245,110,-75],
  [260,96,10],[220,65,95],[150,28,145],[75,22,175],[10,21,185],[-70,25,175],
  [-150,48,135],[-215,72,70],[-235,78,-15],[-205,62,-95],[-140,38,-150],
  [-55,24,-165],[20,48,-135],[65,72,-70],[78,68,15],[105,58,75],[100,45,125],[55,30,145],
];

export const RIFT_ASCENT_POINTS:ReadonlyArray<TrackPoint> = [
  [0,4,250],[-74,8,270],[-158,20,258],[-236,42,220],[-302,75,158],[-348,116,76],
  [-362,158,-18],[-345,204,-112],[-302,246,-198],[-238,280,-268],[-158,304,-315],[-70,318,-334],
  [20,316,-324],[104,295,-290],[176,258,-238],[229,214,-174],[274,165,-105],[318,112,-26],
  [344,60,60],[340,15,143],[313,-20,218],[260,-50,276],[190,-72,312],[116,-86,319],
  [52,-88,292],[-10,-75,250],[-60,-50,200],[-90,-25,145],[-95,-5,90],[-80,5,45],
  [-45,10,20],[-5,10,25],[25,8,60],[35,6,115],[25,4,180],
];

export const SOLAR_FOUNDRY_POINTS:ReadonlyArray<TrackPoint> = [
  [-410,10,150],[-405,12,105],[-385,15,60],[-350,18,10],[-300,28,-70],[-320,42,-150],
  [-375,62,-225],[-400,75,-300],[-365,60,-365],[-290,40,-395],[-205,27,-380],[-145,20,-330],
  [-125,25,-250],[-150,55,-170],[-115,90,-90],[-40,125,-70],[30,145,-100],[85,150,-165],
  [120,130,-250],[190,95,-300],[280,65,-315],[360,40,-275],[395,30,-200],[380,38,-120],
  [320,60,-55],[285,82,25],[305,95,105],[365,75,165],[400,48,235],[370,25,310],
  [300,15,345],[210,10,335],[155,14,285],[130,40,180],[140,65,100],[115,85,35],
  [55,95,0],[-10,80,20],[-65,55,80],[-105,30,150],[-190,15,210],[-260,12,245],
  [-320,10,255],[-370,10,240],[-400,10,200],
];

export const GAP_RANGES:ReadonlyArray<TrackRange> = [[.171,.188],[.693,.71]];
export const MAGNETIC_RANGES:ReadonlyArray<MagneticRange> = [[.455,.555,Math.PI/2],[.79,.865,-Math.PI*.62]];
export const ENERGY_RANGES:ReadonlyArray<TrackRange> = [[.035,.085],[.305,.355],[.585,.635],[.885,.935]];

const HELIX_VERGE:TrackLayout={
  id:"helix-verge",name:"Helix Verge",points:TRACK_POINTS,gaps:GAP_RANGES,magnetic:MAGNETIC_RANGES,energy:ENERGY_RANGES,
  boostPads:[.145,.24,.42,.59,.665,.76,.91],sectors:[[0,.11,"Helix Verge"],[.11,.29,"Escalada Zenith"],[.29,.42,"Mergulho Aurora"],[.42,1,"Helix Verge"]],scale:1.8,
  theme:{sky:0x01040a,fog:0x020913,fogDensity:.0018,track:0x0b2530,stripe:0x174657,magnetic:0x452067,rail:0x69f6ff,accent:0xff3e93,ground:0x01040a,environment:"orbital-city"},
};
const RIFT_ASCENT:TrackLayout={
  id:"rift-ascent",name:"Rift Ascent",points:RIFT_ASCENT_POINTS,gaps:[[.211,.226],[.709,.721]],
  magnetic:[[.355,.435,Math.PI*.32],[.79,.865,-Math.PI*.18]],energy:[[.035,.078],[.285,.325],[.545,.59],[.905,.95]],
  boostPads:[.12,.265,.47,.625,.755,.89],sectors:[[0,.15,"Portal Rift"],[.15,.36,"Escalada Zenith"],[.36,.54,"Crista Magnética"],[.54,.74,"Mergulho Solar"],[.74,.9,"Túnel Vértice"],[.9,1,"Retorno Rift"]],scale:1.8,
  theme:{sky:0x07182c,fog:0x183a52,fogDensity:.00105,track:0x163f4b,stripe:0x3b8490,magnetic:0x236b68,rail:0x7dffe0,accent:0xa8ff62,ground:0x041523,environment:"aurora-ridge"},
};
const SOLAR_FOUNDRY:TrackLayout={
  id:"solar-foundry",name:"Solar Foundry",points:SOLAR_FOUNDRY_POINTS,gaps:[[.079,.091],[.618,.63]],
  magnetic:[[.325,.385,Math.PI*.2],[.73,.785,-Math.PI*.16]],energy:[[.02,.06],[.255,.295],[.515,.555],[.84,.885]],
  boostPads:[.115,.205,.405,.585,.68,.81,.94],sectors:[[0,.13,"Forja Nascente"],[.13,.3,"Dutos Helios"],[.3,.46,"Coroa Térmica"],[.46,.64,"Ponte do Reator"],[.64,.82,"Fundição Alta"],[.82,1,"Retorno Solar"]],scale:1.8,
  theme:{sky:0x7fb8ca,fog:0xc68c61,fogDensity:.00064,track:0x172c33,stripe:0x477784,magnetic:0xffc457,rail:0xffed9a,accent:0xff6b35,ground:0x35160e,environment:"solar-foundry"},
};

export const TRACK_LAYOUTS:Readonly<Record<string,TrackLayout>>={[HELIX_VERGE.id]:HELIX_VERGE,[RIFT_ASCENT.id]:RIFT_ASCENT,[SOLAR_FOUNDRY.id]:SOLAR_FOUNDRY};
export function getTrackLayout(id:string){return TRACK_LAYOUTS[id]??HELIX_VERGE;}
export function circularProgress(progress:number){return ((progress%1)+1)%1;}
export function progressInRange(progress:number,range:TrackRange){const p=circularProgress(progress);return p>=range[0]&&p<=range[1];}
export function isGap(progress:number,layout:TrackLayout=HELIX_VERGE){return layout.gaps.some(range=>progressInRange(progress,range));}
export function isEnergyZone(progress:number,layout:TrackLayout=HELIX_VERGE){return layout.energy.some(range=>progressInRange(progress,range));}
export function gapLift(progress:number,layout:TrackLayout=HELIX_VERGE){const p=circularProgress(progress);for(const [start,end] of layout.gaps){if(p>=start&&p<=end){const phase=(p-start)/(end-start);return Math.sin(phase*Math.PI)*12;}}return 0;}
function smoothstep(value:number){const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);}
export function magneticBank(progress:number,layout:TrackLayout=HELIX_VERGE){const p=circularProgress(progress);for(const [start,end,maximum] of layout.magnetic){if(p<start||p>end)continue;const phase=(p-start)/(end-start),edge=.22,envelope=phase<edge?smoothstep(phase/edge):phase>1-edge?smoothstep((1-phase)/edge):1;return maximum*envelope;}return 0;}
export function trackSector(progress:number,layout:TrackLayout=HELIX_VERGE){if(isGap(progress,layout))return "Salto orbital";if(layout.magnetic.some(([start,end])=>progressInRange(progress,[start,end])))return "Túnel magnético";const p=circularProgress(progress);return layout.sectors.find(([start,end])=>p>=start&&p<end)?.[2]??layout.name;}
