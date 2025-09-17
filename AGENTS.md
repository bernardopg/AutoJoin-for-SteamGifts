# AGENTS · Guia para agentes/automações

Este documento orienta agentes de IA, bots e automações (inclusive warp.dev, GitHub Codespaces ou assistentes locais) que executem ações neste repositório.

- [Português (Brasil)](#pt)
- [English](#en)

---

<a id="pt"></a>
<details open>
<summary><strong>Português (Brasil)</strong></summary>

#### Política geral
- Respeite as instruções dos mantenedores presentes em README, CONTRIBUTING, SECURITY e nos próprios arquivos.
- Priorize segurança: nada de credenciais externas nem modificações em permissões da extensão sem aprovação humana.
- Prefira mudanças incrementais e explique claramente cada passo no histórico de comandos/comentários.

#### Tarefas típicas para agentes
| Categoria | Ações permitidas | Scripts úteis |
|-----------|------------------|----------------|
| Lint/format | Executar `npm run lint`, `npm run format`, `npm run check` | `npm run lint` |
| Testes | Executar o smoke test (`npm test`) | `npm test` |
| Build local | Gerar `.zip` sem incluir `node_modules` | `zip -r AutoJoin.zip . -x "node_modules/*" -x "*.git*"` |
| Análise | Mapear estrutura (`tree`, `ls`), ler arquivos, gerar relatórios | `ls`, `cat`, `grep` |

#### Boas práticas
- Antes de escrever arquivos, faça backup mental do conteúdo original (use `cat` ou `sed -n`).
- Use `apply_patch` ou redirecionamento (`cat <<'EOF' > arquivo`) para atualizações atômicas.
- Comente o que foi executado e o motivo, principalmente em PRs automatizados.
- Não faça push forçado, rebase remoto ou merge automático.
- Ao encontrar instruções conflitantes, solicite confirmação humana.

#### Restrições
- Não altere `manifest.json` para adicionar permissões sem aval explícito.
- Não suba pacotes a lojas (Chrome Web Store / AMO).
- Evite dependências externas não auditadas; qualquer inclusão deve ter justificativa.
- Logs devem permanecer discretos; evite inserir `console.log` permanentes.

</details>

---

<a id="en"></a>
<details>
<summary><strong>English</strong></summary>

#### General policy
- Follow maintainer instructions documented in README, CONTRIBUTING, SECURITY and in-file comments.
- Security first: never introduce external secrets or modify extension permissions without human approval.
- Work incrementally and describe each action in command history or PR comments.

#### Typical agent tasks
| Category | Allowed actions | Handy scripts |
|----------|-----------------|---------------|
| Lint/format | Run `npm run lint`, `npm run format`, `npm run check` | `npm run lint` |
| Tests | Run the smoke test (`npm test`) | `npm test` |
| Local package | Produce a `.zip` without `node_modules` | `zip -r AutoJoin.zip . -x "node_modules/*" -x "*.git*"` |
| Analysis | Inspect structure (`ls`, `tree`), read files, generate reports | `ls`, `cat`, `grep` |

#### Best practices
- Inspect files before editing (`cat`, `sed -n`) to avoid accidental loss of content.
- Use `apply_patch` or heredoc redirection for atomic edits.
- Explain executed commands and rationale, especially when submitting automated PRs.
- Do not force-push, remote rebase, or auto-merge without maintainer sign-off.
- If conflicting instructions appear, escalate to a human maintainer.

#### Restrictions
- Do not modify `manifest.json` permissions without explicit approval.
- Do not publish builds to Chrome Web Store / AMO.
- Avoid adding unaudited external dependencies; provide justification and security notes if required.
- Keep logging minimal; avoid introducing noisy `console.log` statements.

</details>

---

**Checklist rápida para agentes**
- [ ] Leu README + CONTRIBUTING + SECURITY
- [ ] Executou `npm run check` antes de sugerir mudanças
- [ ] Documentou comando/saída relevante
- [ ] Validou permissões e segurança
- [ ] Informou limitações ou dúvidas antes de prosseguir

