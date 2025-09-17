# AutoJoin for SteamGifts

Extensão/Userscript que automatiza a participação em sorteios do SteamGifts com foco em segurança, transparência e experiência moderna.

- [Português (Brasil)](#pt)
- [English](#en)

---

<a id="pt"></a>
<details open>
<summary><strong>Português (Brasil)</strong></summary>

<a id="pt-indice"></a>
#### Índice
- [Visão geral](#pt-visao-geral)
- [Principais recursos](#pt-recursos)
- [Instalação rápida](#pt-instalacao)
- [Como usar](#pt-uso)
- [Scripts npm e automação](#pt-scripts)
- [Arquitetura resumida](#pt-arquitetura)
- [Segurança e privacidade](#pt-seguranca)
- [Suporte, comunidade e roadmap](#pt-suporte)
- [Licença](#pt-licenca)

<a id="pt-visao-geral"></a>
#### Visão geral
AutoJoin for SteamGifts é uma extensão Manifest V3 que adiciona recursos inteligentes às páginas do SteamGifts.com: inscrição automática controlada, relatórios de status, tema noturno aprimorado e integrações para redimir chaves Steam com segurança.

<a id="pt-recursos"></a>
#### Principais recursos
- **AutoJoin consciente**: entra nos sorteios seguindo filtros de pontos, nível e listas de prioridade definidas pelo usuário.
- **Tema escuro e ajustes visuais**: melhora contraste, acessibilidade e adiciona atalhos úteis.
- **Execução em plano de fundo**: usa service worker conforme Manifest V3 e offscreen documents para parsing DOM e alertas de áudio.
- **Configurações sincronizadas**: todas as preferências são salvas com `chrome.storage.sync`, permitindo compartilhar configuração entre navegadores.
- **Logs discretos**: apenas mensagens relevantes aparecem no console, facilitando depuração e evitando ruído.

<a id="pt-instalacao"></a>
#### Instalação rápida
1. Clone ou baixe este repositório.
2. Chrome/Edge: abra `chrome://extensions`, ative o modo desenvolvedor e carregue a pasta raiz como "Unpacked".
3. Firefox: abra `about:debugging` → *This Firefox* → *Load Temporary Add-on* → selecione `manifest.json`.
4. Opcional: gere um `.zip` para distribuição com `zip -r AutoJoin.zip . -x "node_modules/*" -x "*.git*"`.

<a id="pt-uso"></a>
#### Como usar
- Abra uma página do SteamGifts. O AutoJoin adiciona botões, indicadores de odds e filtros inline.
- Use **AutoJoin** para processar as páginas carregadas. Os filtros de custo, nível, whitelist, grupos e DLC são respeitados automaticamente.
- Abra **AutoJoin Settings** no menu superior para ajustar comportamento, tema, comentários automáticos e permissões opcionais da Steam Community.

<a id="pt-scripts"></a>
#### Scripts npm e automação
```bash
npm install        # instala dependências de desenvolvimento
npm run lint       # verifica estilo com ESLint (js/ e tests/)
npm run format     # garante formatação consistente com Prettier
npm run check      # executa lint + format em sequência
npm test           # executa o pacote smoke test (Node --test)
```
> Todos os comandos são seguros para rodar em CI ou ambientes isolados.

<a id="pt-arquitetura"></a>
#### Arquitetura resumida
```
js/
├── autoentry.js          # script principal rodando nas páginas do SteamGifts
├── backgroundpage.js     # service worker (auto join em segundo plano, notificações)
├── core/
│   ├── giveaway.js       # modelo e regras de filtragem/participação
│   ├── page-enhancements.js # interface, acessibilidade, scroll infinito
│   └── settings-store.js # camada unificada para chrome.storage
├── offscreen.js          # parser HTML e áudio em documento offscreen
└── utils-enhanced.js     # utilidades modernas (debounce, feature flags, etc.)
html/                     # páginas de opções e offscreen
css/                      # tema, layout e animações
```

<a id="pt-seguranca"></a>
#### Segurança e privacidade
- Nenhuma chave ou token é enviado para serviços de terceiros.
- Permissões mínimas: `steamgifts.com`, `store.steampowered.com` e opcionais em `steamcommunity.com`.
- Dados de configurações usam apenas `chrome.storage.sync` e `chrome.storage.local` (sem analytics).
- Consulte [`SECURITY.md`](SECURITY.md) para reporte de vulnerabilidades e boas práticas adicionais.

<a id="pt-suporte"></a>
#### Suporte, comunidade e roadmap
- Abra issues para bugs, ideias ou dúvidas.
- Veja [`CONTRIBUTING.md`](CONTRIBUTING.md) para padrão de branches, commits e checklist de PR.
- O backlog público vive em issues com a label `roadmap`. Sugestões são bem-vindas.

<a id="pt-licenca"></a>
#### Licença
Distribuído sob a licença [MIT](LICENSE). Você pode usar, modificar e redistribuir, mantendo avisos de copyright.

</details>

---

<a id="en"></a>
<details>
<summary><strong>English</strong></summary>

<a id="en-index"></a>
#### Index
- [Overview](#en-overview)
- [Key features](#en-features)
- [Quick install](#en-install)
- [Usage guide](#en-usage)
- [npm scripts & automation](#en-scripts)
- [Architecture snapshot](#en-architecture)
- [Security & privacy](#en-security)
- [Support & roadmap](#en-support)
- [License](#en-license)

<a id="en-overview"></a>
#### Overview
AutoJoin for SteamGifts is a Manifest V3 extension that enhances SteamGifts.com with safe auto-entry, UI upgrades, optional dark theme, and secure Steam key redemption helpers.

<a id="en-features"></a>
#### Key features
- **Context-aware auto join**: obeys point, level, whitelist/group, and DLC filters defined by the user.
- **Modern UI polish**: higher contrast, accessibility tweaks, quick actions and informative odds.
- **Background execution**: MV3 service worker plus offscreen documents for DOM parsing and notifications.
- **Synced preferences**: all settings live in `chrome.storage.sync`, so browsers stay aligned.
- **Purposeful logging**: console output stays minimal and actionable.

<a id="en-install"></a>
#### Quick install
1. Clone or download the repository.
2. Chrome/Edge: open `chrome://extensions`, enable Developer Mode, load the project root as an unpacked extension.
3. Firefox: open `about:debugging` → *This Firefox* → *Load Temporary Add-on* → choose `manifest.json`.
4. Optional: package a `.zip` release with `zip -r AutoJoin.zip . -x "node_modules/*" -x "*.git*"`.

<a id="en-usage"></a>
#### Usage guide
- Visit any SteamGifts page. AutoJoin injects the enhanced toolbar, odds indicators, and filtering helpers.
- Hit **AutoJoin** to process loaded giveaways. All user-defined thresholds are enforced automatically.
- Open **AutoJoin Settings** from the navbar to customise behaviour, theme, auto-comments, and optional Steam Community permissions.

<a id="en-scripts"></a>
#### npm scripts & automation
```bash
npm install        # install dev dependencies
npm run lint       # run ESLint across js/ and tests/
npm run format     # Prettier formatting check
npm run check      # lint + format chain
npm test           # smoke tests via Node --test
```
> Every command is safe to integrate in CI/CD workflows.

<a id="en-architecture"></a>
#### Architecture snapshot
```
js/
├── autoentry.js          # main content script
├── backgroundpage.js     # service worker (auto join, notifications, key redemption)
├── core/
│   ├── giveaway.js       # giveaway model + filtering rules
│   ├── page-enhancements.js # UI enhancements / accessibility / infinite scroll
│   └── settings-store.js # unified storage gateway
├── offscreen.js          # DOM parsing & audio offscreen document
└── utils-enhanced.js     # helpers (debounce, feature detection, formatting)
html/                     # options & offscreen pages
css/                      # themes, layout, animations
```

<a id="en-security"></a>
#### Security & privacy
- No analytics, tracking or third-party telemetry.
- Minimal host permissions (`steamgifts.com`, `store.steampowered.com`) plus optional `steamcommunity.com` for owned games/wishlist sync.
- Settings are stored via Chrome storage APIs only.
- Refer to [`SECURITY.md`](SECURITY.md) for vulnerability disclosure and best practices.

<a id="en-support"></a>
#### Support & roadmap
- File an issue for bugs, ideas or clarifications.
- Follow [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch strategy, commit hygiene and PR requirements.
- The public roadmap is tracked through issues tagged with `roadmap`; feel free to propose new items.

<a id="en-license"></a>
#### License
Released under the [MIT](LICENSE) License. Reuse, modify and distribute freely while keeping attribution.

</details>

---

#### Documentos relacionados
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Diretrizes de contribuição / Contribution guide
- [`AGENTS.md`](AGENTS.md) — Orientações para agentes/assistentes automatizados
- [`WARP.md`](WARP.md) — Manual específico para warp.dev
- [`SECURITY.md`](SECURITY.md) — Política de segurança e reporte responsável

