export type GameModeId="story"|"arcade"|"cup";
export type MenuScreen="entry"|"mode"|"ship"|"track";

export interface GameMode { id:GameModeId;name:string;kicker:string;description:string;rivals:boolean;badge:string; }
export interface ShipSpec { id:string;name:string;role:string;color:string;accent:string;stats:{acceleration:number;topSpeed:number;handling:number;boost:number;body:number}; }
export interface TrackSpec { id:string;name:string;region:string;description:string;laps:number;difficulty:number;available:boolean;features:string[]; }
export interface StoryEvent { id:string;chapter:string;title:string;rival:string;briefing:string;difficulty:number;laps:number; }

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
  {id:"helix-verge",name:"Helix Verge",region:"Órbita baixa",description:"Circuito de estreia expandido com saltos orbitais e túnel magnético.",laps:4,difficulty:2,available:true,features:["3,6 km","Saltos","Mag-lock"]},
  {id:"rift-ascent",name:"Rift Ascent",region:"Zenith",description:"Circuito de resistência com ascensão progressiva, crista magnética e mergulho sobre a cidade.",laps:4,difficulty:4,available:true,features:["5,2 km","2 saltos","Wall ride"]},
  {id:"solar-foundry",name:"Solar Foundry",region:"Cinturão Helios",description:"Uma forja solar diurna com traçado recortado, dutos térmicos e duas pontes de reator.",laps:4,difficulty:4,available:true,features:["6,6 km","2 saltos","Forja solar"]},
  {id:"magma-crown",name:"Magma Crown",region:"Caldeira Rubra",description:"Uma coroa vulcânica longa, com descidas sobre lava, pontes de resfriamento e aderência magnética.",laps:4,difficulty:4,available:true,features:["6,1 km","2 saltos","Caldeira"]},
  {id:"cloudline-metro",name:"Cloudline Metro",region:"Aerovia Nimbus",description:"Um circuito diurno sobre as nuvens, com retas metropolitanas, pontes aéreas e curvas de alta velocidade.",laps:4,difficulty:3,available:true,features:["6,5 km","2 saltos","Metrópole aérea"]},
];

export const STORY_EVENTS:StoryEvent[]=[
  {id:"first-spark",chapter:"01",title:"Primeira Centelha",rival:"Nyx Calder",briefing:"Nyx testa sua linha nas retas de Helix Verge.",difficulty:1,laps:4},
  {id:"zenith-debt",chapter:"02",title:"Dívida Zenith",rival:"Juno Vale",briefing:"Juno pressiona nas zonas de recarga e fecha a passagem.",difficulty:2,laps:4},
  {id:"iron-line",chapter:"03",title:"Linha de Ferro",rival:"Rook Mercer",briefing:"Rook usa uma nave pesada e não cede espaço nas curvas.",difficulty:3,laps:4},
  {id:"violet-lock",chapter:"04",title:"Bloqueio Violeta",rival:"Iris Kade",briefing:"Iris domina o túnel magnético e ataca na saída.",difficulty:4,laps:5},
  {id:"solar-crown",chapter:"05",title:"Coroa Solar",rival:"Sol Renn",briefing:"A final da temporada exige velocidade, energia e pódio.",difficulty:5,laps:5},
];

export const RIVAL_NAMES=["Nyx Calder","Juno Vale","Rook Mercer","Iris Kade","Sol Renn"];
