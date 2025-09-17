# Contribuição • Contribution

Obrigado por dedicar tempo ao AutoJoin for SteamGifts! Este guia reúne expectativas, fluxo de trabalho e boas práticas em Português-BR e Inglês.

- [Português (Brasil)](#pt)
- [English](#en)

---

<a id="pt"></a>
<details open>
<summary><strong>Português (Brasil)</strong></summary>

#### Antes de começar
- Leia o [`README`](README.md) para entender arquitetura, scripts e escopo atual.
- Configure o ambiente com `npm install` e teste com `npm run check`.
- Verifique se existe issue relacionada; caso contrário, crie uma descrevendo motivação e impacto.

#### Fluxo de trabalho recomendado
1. **Crie um fork** ou branch direto (se possuir permissão de escrita).
2. Crie uma branch descritiva: `feature/auto-dark-mode`, `fix/token-refresh`.
3. Desenvolva mudanças em commits pequenos e autoexplicativos (`git commit -m "fix: valida token de sessão"`).
4. Rode `npm run check` e `npm test` antes de abrir o PR.
5. Abra pull request contra `master`, preenchendo o template:
   - Contexto (problema + solução)
   - Testes executados/manual QA
   - Checkboxes de impacto (UI, permissões, segurança)
   - Issues relacionadas (ex.: `Closes #42`)
6. Responda ao code review rapidamente; mantenha a discussão no PR.

#### Estilo de código
- Acompanhe o estilo existente e mantenha funções curtas e puras quando possível.
- Use os utilitários de `AutoJoinUtils` antes de introduzir novas bibliotecas.
- Execute `npm run format` para evitar diffs de formatação.
- Logs permanentes devem usar `console.debug`, `console.warn` ou `console.error` de forma intencional.

#### Testes e validação manual
- `npm test` cobre o smoke test do manifest; adicione testes complementares sob `tests/`.
- Valide manualmente em pelo menos um navegador Chromium; teste Firefox quando alterar permissões.
- Revise o console do navegador e do service worker (`chrome://extensions → background page`).

#### Reporte responsável
- Vulnerabilidades devem seguir as orientações de [`SECURITY.md`](SECURITY.md); evite divulgar publicamente antes da correção.

#### Direitos autorais e licença
- Ao contribuir você concorda com a licença [MIT](LICENSE) do projeto.
- Inclua créditos em `CHANGELOG` (quando existir) ou na descrição do PR.

</details>

---

<a id="en"></a>
<details>
<summary><strong>English</strong></summary>

#### Before you start
- Review the [`README`](README.md) for architecture, tooling and scope.
- Set up the environment with `npm install`, validate using `npm run check`.
- Search for an existing issue; if none exists, open one explaining the motivation and impact.

#### Suggested workflow
1. **Fork** (or branch directly if you have write access).
2. Create a descriptive branch: `feature/dynamic-banners`, `fix/service-worker-crash`.
3. Commit in small, focused chunks using imperative messages (`feat: add wishlist priority toggle`).
4. Execute `npm run check` and `npm test` before submitting.
5. Open a pull request against `master` including:
   - Background, solution outline, screenshots if UI is affected
   - Manual/automated testing notes
   - Impact checklist (UI, permissions, security, docs)
   - Linked issues (e.g. `Fixes #42`)
6. Respond promptly to review feedback; keep the conversation inside the PR thread.

#### Code style
- Follow existing patterns and reuse helpers (`AutoJoinUtils`, `settings-store`) when available.
- Run `npm run format` to enforce Prettier defaults.
- Use explicit log levels (`console.debug`/`console.warn`/`console.error`) and avoid noisy output.

#### Testing & manual QA
- `npm test` currently covers manifest integrity; add more coverage under `tests/` as needed.
- Manually validate in at least one Chromium browser; include Firefox when permissions or storage flows change.
- Inspect both page and service worker consoles for warnings or errors.

#### Responsible disclosure
- Report security concerns following [`SECURITY.md`](SECURITY.md) guidelines; avoid public disclosure before a fix is prepared.

#### Copyright & license
- Contributions are accepted under the project [MIT](LICENSE) license.
- Credit yourself in the PR description and update changelog entries when applicable.

</details>

---

**Checklist rápida (Quick checklist)**
- [ ] Issue vinculada ou contexto descrito
- [ ] `npm run check` executado
- [ ] `npm test` executado
- [ ] Documentação atualizada (quando necessário)
- [ ] Prints/GIFs anexados para mudanças visuais
- [ ] Segurança e permissões revisadas

Obrigado por tornar o AutoJoin melhor! • Thank you for making AutoJoin better!

