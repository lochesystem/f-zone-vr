# Roadmap do F-Zone VR

**Atualizado em:** 17 de agosto de 2026

O roadmap ordena entregas. Regras permanentes ficam no [GDD](GDD.md), em [decisões](DECISIONS.md) e nos guias especializados.

## Entregue

- [x] Tela inicial com escolha entre VR e desktop.
- [x] Menu de modos, seleção de nave, seleção de pista/evento e opções.
- [x] Contagem de largada, corrida em voltas e ranking pós-corrida.
- [x] História com cinco eventos, rival nomeado e avanço condicionado ao pódio.
- [x] Arcade isolado e primeira versão de Cup.
- [x] Cinco naves com atributos, modelos e cockpits distintos.
- [x] IA com posição, colisão, vácuo e presença no minimapa.
- [x] Pilotagem e escala: pista larga, direção com resposta lateral e assistência reduzida.
- [x] Nitro finito, boost pads e faixas laterais de recarga.
- [x] Helix Verge ampliada para 3,61 km.
- [x] Rift Ascent com 5,20 km, aurora, rampas e saltos.
- [x] Solar Foundry com 6,60 km, cenário industrial diurno e duas pontes de reator.
- [x] Turntable 3D de pistas no desktop e no VR usando a geometria real.
- [x] Sessão VR contínua, controles rastreados, raios e cursores.
- [x] HUD no cockpit e cockpit acompanhando parcialmente o movimento da nave.
- [x] Música de fundo, motor, efeitos e mix de volumes.
- [x] GitHub Pages com publicação automática.
- [x] GDD, design técnico, guia VR, QA, release e registro de decisões.

## Prioridade 1 — Estabilização e balanceamento

Objetivo: consolidar a base antes de multiplicar conteúdo.

- [ ] Sessões cronometradas com cada nave e pista no desktop e no Quest.
- [ ] Ajustar IA para vitória difícil, mas repetível por habilidade.
- [ ] Revisar aceleração, frenagem, resposta lateral, barreira e contato.
- [ ] Confirmar faixa coerente de 400–600 km/h e reset entre corridas.
- [ ] Eliminar bugs de estado após repetir várias corridas.
- [ ] Medir duração: alvo de 2–4 minutos por corrida padrão.
- [ ] Completar os checklists de pista e VR em hardware real.

**Critério de saída:** cinco corridas consecutivas sem erro de estado e pódio alcançável em todas as combinações principais.

## Prioridade 2 — Campeonato Cup completo

- [ ] Seleção de copa.
- [ ] Sequência de circuitos sem voltar ao menu principal.
- [ ] Pontuação por colocação.
- [ ] Classificação acumulada entre etapas.
- [ ] Tela de resultado da etapa e resultado final da copa.
- [ ] Reinício e abandono sem corromper a pontuação.

**Critério de saída:** completar uma copa, ver classificação correta após cada corrida e receber campeão final.

## Prioridade 3 — Cinco pistas com identidade própria

Cada pista deve cumprir [TRACK-DESIGN.md](TRACK-DESIGN.md) e ter duração real adequada.

1. **Helix Verge** — cidade orbital noturna; entregue.
2. **Rift Ascent** — aurora e cordilheira; entregue.
3. **Solar Foundry** — complexo industrial diurno, calor e estruturas solares; entregue.
4. **Magma Crown** — caldeira vulcânica, lava e plataformas de refrigeração; planejada.
5. **Cloudline Metro** — cidade clara acima das nuvens, grandes retas e tráfego visual distante; planejada.

Para cada nova pista:

- [ ] geometria validada automaticamente;
- [ ] nenhuma interseção, parede acidental ou curva em V;
- [ ] minimapa fiel;
- [ ] IA completa o circuito;
- [ ] cenário não invade o volume dirigível;
- [ ] teste completo no Quest.

## Prioridade 4 — História e rivais

- [ ] Substituir repetição de pistas na campanha conforme novas fases forem entregues.
- [ ] Dar comportamento e nave preferida a cada rival.
- [ ] Criar apresentação curta pré-corrida e reação pós-corrida.
- [ ] Salvar progresso local com versão de schema.
- [ ] Adicionar final de temporada após o quinto evento.

## Prioridade 5 — Polimento audiovisual e conforto

- [ ] Efeitos sonoros próprios por família de nave.
- [ ] Temas musicais ou variações por região.
- [ ] Melhor feedback de dano, vácuo, recarga e última volta.
- [ ] Opções de intensidade do cockpit e efeitos de velocidade.
- [ ] Perfil de qualidade para Meta Quest.
- [ ] Auditoria de legibilidade dos menus e HUD em estéreo.

## Prioridade 6 — VS

- [ ] Definir local, online ou ambos.
- [ ] Prototipar sincronização sem comprometer o loop solo.
- [ ] Definir lobby, reconexão e autoridade de corrida.
- [ ] Implementar somente depois que pilotagem, pistas e Cup estiverem estáveis.

## Referências de design

- Manual de F-Zero X: fluxo por modo/copa/máquina, atributos e distinção entre aceleração e velocidade máxima.
- Jogos de corrida antigravitacional: leitura de pista, arquétipos de nave, boost e competição arcade.
- As referências orientam ritmo e linguagem; conteúdo, nomes, modelos, pistas e universo do F-Zone VR permanecem originais.

## Regra de avanço

Uma prioridade só é marcada como entregue quando está jogável, documentada, coberta pelo plano de QA e publicada. Trabalho exploratório pode começar antes, mas não substitui o critério de saída da etapa atual.
