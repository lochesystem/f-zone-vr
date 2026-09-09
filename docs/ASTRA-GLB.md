# Astra V9 — primeira integração Tripo

- Original fornecido pelo usuário: `public/models/astra.glb` (~3,9 MB, 10.033 triângulos, uma textura e uma malha). Arquivo preservado.
- Hangar desktop, miniatura VR e adversário Astra usam o exterior completo.
- Jogador usa cópia adaptada: região da cabine separada em grupo de material transparente, sem tornar asas e casco inteiros transparentes.
- O GLB não contém um interior. A cabine procedural complementa o modelo com assoalho contínuo, revestimento lateral, assento, pedais, superfícies antiderrapantes e consoles baixos. Não é uma cabine originalmente modelada pelo Tripo.
- Velocímetro e mapa usam carcaças chanfradas, molduras, fixadores e botões decorativos. O instrumento central reúne velocidade, posição, voltas, vidas, escudo, itens e nitro. O mapa fica no console direito, exibido pelo comando de mapa. As telas respeitam a profundidade da cabine, sem desenhar sobre o casco; não seguem a cabeça.
- Interior estático agrupado em seis malhas por material, sem luzes pontuais ou sombras adicionais. Posições de telas e carcaças compartilham `ASTRA_DISPLAYS` para evitar desencontro. Outras naves mantêm seus instrumentos anteriores.
- Vidro com baixa opacidade, sem refração/transmissão cara. Velocidade/voltas/posição e mapa continuam presos à nave, abaixo da visão central.
- Casco e moldura da Astra compartilham o movimento de inclinação. Rastreamento da cabeça permanece livre.
- Ao entrar em VR, cabeça e controles são alinhados juntos por um grupo de origem: altura nominal de 1,50 m nos menus e 1,28 m na cabine. Posição e direção horizontal iniciais são compensadas; movimento físico, inclinação e rotação da cabeça continuam livres.
- O espaço nativo `local-floor` não é substituído por um `getOffsetReferenceSpace`. O evento `reset` do espaço nativo (recentralização pelo sistema/Meta) solicita novo alinhamento a partir da próxima pose rastreada válida, sem acumular deslocamentos. O botão Meta pertence ao sistema, não é interceptado como botão de gameplay.
- Ao sair da sessão, o alinhamento é limpo e a câmera desktop é restaurada. Poses nulas ou com posição emulada não são usadas para calibrar.
- GLB carregado uma vez e clonado com geometria/material próprios. Falha de rede mantém modelo procedural como fallback.

## Verificação

Testes verificam integridade do GLB, separação do vidro e raio frontal a partir do assento sem casco opaco. Hangar e corrida conferidos visualmente no navegador. Testes da origem VR cobrem jogadores sentados/em pé, direção inicial, cabeça e controles juntos, transições menu/cabine, reset repetido, perda de rastreamento e encerramento.

Pendente em hardware: testar no Quest 3 altura sentado, olhar lateral/para cima, instrumentos, arma na mão, curvas e loop. O vidro recortado é uma adaptação geométrica; para acabamento definitivo, exportar futuramente casco, canopy transparente e interior separados no modelador.

Inspeção isolada: `npx vite --config scripts/cabin-preview.config.mjs`, abrir `/scripts/cabin-preview.html` na porta 3002. Usa o GLB real e a cabine de produção, com telemetria e mapa ilustrativos. Testes adicionais verificam fechamento do piso/laterais, visão frontal livre e telas não encobertas pelas molduras. A calibração de origem VR não foi alterada nessa revisão de interior.
