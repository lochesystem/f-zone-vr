import assert from "node:assert/strict";
import { existsSync,readFileSync,renameSync,rmSync } from "node:fs";
import { dirname,join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot=dirname(dirname(fileURLToPath(import.meta.url)));
const outputRoot=join(projectRoot,"dist","client");
const nestedAssets=join(outputRoot,"f-zone-vr","_next");
const publicAssets=join(outputRoot,"_next");

assert.ok(existsSync(nestedAssets),"O build do Pages não gerou os recursos em f-zone-vr/_next");
rmSync(publicAssets,{recursive:true,force:true});
renameSync(nestedAssets,publicAssets);
rmSync(join(outputRoot,"f-zone-vr"),{recursive:true,force:true});

const html=readFileSync(join(outputRoot,"index.html"),"utf8");
const resourcePaths=[...html.matchAll(/(?:href|src)="(\/f-zone-vr\/[^"?#]+)/g)].map(match=>match[1]);
const missing=[...new Set(resourcePaths)].filter(resource=>!existsSync(join(outputRoot,resource.replace(/^\/f-zone-vr\//,""))));
assert.deepEqual(missing,[],`Recursos ausentes no pacote do Pages: ${missing.join(", ")}`);
assert.ok(existsSync(join(outputRoot,".nojekyll")),"O pacote do Pages precisa de .nojekyll");

console.log(`Pacote do Pages validado com ${new Set(resourcePaths).size} recursos públicos.`);
