# Astra V9 — primeira integração Tripo

- Original fornecido pelo usuário: `public/models/astra.glb` (~3,9 MB, 10.033 triângulos, uma textura e uma malha). Arquivo preservado.
- Hangar desktop, miniatura VR e adversário Astra usam o exterior completo.
- Jogador usa cópia adaptada: região da cabine separada em grupo de material transparente, sem tornar asas e casco inteiros transparentes.
- O GLB não contém um interior. A moldura panorâmica, piso, assento e pequenos suportes dos instrumentos são complementos procedurais, sem a bancada anterior. Não é uma cabine originalmente modelada pelo Tripo.
- Vidro com baixa opacidade, sem refração/transmissão cara. Velocidade/voltas/posição e mapa continuam presos à nave, abaixo da visão central.
- Casco e moldura da Astra compartilham o movimento de inclinação. Rastreamento da cabeça permanece livre.
- Ao entrar em VR, cabeça e controles são alinhados juntos por um grupo de origem: altura nominal de 1,50 m nos menus e 1,28 m na cabine. Posição e direção horizontal iniciais são compensadas; movimento físico, inclinação e rotação da cabeça continuam livres.
- O espaço nativo `local-floor` não é substituído por um `getOffsetReferenceSpace`. O evento `reset` do espaço nativo (recentralização pelo sistema/Meta) solicita novo alinhamento a partir da próxima pose rastreada válida, sem acumular deslocamentos. O botão Meta pertence ao sistema, não é interceptado como botão de gameplay.
- Ao sair da sessão, o alinhamento é limpo e a câmera desktop é restaurada. Poses nulas ou com posição emulada não são usadas para calibrar.
- GLB carregado uma vez e clonado com geometria/material próprios. Falha de rede mantém modelo procedural como fallback.

## Verificação

Testes verificam integridade do GLB, separação do vidro e raio frontal a partir do assento sem casco opaco. Hangar e corrida conferidos visualmente no navegador. Testes da origem VR cobrem jogadores sentados/em pé, direção inicial, cabeça e controles juntos, transições menu/cabine, reset repetido, perda de rastreamento e encerramento.

Pendente em hardware: testar no Quest 3 altura sentado, olhar lateral/para cima, instrumentos, arma na mão, curvas e loop. O vidro recortado é uma adaptação geométrica; para acabamento definitivo, exportar futuramente casco, canopy transparente e interior separados no modelador.
