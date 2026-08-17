# Desenvolvimento, release e publicação

## Pré-requisitos

- Node.js 22.13 ou superior.
- npm.
- Git.
- Para publicação: acesso ao repositório `lochesystem/f-zone-vr`.
- Para validação VR: Meta Quest 3 e Meta Quest Browser.

## Instalação e execução

```bash
npm install
npm run dev
```

O servidor local é aberto normalmente em `http://localhost:3000/`. WebXR imersivo requer contexto seguro; o teste final deve usar a URL HTTPS publicada.

## Validação local

```bash
npm test
npm run lint
npm run build:pages
```

A saída estática do Pages fica em `dist/client`.

## Fluxo de publicação

O workflow `.github/workflows/pages.yml` publica automaticamente a branch `main` no GitHub Pages:

1. instalar dependências de forma reproduzível;
2. executar o build estático com prefixo `/f-zone-vr`;
3. enviar `dist/client` como artifact do Pages;
4. fazer deploy no ambiente `github-pages`.

URL pública: <https://lochesystem.github.io/f-zone-vr/>

## Checklist antes de abrir PR

- [ ] Escopo da mudança está claro.
- [ ] Não há alterações locais do usuário incluídas por acidente.
- [ ] Documentação correspondente foi atualizada.
- [ ] `npm test` passou.
- [ ] `npm run lint` passou.
- [ ] `npm run build:pages` passou.
- [ ] Smoke test desktop passou.
- [ ] Mudanças em VR foram testadas no Quest ou marcadas explicitamente como pendentes.
- [ ] Mudanças de pista passaram pelo checklist geométrico.
- [ ] Não há assets grandes ou sem licença adicionados por acidente.

## Checklist após merge

- [ ] Workflow do Pages concluiu sem erro.
- [ ] URL pública serve a revisão correta.
- [ ] CSS, JavaScript e música não retornam 404.
- [ ] Tela inicial e seleção funcionam.
- [ ] Meta Quest reconhece **Entrar em VR**.
- [ ] Uma corrida curta foi concluída no deploy.

## Versionamento

Enquanto o jogo estiver em protótipo:

- commits devem descrever uma entrega observável;
- mudanças de balanceamento devem registrar valores e motivação;
- mudanças de regras devem atualizar GDD ou decisões;
- um marco jogável pode receber tag `v0.x.0`;
- correções sem conteúdo novo podem receber `v0.x.y`.

## Rollback

Se a versão publicada estiver quebrada:

1. identificar o primeiro commit defeituoso;
2. criar um commit de reversão seguro, preservando histórico;
3. validar `build:pages`;
4. enviar para `main` pelo fluxo normal;
5. confirmar o novo deploy;
6. registrar a causa e adicionar um caso ao [plano de QA](QA.md).

Evitar reescrever histórico da branch principal ou usar reset destrutivo.

## Assets

- Música atual: `public/audio/background.mp3`.
- Assets públicos precisam usar caminhos compatíveis com o prefixo do Pages.
- Não adicionar query string manual de cache ao nome do MP3.
- Registrar origem e licença de qualquer asset externo antes da publicação.
