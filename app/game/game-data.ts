export type GameModeId="story"|"arcade"|"cup";
export type MenuScreen="mode"|"ship"|"track";

export interface GameMode { id:GameModeId;name:string;kicker:string;description:string;rivals:boolean;badge:string; }
export interface ShipSpec { id:string;name:string;role:string;color:string;accent:string;stats:{acceleration:number;topSpeed:number;handling:number;boost:number;body:number}; }
export interface TrackSpec { id:string;name:string;region:string;description:string;laps:number;difficulty:number;available:boolean;features:string[]; }

export const GAME_MODES:GameMode[]=[
  {id:"story",name:"História",kicker:"Rivalidade",description:"Uma sequência de cinco provas. Termine no pódio para avançar.",rivals:true,badge:"5 eventos"},
  {id:"arcade",name:"Arcade",kicker:"Volta limpa",description:"Corra sozinho contra o relógio, sem colisões com rivais.",rivals:false,badge:"Solo"},
  {id:"cup",name:"Cup",kicker:"Campeonato",description:"Some pontos em uma copa de circuitos antigravidade.",rivals:true,badge:"Em expansão"},
];

export const SHIPS:ShipSpec[]=[
  {id:"astra-v9",name:"Astra V9",role:"Equilibrada",color:"#0d7581",accent:"#69f6ff",stats:{acceleration:4,topSpeed:4,handling:4,boost:3,body:3}},
  {id:"kestrel-rx",name:"Kestrel RX",role:"Ágil",color:"#59234d",accent:"#ff3e93",stats:{acceleration:5,topSpeed:3,handling:5,boost:3,body:2}},
  {id:"titan-forge",name:"Titan Forge",role:"Pesada",color:"#8a5b18",accent:"#ffc25e",stats:{acceleration:2,topSpeed:5,handling:2,boost:4,body:5}},
  {id:"pulse-wraith",name:"Pulse Wraith",role:"Impulso",color:"#392a79",accent:"#9579ff",stats:{acceleration:4,topSpeed:4,handling:3,boost:5,body:2}},
  {id:"vanta-grip",name:"Vanta Grip",role:"Técnica",color:"#1e6247",accent:"#4cff83",stats:{acceleration:3,topSpeed:4,handling:5,boost:2,body:4}},
];

export const TRACKS:TrackSpec[]=[
  {id:"helix-verge",name:"Helix Verge",region:"Órbita baixa",description:"Circuito de estreia com saltos orbitais e túnel magnético.",laps:3,difficulty:2,available:true,features:["Saltos","Mag-lock","Boost pads"]},
  {id:"rift-ascent",name:"Rift Ascent",region:"Zenith",description:"Subida extrema seguida por uma queda longa sobre a cidade.",laps:3,difficulty:4,available:false,features:["Subida vertical","Mergulho","Hairpins"]},
  {id:"neon-abyss",name:"Neon Abyss",region:"Subnível 09",description:"Uma prova longa em tubos, paredes magnéticas e trechos suspensos.",laps:4,difficulty:5,available:false,features:["Túneis","Wall ride","Trecho aéreo"]},
];

export const RIVAL_NAMES=["Nyx Calder","Juno Vale","Rook Mercer","Iris Kade","Sol Renn"];
