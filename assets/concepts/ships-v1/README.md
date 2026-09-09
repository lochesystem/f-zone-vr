# Naves — referências para modelagem

Geradas em 08/09/2026 com ImageGen integrado. Cada prancha tem frente, lateral direita (nariz à esquerda) e traseira. Os prompts completos estão nos arquivos `*-prompt.txt`.

| Nave | Referência | Identidade |
| --- | --- | --- |
| Astra V9 | [Três vistas](astra-v9-views.png) | Delta equilibrada, teal/ciano |
| Kestrel RX | [Três vistas](kestrel-rx-views.png) | Interceptadora afilada, vinho/magenta |
| Titan Forge | [Três vistas](titan-forge-views.png) | Blindagem larga, bronze/âmbar |
| Pulse Wraith | [Três vistas](pulse-wraith-views.png) | Fuselagem dupla, violeta |
| Vanta Grip | [Três vistas](vanta-grip-views.png) | Estabilizadores e dorsal, verde |

São propostas de evolução visual para gerar os modelos no Tripo, não capturas das malhas atualmente no jogo. As vistas geradas têm leve perspectiva e podem variar em detalhes; não são projeções calibradas de uma única malha. Priorize silhueta, cockpit central e dois motores ao reconstruir.

## Arquivos individuais

### Vista frontal de três quartos — 45°

PNG separado para cada nave, gerado com ImageGen integrado a partir da prancha original, com azimute solicitado de 45° e câmera levemente elevada. Referências artísticas, não renders calibrados de uma mesma malha: detalhes podem variar. Prompts completos em `*-45-prompt.txt`.

- [Astra V9](astra-v9-45.png)
- [Kestrel RX](kestrel-rx-45.png)
- [Titan Forge](titan-forge-45.png)
- [Pulse Wraith](pulse-wraith-45.png)
- [Vanta Grip](vanta-grip-45.png)

### Laterais esquerdas

Espelhamentos horizontais das laterais direitas, preservando resolução e desenho. Servem como referência de casco simétrico; não representam detalhes exclusivos do lado oposto.

| Nave | Esquerda | Direita original |
| --- | --- | --- |
| Astra V9 | [PNG](astra-v9-left.png) | [PNG](astra-v9-right.png) |
| Kestrel RX | [PNG](kestrel-rx-left.png) | [PNG](kestrel-rx-right.png) |
| Titan Forge | [PNG](titan-forge-left.png) | [PNG](titan-forge-right.png) |
| Pulse Wraith | [PNG](pulse-wraith-left.png) | [PNG](pulse-wraith-right.png) |
| Vanta Grip | [PNG](vanta-grip-left.png) | [PNG](vanta-grip-right.png) |

### Vistas geradas

Cada vista foi gerada usando a prancha da respectiva nave como referência comum. Os prompts individuais também estão nesta pasta.

| Nave | Frente | Lateral direita | Traseira |
| --- | --- | --- | --- |
| Astra V9 | [PNG](astra-v9-front.png) | [PNG](astra-v9-right.png) | [PNG](astra-v9-back.png) |
| Kestrel RX | [PNG](kestrel-rx-front.png) | [PNG](kestrel-rx-right.png) | [PNG](kestrel-rx-back.png) |
| Titan Forge | [PNG](titan-forge-front.png) | [PNG](titan-forge-right.png) | [PNG](titan-forge-back.png) |
| Pulse Wraith | [PNG](pulse-wraith-front.png) | [PNG](pulse-wraith-right.png) | [PNG](pulse-wraith-back.png) |
| Vanta Grip | [PNG](vanta-grip-front.png) | [PNG](vanta-grip-right.png) | [PNG](vanta-grip-back.png) |

Para modelagem, use cada vista separadamente como referência visual quando a interface escolhida permitir múltiplas imagens. Não modele a prancha inteira como um único objeto. Preserve o casco completo e uma versão sem canopy para a visão interna. Convenção de integração: Y para cima, nariz para -Z, origem central; entregar GLB com materiais PBR, motores separados e ponto de montagem do cockpit. Os efeitos de exaustão são adicionados pelo jogo.

Prompt base para reconstrução: "Single original futuristic antigravity racing ship from the supplied reference. Preserve silhouette, color blocking, central cockpit and two rear engines. No background, no pedestal, no flame geometry, no duplicate ships. Clean game-ready hard-surface mesh."
