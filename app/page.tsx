import type { Metadata } from "next";
import { FZoneGame } from "./game/FZoneGame";

const title = "F-Zone VR — Neon velocity";
const description = "Corrida antigravidade em realidade virtual, direto no navegador.";
const image = "https://lochesystem.github.io/f-zone-vr/og.png";

export const dynamic="force-static";

export const metadata:Metadata = {
  title,description,
  openGraph:{title,description,images:[{url:image,width:1731,height:909,alt:"Nave do F-Zone VR em um circuito neon suspenso"}]},
  twitter:{card:"summary_large_image",title,description,images:[image]},
};

export default function Home() {
  return <FZoneGame />;
}
