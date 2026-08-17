# Registro de decisões

Este arquivo preserva decisões de produto e engenharia que surgiram durante a evolução do protótipo. Uma decisão pode ser substituída, mas deve ser alterada conscientemente e com motivo registrado.

## D-001 — Aplicação web instalável por URL

- **Estado:** aceita
- **Decisão:** distribuir como jogo web estático e usar WebXR no Meta Quest, com GitHub Pages como hospedagem atual.
- **Motivo:** acesso simples pelo navegador do headset e ciclo de publicação rápido.

## D-002 — Sessão VR contínua

- **Estado:** aceita
- **Decisão:** depois de entrar em VR, menus, corrida e resultados permanecem na mesma sessão.
- **Motivo:** alternar repetidamente entre DOM 2D e headset quebra a experiência.

## D-003 — Ponteiros espaciais nos menus

- **Estado:** aceita
- **Decisão:** ambos os controles fornecem raio, cursor, hover e seleção por gatilho; analógico é alternativa.
- **Motivo:** uma lista sem rastreamento não é uma interface VR utilizável.

## D-004 — HUD preso à nave, não à cabeça

- **Estado:** aceita
- **Decisão:** velocímetro, energia e minimapa ficam no painel do cockpit.
- **Motivo:** elementos que seguem a cabeça desviam atenção e não parecem parte da máquina.

## D-005 — Cockpit acompanha movimento parcial

- **Estado:** aceita
- **Decisão:** cockpit acompanha guinada, inclinação e inércia da nave com suavização; cabeça continua livre.
- **Motivo:** um painel totalmente imóvel parece uma bancada, enquanto prender a câmera à nave causa desconforto.

## D-006 — Pistas largas e longas

- **Estado:** aceita
- **Decisão:** largura-base de 48 unidades, mínimo de 3,5 km e quatro voltas como padrão.
- **Motivo:** oferecer ultrapassagem, escolha de linha e corridas de aproximadamente 2 a 4 minutos.

## D-007 — Segurança geométrica é requisito

- **Estado:** aceita
- **Decisão:** circuitos não podem conter curvas em V, túneis atravessando pista, blocos na área dirigível ou emendas com largura distorcida.
- **Motivo:** esses defeitos afetam jogabilidade, conforto e confiança visual.

## D-008 — Identidade visual por pista

- **Estado:** aceita
- **Decisão:** cada circuito precisa de paleta, céu, arquitetura, material e desafio próprios.
- **Motivo:** recolorir a mesma pista não cria memória de lugar nem variedade de campanha.

## D-009 — Túneis não implicam inversão

- **Estado:** aceita
- **Decisão:** entrar em túnel não gira automaticamente a pista em 180°. Magnetismo e inversões são recursos excepcionais.
- **Motivo:** inversões frequentes cansam e podem causar enjoo no VR.

## D-010 — Nitro finito com recarga localizada

- **Estado:** aceita
- **Decisão:** nitro não volta infinitamente sozinho; zonas nas bordas recuperam energia e boost pads oferecem impulso.
- **Motivo:** transformar boost em decisão de trajetória e gerenciamento de recurso.

## D-011 — Naves diferentes de verdade

- **Estado:** aceita
- **Decisão:** cada nave possui atributos, silhueta externa, cockpit, cores e materiais próprios.
- **Motivo:** seleção precisa alterar pilotagem e fantasia, não somente o texto do menu.

## D-012 — Velocidade legível e reiniciável

- **Estado:** aceita
- **Decisão:** velocímetro deriva do estado atual, zera parado e reinicia com a corrida; faixa normal de leitura fica próxima de 400 a 600 km/h.
- **Motivo:** valores acumulados ou inconsistentes quebram a leitura da pilotagem.

## D-013 — Música local e mix independente

- **Estado:** aceita
- **Decisão:** usar MP3 local para música, motor procedural mais suave e volumes separados para geral, música e SFX.
- **Motivo:** permitir identidade sonora sem tornar o motor cansativo.

## D-014 — Vitória difícil, mas alcançável

- **Estado:** aceita
- **Decisão:** a IA deve pressionar, porém um jogador competente precisa conseguir vencer de forma consistente. História exige pódio.
- **Motivo:** dificuldade impossível invalida domínio da nave; facilidade automática elimina rivalidade.
