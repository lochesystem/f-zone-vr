import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("https://f-zone-vr.test/", { headers: { accept: "text/html", host: "f-zone-vr.test", "x-forwarded-proto": "https" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renderiza a apresentação do F-Zone VR", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>F-Zone VR — Neon velocity<\/title>/i);
  assert.match(html, /F-Zone/);
  assert.match(html, /Entrar em VR/);
  assert.match(html, /Jogar na tela/);
  assert.match(html, /Preparando o acesso imersivo|permanecem dentro do espaço imersivo/);
  assert.match(html, /https:\/\/lochesystem\.github\.io\/f-zone-vr\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("inclui o núcleo de corrida e conforto WebXR", async () => {
  const [engine, mechanics, ui, audio, types, gameData, roadmap, trackData] = await Promise.all([
    readFile(new URL("../app/game/engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/mechanics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/FZoneGame.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game/audio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/game-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/ROADMAP.md", import.meta.url), "utf8"),
    readFile(new URL("../app/game/track-data.ts", import.meta.url), "utf8"),
  ]);
  assert.match(engine, /requestSession\("immersive-vr"/);
  assert.match(engine, /"hand-tracking"/);
  assert.match(engine, /vrChecked=true/);
  assert.match(engine, /vrApiAvailable=Boolean\(xr\)/);
  assert.match(engine, /globalThis\.isSecureContext/);
  assert.match(engine, /setFoveation\(\.65\)/);
  assert.match(engine, /TOTAL_LAPS=4/);
  assert.match(engine, /TRACK_WIDTH=48/);
  assert.match(engine, /SAMPLES=720/);
  assert.match(engine, /"centripetal"/);
  assert.match(trackData, /boostPads:\[\.145,\.24,\.42,\.59,\.665,\.76,\.91\]/);
  assert.match(engine, /addJumpGates\(\)/);
  assert.match(engine, /addMagneticTunnels\(\)/);
  assert.match(engine, /private environmentWorld=new THREE\.Group/);
  assert.match(engine, /private addAuroraRidge\(\)/);
  assert.match(engine, /ground\.position\.y=-240/);
  assert.match(engine, /toggleMinimap\(\)/);
  assert.match(engine, /gapLift\(progress,this\.trackLayout\)/);
  assert.match(engine, /createPlayerCraft\(\)/);
  assert.match(engine, /createRacer\(spec:ShipSpec,variant=0/);
  assert.match(engine, /createRacer\(SHIPS\[index\],index\)/);
  assert.match(engine, /private replacePlayerCraft\(\)/);
  assert.match(engine, /ship\.userData\.shipId/);
  assert.match(engine, /private cockpit=new THREE\.Group/);
  assert.match(engine, /this\.buildCockpit\(\)/);
  assert.match(engine, /private vrShipPreview=new THREE\.Group/);
  assert.match(engine, /refreshVrShipPreview/);
  assert.match(engine, /Hangar de naves/);
  assert.match(engine, /variant===3/);
  assert.match(engine, /MeshPhysicalMaterial/);
  assert.match(engine, /lateralVelocity/);
  assert.match(engine, /cockpitRoll=this\.ship\.rotation\.z\*\.82/);
  assert.match(engine, /cockpitYaw=this\.ship\.rotation\.y\*\.62/);
  assert.match(engine, /resolveRivalCollisions/);
  assert.match(engine, /this\.drafting/);
  assert.match(engine, /this\.speed>32&&throttle>\.15/);
  assert.match(engine, /this\.speed<\.75\)this\.speed=0/);
  assert.match(engine, /displaySpeedKmh\(this\.speed\)/);
  assert.match(engine, /rival\.distance=10\+index\*8/);
  assert.match(engine, /paceAdjustment=gap>90\?-8/);
  assert.doesNotMatch(engine, /new THREE\.RingGeometry\(\.052,\.064,24\)/);
  assert.match(engine, /buildBoostStreaks/);
  assert.match(engine, /this\.audio\.boostHit/);
  assert.match(engine, /opponents=active\.map/);
  assert.match(engine, /configureRace\(mode:GameModeId,shipId=/);
  assert.match(engine, /STORY_EVENTS\[this\.storyEventIndex\]/);
  assert.match(engine, /this\.lap>this\.totalLaps/);
  assert.match(engine, /this\.gameMode==="arcade"\?\[\]/);
  assert.match(engine, /private updateCountdown\(dt:number\)/);
  assert.match(engine, /countdownTime=3\.05/);
  assert.match(engine, /drawCountdownPanel/);
  assert.match(engine, /addEnergyStrips/);
  assert.match(engine, /isEnergyZone\(progress,this\.trackLayout\)/);
  assert.match(engine, /updateBoostEnergy\(this\.boost,this\.boosting,this\.energyCharging,dt\)/);
  assert.match(engine, /private resetRaceState\(\)/);
  assert.match(engine, /this\.lastEmit=0/);
  assert.match(engine, /this\.resetRaceState\(\);this\.countdownLabel=null;this\.snapshot\.phase="menu"/);
  assert.match(engine, /rivalTargetSpeed\(this\.gameMode,index,this\.storyEventIndex\)/);
  assert.match(engine, /rival\.root\.rotateY\(yaw\)/);
  assert.doesNotMatch(engine, /rival\.root\.rotation\.y=/);
  assert.match(engine, /this\.ship\.visible=false/);
  assert.doesNotMatch(engine, /const centerScreen=/);
  assert.match(engine, /emberPositions/);
  assert.match(engine, /const skySun=/);
  assert.match(engine, /const cloudGeometry=/);
  assert.match(engine, /drawSpeedPanel/);
  assert.match(engine, /enterVRLobby/);
  assert.match(engine, /openVrMenu\("results"\)/);
  assert.match(engine, /private updateVrMenu\(\)/);
  assert.match(engine, /"Opções de áudio"/);
  assert.match(engine, /private adjustVrAudio/);
  assert.match(engine, /vrShipPreview\.position\.set\(\.86,\.98,-1\.72\)/);
  assert.match(engine, /vrTrackPreview\.position\.set\(\.86,1\.02,-1\.72\)/);
  assert.match(engine, /vrTrackPreview\.rotation\.set\(\.18,0,0\)/);
  assert.match(engine, /private vrPausePressed/);
  assert.match(engine, /"Retomar corrida","Reiniciar corrida","Opções de áudio","Menu principal","Sair do VR"/);
  assert.match(engine, /buttons\[9\]\?\.pressed/);
  assert.match(engine, /getController\(index\)/);
  assert.match(engine, /this\.rig\.add\(controller\)/);
  assert.match(engine, /"selectstart"/);
  assert.match(engine, /setFromXRController/);
  assert.match(engine, /intersectObject\(this\.vrMenuPanel/);
  assert.match(engine, /vrMenuIndexFromUv/);
  assert.match(engine, /RingGeometry\(\.018,\.032/);
  assert.match(engine, /this\.cockpit\.add\(this\.speedPanel\)/);
  assert.match(engine, /this\.cockpit\.add\(this\.mapPanel\)/);
  assert.match(engine, /sizeAttenuation:false/);
  assert.match(engine, /private hasTrackClearance/);
  assert.match(mechanics, /topSpeed=boosting\?tuning\.topSpeed\+38\*tuning\.boostPower:tuning\.topSpeed/);
  assert.match(mechanics, /passiveBoostRecovery:0/);
  assert.match(mechanics, /displaySpeedCap:600/);
  assert.match(ui, /Entrar em VR/);
  assert.match(ui, /engine\.enterVRLobby\(\)/);
  assert.match(ui, /permanecem dentro do espaço imersivo/);
  assert.match(ui, /engine\.enterVR\(\)\.catch/);
  assert.match(ui, /race\.displaySpeed/);
  assert.match(ui, /opponent-radar/);
  assert.match(ui, /boost-fx/);
  assert.match(ui, /Volume geral/);
  assert.match(ui, /Efeitos e motor/);
  assert.match(ui, /saveAudioSettings/);
  assert.match(ui, /Escolha sua nave/);
  assert.match(ui, /ShipHangarPreview/);
  assert.match(ui, /Confirmar nave/);
  assert.match(ui, /Escolha a pista/);
  assert.match(ui, /Resultado oficial/);
  assert.match(ui, /Próxima corrida/);
  assert.match(ui, /Temporada concluída/);
  assert.match(ui, /screen==="entry"/);
  assert.match(audio, /class RaceAudio/);
  assert.match(audio, /createOscillator/);
  assert.match(audio, /createBufferSource/);
  assert.match(audio, /audio\/background\.mp3/);
  assert.match(audio, /createMediaElementSource/);
  assert.match(audio, /f-zone-vr-audio-settings/);
  assert.match(audio, /\[\["sine",-4\],\["triangle",5\]\]/);
  assert.match(types, /opponents:OpponentMarker\[\]/);
  assert.match(gameData, /id:"story"/);
  assert.match(gameData, /id:"arcade"/);
  assert.match(gameData, /const SHIPS/);
  assert.match(gameData, /const STORY_EVENTS/);
  assert.match(gameData, /Coroa Solar/);
  assert.match(roadmap, /Pilotagem e escala/);
});
