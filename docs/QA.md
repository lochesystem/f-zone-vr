# Plano de qualidade

## Estratégia

Cada entrega combina três níveis:

1. **Automático** — testes, lint e build.
2. **Smoke test desktop** — fluxo completo no navegador com teclado e gamepad.
3. **Teste no Meta Quest 3** — WebXR, controles, cockpit, conforto e desempenho.

Uma alteração de pista ou VR não está validada somente porque compila.

## Comandos obrigatórios

```bash
npm test
npm run lint
npm run build:pages
```

### Cobertura automática atual

- Cinco circuitos medidos quanto a comprimento e separação entre segmentos.
- Magma Crown e Cloudline Metro verificadas quanto a inclinação progressiva e alinhamento dos saltos.
- Duração mínima teórica verificada para quatro voltas no limite de 600 km/h.
- Nitro sem recarga passiva e velocímetro limitado a 600 km/h.
- Reinício centralizado para limpar velocidade, nitro, volta, progresso, cronômetros e rivais.

Essas verificações reduzem regressões, mas a homologação final continua exigindo cinco corridas consecutivas e teste de conforto no Meta Quest 3.

## Matriz de plataformas

| Área | Desktop/teclado | Desktop/gamepad | Meta Quest 3 |
| --- | --- | --- | --- |
| Tela inicial | Obrigatório | Obrigatório | Visível antes do XR |
| Menus | Mouse/teclado | Analógico/botão | Raios + analógico |
| Direção | A/D e setas | Analógico | Analógico esquerdo |
| Acelerar/frear | W/S | Gatilhos | Gatilhos |
| Nitro/mapa | Teclas | Botões | Botões mapeados |
| Cockpit 3D | Espelho | Espelho | Obrigatório |
| Sessão contínua | Não aplicável | Não aplicável | Obrigatório |
| Áudio | Obrigatório | Obrigatório | Obrigatório |

## Smoke test de fluxo

- [ ] Página inicial carrega com estilos e sem erro no console.
- [ ] Jogar na tela inicia o menu de modos.
- [ ] Entrar em VR solicita sessão no Quest.
- [ ] História, Arcade e Cup permitem escolher nave e avançar.
- [ ] Todas as cinco naves podem ser selecionadas.
- [ ] Todas as pistas disponíveis podem ser selecionadas.
- [ ] Contagem mostra uma única sequência 3, 2, 1, GO.
- [ ] Corrida inicia com velocidade e nitro zerados.
- [ ] Pausa e opções funcionam.
- [ ] Chegada abre ranking final.
- [ ] Repetir ou iniciar outra corrida reinicia todo o estado.
- [ ] História bloqueia avanço fora do pódio e libera no pódio.

## Regressão de pilotagem

- [ ] Soltar o acelerador reduz a velocidade até zero.
- [ ] Velocímetro exibe zero parado e não acumula entre corridas.
- [ ] Direção atravessa a largura útil em tempo compatível com ultrapassagem.
- [ ] Assistência não força a nave ao centro quando há entrada lateral.
- [ ] Frenagem tem efeito perceptível.
- [ ] Nitro consome recurso finito.
- [ ] Energia não regenera sozinha fora das áreas previstas.
- [ ] Zona lateral de recarga aumenta energia gradualmente.
- [ ] Boost pad aplica impulso uma vez por passagem válida.
- [ ] Efeito de nitro não encobre a pista.
- [ ] Colisão entre naves altera trajetória sem travar os veículos.
- [ ] Barreira penaliza e devolve a nave à área dirigível.
- [ ] Vácuo exige proximidade e alinhamento atrás do rival.

## Regressão de IA e ranking

- [ ] Oponentes largam e completam voltas.
- [ ] Posição usa volta e progresso, não somente distância instantânea.
- [ ] Minimap mostra jogador e todos os oponentes.
- [ ] Ranking final coincide com a ordem de chegada.
- [ ] IA não atravessa lacunas ou paredes de forma sistemática.
- [ ] Um jogador competente consegue disputar primeiro lugar.
- [ ] Pódio não é automático sem pilotagem adequada.
- [ ] Rival da história está presente no evento correto.

## Validação de pista

Aplicar a cada circuito novo ou alterado:

- [ ] Comprimento mínimo de 3,5 km.
- [ ] Largura-base de 48 unidades, salvo exceção documentada.
- [ ] Curva fecha sem degrau ou distorção de largura.
- [ ] Não existem vértices em V.
- [ ] Segmentos próximos mantêm separação horizontal/vertical segura.
- [ ] Túneis não atravessam outras partes da pista.
- [ ] Nenhum bloco decorativo entra na área dirigível.
- [ ] Subidas e descidas têm transições progressivas.
- [ ] Saltos possuem decolagem, vão e recepção alinhados.
- [ ] IA completa ao menos três corridas sem recuperação anormal.
- [ ] Minimap representa exatamente o circuito.
- [ ] Linha de chegada contabiliza uma volta apenas.
- [ ] Identidade visual é diferente das demais pistas.
- [ ] Corrida padrão dura aproximadamente 2 a 4 minutos.

## Regressão visual das naves

- [ ] Modelo da seleção corresponde ao modelo da corrida.
- [ ] Jogador e oponentes possuem silhuetas distinguíveis.
- [ ] Cada nave possui cores, cockpit e carenagem próprios.
- [ ] Propulsores reagem à aceleração.
- [ ] Nitro possui estado visual próprio.
- [ ] Nenhuma geometria cobre grande parte da visão ou fica sem acabamento.
- [ ] Materiais não aparecem pretos por ausência de luz ou normais incorretas.

## Áudio

- [ ] Música começa somente após interação do usuário.
- [ ] Música repete sem criar camadas duplicadas.
- [ ] Motor varia com aceleração e velocidade sem volume excessivo.
- [ ] Nitro possui som distinto.
- [ ] Contagem, impacto e chegada são audíveis.
- [ ] Geral, música e SFX podem ser zerados separadamente.
- [ ] Preferências persistem após recarregar a página.
- [ ] Ausência do MP3 não impede o jogo de iniciar.

## GitHub Pages

- [ ] `build:pages` gera `dist/client`.
- [ ] HTML usa o prefixo `/f-zone-vr`.
- [ ] JavaScript e CSS carregam sem 404.
- [ ] `background.mp3` carrega sem 404.
- [ ] URL pública abre a tela estilizada, não HTML cru.
- [ ] Site público oferece WebXR no Meta Quest Browser.
- [ ] Uma corrida completa funciona na versão publicada.

## Registro de defeitos

Um bug deve incluir:

- versão/commit e URL testada;
- plataforma e método de entrada;
- modo, nave e pista;
- passos mínimos para reproduzir;
- comportamento observado e esperado;
- imagem ou vídeo quando visual/VR;
- frequência: sempre, intermitente ou uma vez.
