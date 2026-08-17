# F-Zone VR

Jogo original de corrida antigravitacional para navegador e Meta Quest 3. Pilote máquinas futuristas em circuitos aéreos extensos, dispute posição com rivais, administre energia e nitro e conclua toda a jornada — dos menus ao pódio — dentro do VR.

**Jogar:** <https://lochesystem.github.io/f-zone-vr/>

> Protótipo independente inspirado por clássicos de corrida futurista. O projeto não é afiliado a outras franquias ou fabricantes de jogos.

## Estado atual

- Corrida em navegador desktop e WebXR no Meta Quest 3.
- Sessão VR contínua com menus espaciais e ponteiros dos dois controles.
- Cinco naves com atributos, silhuetas e cockpits próprios.
- Três circuitos longos, com quatro voltas, saltos, elevação e setores magnéticos.
- Seleção de pista com turntable 3D produzido pela geometria real do percurso, inclusive no VR.
- Modos História, Arcade e Cup; VS está planejado.
- Cinco rivais, colisão entre naves, vácuo, barreiras e ranking.
- Nitro finito, boost pads e áreas laterais de recarga.
- Minimapa com oponentes, cronômetro, posição e resultado final.
- Música, motor procedural, efeitos e mix independente de volumes.
- Deploy automático no GitHub Pages.

## Circuitos

| Pista | Extensão | Identidade |
| --- | ---: | --- |
| Helix Verge | 3,61 km | Cidade orbital noturna, lacunas aéreas e magnetismo em ciano/magenta. |
| Rift Ascent | 5,20 km | Cordilheira sob aurora, rampas íngremes, dois saltos e curvas magnéticas moderadas. |
| Solar Foundry | 6,60 km | Forja solar diurna, traçado recortado, dutos térmicos e duas pontes de reator. |

Novas pistas precisam seguir as [regras obrigatórias de geometria, conforto e identidade](docs/TRACK-DESIGN.md).

## Naves

| Nave | Estilo | Destaque |
| --- | --- | --- |
| Astra V9 | Equilibrada | Boa resposta em todas as situações. |
| Kestrel RX | Ágil | Aceleração e controle lateral. |
| Titan Forge | Pesada | Velocidade final e estrutura. |
| Pulse Wraith | Impulso | Maior potencial de boost. |
| Vanta Grip | Técnica | Precisão e aderência. |

## Controles

| Ação | Teclado | Gamepad | Meta Quest |
| --- | --- | --- | --- |
| Direção | A/D ou setas | Analógico esquerdo | Analógico esquerdo |
| Acelerar | W ou ↑ | Gatilho direito | Gatilho direito |
| Frear | S ou ↓ | Gatilho esquerdo | Gatilho esquerdo |
| Nitro | Shift ou Espaço | A / ombro direito | A/B direito |
| Mapa | M | Y / Menu | Botão esquerdo configurado |
| Pausa | Esc | Menu | Menu/voltar |
| Menu VR | — | — | Apontar e apertar o gatilho |

## Rodar localmente

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/`. O modo WebXR imersivo deve ser validado na URL HTTPS publicada pelo GitHub Pages.

## Validar

```bash
npm test
npm run lint
npm run build:pages
```

O build estático do Pages é gerado em `dist/client` com o prefixo `/f-zone-vr`.

## Documentação

A [central de documentação](docs/README.md) explica como manter os documentos sincronizados.

- [Game Design Document](docs/GDD.md) — visão, pilares, modos, naves, pistas, progressão e critérios de qualidade.
- [Design técnico](docs/TECHNICAL-DESIGN.md) — arquitetura, estado, Three.js, WebXR, áudio e desempenho.
- [Experiência VR](docs/VR-UX.md) — controles espaciais, cockpit, HUD e conforto.
- [Regras para pistas](docs/TRACK-DESIGN.md) — restrições que toda pista nova deve cumprir.
- [Plano de QA](docs/QA.md) — smoke tests e regressão em desktop, gamepad e Quest.
- [Release e publicação](docs/RELEASE.md) — build, GitHub Pages, checklist e rollback.
- [Decisões](docs/DECISIONS.md) — escolhas de produto e engenharia que não devem se perder.
- [Roadmap](docs/ROADMAP.md) — prioridades e próximos marcos.

## Estrutura principal

```text
app/game/
  FZoneGame.tsx    fluxo, telas e integração
  engine.ts        Three.js, WebXR, corrida, IA e cockpit
  game-data.ts     modos, naves, rivais e campanha
  track-data.ts    circuitos, setores e temas
  track-preview.ts miniaturas 3D derivadas dos circuitos reais
  mechanics.ts     entrada e velocidade
  audio.ts         música, motor e efeitos
docs/              design, arquitetura, QA e operação
public/audio/      música de fundo
```

## Publicação

Todo merge em `main` executa `.github/workflows/pages.yml` e atualiza o GitHub Pages. Consulte o [guia de release](docs/RELEASE.md) antes de publicar mudanças de pista, pilotagem ou VR.
