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
  assert.match(html, /Escolha como você quer correr/);
  assert.match(html, /História/);
  assert.match(html, /Arcade/);
  assert.match(html, /Cup/);
  assert.match(html, /https:\/\/lochesystem\.github\.io\/f-zone-vr\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("inclui o núcleo de corrida e conforto WebXR", async () => {
  const [engine, mechanics, ui, audio, types, gameData, roadmap] = await Promise.all([
    readFile(new URL("../app/game/engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/mechanics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/FZoneGame.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game/audio.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/game-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/ROADMAP.md", import.meta.url), "utf8"),
  ]);
  assert.match(engine, /requestSession\("immersive-vr"/);
  assert.match(engine, /"hand-tracking"/);
  assert.match(engine, /vrChecked=true/);
  assert.match(engine, /vrApiAvailable=Boolean\(xr\)/);
  assert.match(engine, /globalThis\.isSecureContext/);
  assert.match(engine, /setFoveation\(\.65\)/);
  assert.match(engine, /TOTAL_LAPS=3/);
  assert.match(engine, /TRACK_WIDTH=28/);
  assert.match(engine, /SAMPLES=520/);
  assert.match(engine, /"centripetal"/);
  assert.match(engine, /boostPads=\[\.145,\.24,\.42,\.59,\.665,\.76,\.91\]/);
  assert.match(engine, /addJumpGates\(\)/);
  assert.match(engine, /addMagneticTunnels\(\)/);
  assert.match(engine, /toggleMinimap\(\)/);
  assert.match(engine, /gapLift\(progress\)/);
  assert.match(engine, /createPlayerCraft\(\)/);
  assert.match(engine, /MeshPhysicalMaterial/);
  assert.match(engine, /lateralVelocity/);
  assert.match(engine, /resolveRivalCollisions/);
  assert.match(engine, /this\.drafting/);
  assert.match(engine, /this\.speed>32&&throttle>\.15/);
  assert.match(engine, /this\.speed<\.75\)this\.speed=0/);
  assert.match(engine, /buildBoostStreaks/);
  assert.match(engine, /this\.audio\.boostHit/);
  assert.match(engine, /opponents=active\.map/);
  assert.match(engine, /configureRace\(mode:GameModeId\)/);
  assert.match(engine, /this\.gameMode==="arcade"\?\[\]/);
  assert.match(engine, /private updateCountdown\(dt:number\)/);
  assert.match(engine, /countdownTime=3\.05/);
  assert.match(engine, /drawCountdownPanel/);
  assert.match(mechanics, /topSpeed=boosting\?178:126/);
  assert.match(ui, /Entrar em VR/);
  assert.match(ui, /engine\.enterVR\(\)\.catch/);
  assert.match(ui, /race\.speed<\.75\?0/);
  assert.match(ui, /opponent-radar/);
  assert.match(ui, /boost-fx/);
  assert.match(ui, /Volume geral/);
  assert.match(ui, /Efeitos e motor/);
  assert.match(ui, /saveAudioSettings/);
  assert.match(ui, /Escolha sua nave/);
  assert.match(ui, /setShipId\(ship\.id\);setScreen\("track"\)/);
  assert.match(ui, /Escolha a pista/);
  assert.match(ui, /Resultado oficial/);
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
  assert.match(roadmap, /Pilotagem e escala/);
});
