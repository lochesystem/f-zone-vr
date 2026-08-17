# F-Zone VR — fila de prioridades

1. **Concluído — Fluxo completo de corrida** — tela inicial, menu principal, seleção de modo, nave e pista, além do ranking pós-corrida.
2. **Concluído — Pilotagem e escala** — resposta lateral mais rápida, pista ampliada para 48 m, dificuldade maior, nitro limitado e faixas laterais de recarga.
3. **Concluído — experiência VR contínua** — lobby, seleções e resultados dentro da sessão imersiva; controles rastreados com raios e cursores; velocímetro, energia e minimapa fixos fisicamente no cockpit.
4. **Concluído — História** — cinco corridas com dificuldade crescente, rival nomeado por evento, quatro voltas nas provas finais e progressão condicionada ao pódio.
   - Direção de arte: cinco silhuetas de nave distintas, com casco, asas, motores e materiais coerentes com seus atributos.
5. **Em andamento — Arcade, Cup e pistas** — sistema multicircuito concluído e Rift Ascent liberada; próximo passo é transformar Cup em campeonato por pontos e variar a ambientação de cada região.
   - Helix Verge expandida para 3,61 km e Rift Ascent para 5,20 km; provas comuns agora têm quatro voltas e as finais da História, cinco.
   - O cockpit acompanha a guinada, a inclinação e o deslocamento lateral da nave sem mover artificialmente a cabeça do jogador em VR.
   - Identidade de Rift Ascent: alta atmosfera azul, aurora em camadas, cristas distantes e inclinações magnéticas moderadas; cenário isolado para não atravessar a pista.
   - As regras geométricas obrigatórias estão registradas em `docs/TRACK-DESIGN.md` e cobertas por testes automatizados.
6. **VS** — preparar arquitetura para multijogador posterior.

## Referências de design

- Manual oficial de F-Zero X: fluxo por modo/copa/máquina, atributos Body/Boost/Grip, ajuste entre aceleração e velocidade máxima e regras de GP/Time Attack/VS.
  - https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_8/Manual_Nintendo64_FZeroX_EN.pdf
- F-Zero X: cinco modos principais, copas com múltiplas pistas, máquinas leves favorecendo aceleração e máquinas pesadas favorecendo velocidade máxima.
- Wipeout: arquétipos de nave organizados por aceleração, velocidade máxima, dirigibilidade e resistência.

Cada prioridade deve chegar jogável e publicada antes do início da seguinte.
