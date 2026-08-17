# Regras para criação de pistas

Estas regras são obrigatórias para qualquer circuito novo do F-Zone VR.

1. **Escala e duração** — largura jogável de 48 m, percurso efetivo mínimo de 3,5 km e quatro voltas como padrão para evitar corridas de aproximadamente um minuto.
2. **Curvas legíveis** — usar spline centrípeta, raios progressivos e transições suaves; curvas em “V” e mudanças instantâneas de direção são proibidas.
3. **Separação física** — trechos não vizinhos precisam manter folga maior que a largura da pista. Túneis e anéis magnéticos só podem ser criados quando houver volume livre ao redor.
4. **Elevação confortável** — subidas e descidas podem ser fortes, mas a inclinação deve crescer e terminar progressivamente para reduzir desconforto em VR.
5. **Saltos controlados** — começo e aterrissagem devem estar alinhados, com vão mensurável e trajetória clara. A chegada nunca pode apontar para fora da pista.
6. **Superfícies magnéticas** — wall rides e túneis precisam de entrada e saída graduais, além de folga em relação a qualquer outro trecho.
7. **Mapa fiel** — o minimapa é gerado pela mesma curva usada pela física, incluindo saltos, recarga, jogador e rivais.
8. **Voltas completas** — toda pista é um circuito fechado, tem linha de largada, contagem de voltas e reinicialização correta dos impulsos.
9. **Validação automática** — comprimento, distância entre trechos, inclinação, suavidade e alinhamento dos saltos devem passar em `tests/track-clearance.test.mjs`.
10. **Identidade visual isolada** — cada pista define céu, neblina, superfície, bordas, iluminação e cenário próprios. Objetos decorativos não podem ser compartilhados quando invadirem o volume de outro circuito.
11. **Variedade magnética** — túneis não devem provocar inversões completas por padrão. Inclinações fortes são eventos especiais e devem alternar com túneis de baixa rotação.

## Loops verticais

Um loop completo é uma exceção deliberada à regra de conforto e precisa cumprir todos estes pontos:

- entrada e saída alinhadas, sem vértice ou teletransporte de orientação;
- raio amplo e mudança angular progressiva;
- quadro de orientação transportado ao longo da spline para evitar inversões instantâneas da câmera;
- folga tridimensional maior que a largura da pista em relação aos demais segmentos;
- sinalização visual e setor identificado antes da subida;
- teste obrigatório no Meta Quest 3, incluindo conforto sentado e estabilidade do cockpit.
