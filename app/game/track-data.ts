export const TRACK_POINTS: ReadonlyArray<readonly [number, number, number]> = [
  [0,20,120],[0,20,40],[30,24,-45],[95,45,-115],[180,85,-130],[245,110,-75],
  [260,96,10],[220,65,95],[150,28,145],[75,22,175],[10,21,185],[-70,25,175],
  [-150,48,135],[-215,72,70],[-235,78,-15],[-205,62,-95],[-140,38,-150],
  [-55,24,-165],[20,48,-135],[65,72,-70],[78,68,15],[105,58,75],[100,45,125],[55,30,145],
];

export const GAP_RANGES: ReadonlyArray<readonly [number, number]> = [
  [.165,.195],
  [.685,.715],
];

export const MAGNETIC_RANGES: ReadonlyArray<readonly [number, number, number]> = [
  [.455,.555,Math.PI/2],
  [.79,.865,-Math.PI*.62],
];

export function circularProgress(progress:number){return ((progress%1)+1)%1;}

export function progressInRange(progress:number,range:readonly [number,number]){
  const p=circularProgress(progress);return p>=range[0]&&p<=range[1];
}

export function isGap(progress:number){return GAP_RANGES.some(range=>progressInRange(progress,range));}

export function gapLift(progress:number){
  const p=circularProgress(progress);
  for(const [start,end] of GAP_RANGES){if(p>=start&&p<=end){const phase=(p-start)/(end-start);return Math.sin(phase*Math.PI)*12;}}
  return 0;
}

function smoothstep(value:number){const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);}

export function magneticBank(progress:number){
  const p=circularProgress(progress);
  for(const [start,end,maximum] of MAGNETIC_RANGES){
    if(p<start||p>end)continue;
    const phase=(p-start)/(end-start),edge=.22;
    const envelope=phase<edge?smoothstep(phase/edge):phase>1-edge?smoothstep((1-phase)/edge):1;
    return maximum*envelope;
  }
  return 0;
}

export function trackSector(progress:number){
  if(isGap(progress))return "Salto orbital";
  if(MAGNETIC_RANGES.some(([start,end])=>progressInRange(progress,[start,end])))return "Túnel magnético";
  const p=circularProgress(progress);
  if(p>.11&&p<.29)return "Escalada Zenith";
  if(p>.29&&p<.42)return "Mergulho Aurora";
  return "Helix Verge";
}
