# Estabilidade, pilotagem e referências — 08/09/2026

## Implementação

- Regras de direção e hit testing extraídas para `race-systems.ts`, com testes comportamentais.
- Laser usa a mesma geometria dos cartões das opções. Cinco cartões de pista cabem na textura do menu.
- Mão dominante depende do evento de conexão WebXR; sem assumir que a posição de uma fonte na lista corresponde ao índice do controle.
- Direção influencia o ângulo relativo ao traçado, deslocamento lateral e velocidade longitudinal. Assistência parcial continua ativa, preservando loops e saltos.
- Resistência reduz perda de velocidade e impulso lateral em colisões; preservadas três vidas e destruição por ataque sem escudo.
- IA usa direção com inércia, pode ser empurrada da pista e perde uma vida por queda, mesmo com escudo. Retorna centralizada após um segundo.
- Cronômetro da volta inclui queda e respawn.
- Projéteis VR usam interseção ao longo do segmento, evitando atravessar adversários entre quadros.
- Pool de até 32 projéteis por tipo, amostras do minimapa reutilizadas e preview sem reconstrução quando a seleção não muda.
- Liberação de geometrias e materiais no encerramento do motor.
- Verificação de tipos, lint e testes antes do build publicado. Tipos Cloudflare gerados com Wrangler, sem dependências novas.

## Validação manual pendente em hardware

Validação local: typecheck e lint sem erros; 29 testes aprovados; build:pages aprovado. No navegador: entrada → História → nave → pista → largada; eliminação, reinício com velocidade/tempo zerados e nitro restaurado; pausa e retorno à entrada.

Validar com Quest 3: laser em todas as opções; seleção de Cloudline; mão direita/canhota após reconexão; precisão dos tiros; conforto do contravolante e loop; pelo menos cinco corridas consecutivas. Medir FPS e tempo de quadro durante rajadas. Otimizações de alocação não equivalem a medição de ganho no headset.

## Próxima etapa de produto

Cup com pontuação acumulada, progresso persistente de campanha e controles de conforto continuam no roadmap. Esta entrega consolida os seis pontos da análise antes dessas expansões.
