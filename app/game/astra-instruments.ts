export type AstraTelemetry={speed:number;energy:number;charging:boolean;position:number;racers:number;lap:number;laps:number;lives:number;shield:number;slots:string[];activeSlot:number};

/** Opaque LCD art only. The chamfered housing, screws and switches are actual 3D. */
export function drawAstraInstruments(ctx:CanvasRenderingContext2D,s:AstraTelemetry){
  ctx.clearRect(0,0,512,256);ctx.fillStyle="#061219";ctx.fillRect(0,0,512,256);
  ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.shadowBlur=0;
  const text=(value:string,x:number,y:number,size:number,color="#c8e4e8")=>{ctx.font=`600 ${size}px monospace`;ctx.fillStyle=color;ctx.fillText(value,x,y);};
  ctx.fillStyle="#112831";ctx.fillRect(0,0,512,28);text("ASTRA / FLIGHT SYSTEMS",14,19,12,"#71a6af");text("V9",470,19,12,"#68d7df");
  const arc=(end:number,color:string,width:number)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.arc(162,137,78,Math.PI*.84,Math.PI*.84+Math.PI*1.32*end);ctx.stroke();};
  arc(1,"#1e3d46",7);arc(Math.min(1,Math.max(0,s.speed/600)),"#68d7df",7);
  text(String(Math.round(s.speed)).padStart(3,"0"),88,139,67,"#e3faff");text("KM/H",137,162,14,"#70a8b0");
  text("POSIÇÃO",290,53,12,"#70a8b0");text(`${s.position} / ${s.racers}`,290,82,28);
  text("VOLTA",405,53,12,"#70a8b0");text(`${s.lap}/${s.laps}`,405,82,28,"#dfb775");
  text("INTEGRIDADE",290,110,12,"#70a8b0");
  for(let i=0;i<3;i++){ctx.fillStyle=i<s.lives?"#cc8ca6":"#24353c";ctx.fillRect(290+i*31,120,24,9);}
  text(s.shield?`DOMO ${s.shield}/2`:"DOMO —",405,131,13,s.shield?"#b8a2df":"#53777f");
  s.slots.forEach((slot,i)=>{text(`${i+1} ${slot}`,290,158+i*20,12,i===s.activeSlot?"#dfb775":"#71959b");});
  ctx.fillStyle="#18313a";ctx.fillRect(14,202,484,1);
  text(s.charging?"RECUPERANDO ENERGIA":"RESERVA / NITRO",14,221,12,s.charging?"#7bdfad":"#70a8b0");text(`${Math.round(s.energy)}%`,451,221,12);
  for(let i=0;i<32;i++){ctx.fillStyle=i<Math.round(s.energy*.32)?s.energy<24?"#d08292":s.charging?"#7bdfad":"#5ca9b6":"#18313a";ctx.fillRect(14+i*15.2,233,12,9);}
}
