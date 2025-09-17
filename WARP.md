# WARP • Manual para warp.dev / Cloud workspaces

Este guia ajuda ambientes warp.dev (ou terminais remotos semelhantes) a colaborar com o projeto de forma segura e produtiva.

- [Português (Brasil)](#pt)
- [English](#en)

---

<a id="pt"></a>
<details open>
<summary><strong>Português (Brasil)</strong></summary>

#### Resumo técnico
- Extensão Chrome/Edge Manifest V3; scripts principais em `js/`, módulos em `js/core/` e páginas em `html/`.
- Requer Node.js ≥ 18 apenas para lint/test automatizados (a extensão em si não depende de build).
- Configuração recomendada: `npm install` seguido de `npm run check`.

#### Fluxo sugerido no warp.dev
1. **Inicialização**
   ```bash
   npm install
   npm run check
   ```
2. **Desenvolvimento** – use `warp` blocks ou painéis para acompanhar logs (`npm run lint -- --fix`, `npm test`).
3. **Hot reload** – recarregue a extensão via `chrome://extensions` → *Reload* após `npm run check`.
4. **Pacotes** – para gerar builds locais, utilize `zip -r AutoJoin_$(date +%Y%m%d).zip . -x "node_modules/*" -x "*.git*"`.

#### Dicas específicas warp.dev
- Configure Workflows com prompts que executem `npm run lint` e `npm test` antes de concluir.
- Utilize blocos de saída (Output Blocks) para salvar diffs críticos ou logs relevantes para revisão humana.
- Habilite sincronização de variáveis apenas para valores não sensíveis; tokens do SteamGifts não devem ser armazenados.

#### Segurança & privacidade
- Não acesse sites externos a partir do workspace sem necessidade.
- Use redes privadas ou VPN confiável ao testar funcionalidades que interagem com Steam/SteamGifts.

</details>

---

<a id="en"></a>
<details>
<summary><strong>English</strong></summary>

#### Technical quick facts
- Chrome/Edge Manifest V3 extension; core scripts under `js/`, modules under `js/core/`, pages in `html/`.
- Node.js ≥ 18 only for linting/testing automation (extension has no bundling step).
- Recommended bootstrap: `npm install` followed by `npm run check`.

#### Suggested warp.dev flow
1. **Bootstrap**
   ```bash
   npm install
   npm run check
   ```
2. **Development** – leverage warp blocks/panels to watch lint output (`npm run lint -- --fix`, `npm test`).
3. **Hot reload** – reload the extension via `chrome://extensions` → *Reload* after running checks.
4. **Packaging** – produce local builds via `zip -r AutoJoin_$(date +%Y%m%d).zip . -x "node_modules/*" -x "*.git*"`.

#### warp.dev tips
- Create Workflows that enforce `npm run lint` and `npm test` before completion.
- Use Output Blocks to capture critical diffs/logs for human review.
- Sync variables only for non-sensitive values; never store Steam/SteamGifts tokens in warp secrets.

#### Security & privacy
- Avoid browsing unrelated sites from the workspace to reduce exposure.
- Prefer trusted networks or VPN when testing flows interacting with Steam/SteamGifts.

</details>

---

Para instruções gerais de contribuição consulte [`CONTRIBUTING.md`](CONTRIBUTING.md) e para segurança veja [`SECURITY.md`](SECURITY.md).

