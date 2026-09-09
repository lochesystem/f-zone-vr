# Pulse Wraith — modelo Tripo

- `public/models/pulse.glb`: original fornecido pelo usuário, ~3,3 MB, 9.621 triângulos, 11.535 vértices, uma malha/material/textura. Original preservado.
- Exterior integrado ao hangar desktop, seleção VR e adversários. Jogador usa cópia com abertura de vidro da cabine, sem tornar os motores transparentes.
- Exportação aponta para +Z: geometria gira 180° para alinhar com -Z do jogo. Escala externa 6; interna 8 com deslocamento de encaixe na posição de pilotagem existente. A origem XR não é alterada.
- Interior compartilha o assoalho e os instrumentos físicos da Astra, com acabamento violeta e identificação Pulse Wraith. Casco e cabine inclinam juntos.
- Rastros alinhados aos dois conjuntos laterais de motores. Carregamento único com clones, textura compartilhada e fallback procedural em falha de rede.
- Inspeção: `npx vite --config scripts/cabin-preview.config.mjs`; exterior em `/scripts/pulse-preview.html`, interior em `/scripts/cabin-preview.html?pulse`. Telemetria/mapa do diagnóstico são ilustrativos.
- Testes verificam integridade, orientação, separação de vidro e visão frontal. Validação final de conforto e encaixe olhando ao redor depende do Quest 3 físico.
