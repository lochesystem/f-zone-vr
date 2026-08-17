# F-Zone VR

Protótipo de corrida antigravidade para navegador e Meta Quest 3, construído com Three.js e WebXR.

Jogue em: https://lochesystem.github.io/f-zone-vr/

## Primeira versão

- circuito suspenso `Helix Verge` com três voltas, grandes desníveis e descidas inclinadas;
- dois saltos orbitais sobre trechos sem pista e dois túneis de aderência magnética;
- cockpit em primeira pessoa e cinco rivais;
- pista larga para disputas em múltiplas faixas;
- pilotagem com inércia lateral, aderência, derrapagem e rebote nas barreiras;
- colisões entre naves, rivais com troca de faixa e ganho de velocidade no vácuo;
- aceleração, frenagem e boost recarregável;
- controles por teclado, gamepad e controles do Quest;
- entrada WebXR, vibração em impactos e foveated rendering;
- minimapa acionável na tela e integrado ao cockpit VR;
- interface neon inspirada na direção visual do projeto `scifi-spy`.

## Controles

| Ação | Teclado | Gamepad / Quest |
| --- | --- | --- |
| Direção | `A` / `D` | analógico esquerdo |
| Acelerar | `W` | gatilho direito |
| Frear | `S` | gatilho esquerdo |
| Boost | `Shift` | botão A / grip direito |
| Minimapa | `M` | botão Y / Select |
| Pausar | `Esc` | — |

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
npm test
```

O GitHub Pages é atualizado automaticamente a cada push na branch `main`.
