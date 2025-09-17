# Security Policy · Política de Segurança

- [Português (Brasil)](#pt)
- [English](#en)

---

<a id="pt"></a>
<details open>
<summary><strong>Português (Brasil)</strong></summary>

#### Como reportar vulnerabilidades
1. Acesse [GitHub Security Advisories](https://github.com/bernardopg/AutoJoin-for-SteamGifts/security/advisories/new).
2. Descreva o problema com o máximo de detalhes, incluindo passos de reprodução, impacto estimado e versão/commit afetado.
3. Informe contato para retorno. Preferimos comunicação em português ou inglês.
4. Aguarde confirmação em até **5 dias úteis**. Casos críticos recebem prioridade.

> Caso não consiga usar o formulário, abra um issue privado (GitHub Corporate) ou envie mensagem direta ao mantenedor `@bernardopg`.

#### Escopo
- Código da extensão (scripts em `js/` e `js/core/`).
- Configuração do manifesto (`manifest.json`).
- Fluxos de armazenamento (`chrome.storage`), permissões e comunicações com Steam/SteamGifts.

#### Fora de escopo
- Vulnerabilidades do próprio SteamGifts ou Steam.
- Modificações de terceiros (forks, builds não oficiais).
- Ataques que exigem acesso físico ao dispositivo do usuário.

#### Boas práticas atuais
- Permissões mínimas e opcionais.
- Logs de console restritos a níveis `debug/warn/error`.
- Sem coleta de dados pessoais ou telemetria.

</details>

---

<a id="en"></a>
<details>
<summary><strong>English</strong></summary>

#### Reporting vulnerabilities
1. Use [GitHub Security Advisories](https://github.com/bernardopg/AutoJoin-for-SteamGifts/security/advisories/new).
2. Provide detailed reproduction steps, potential impact, and affected commit/version.
3. Include a contact channel. Submissions in English or Portuguese are welcome.
4. Expect acknowledgment within **5 business days**; critical issues are triaged with priority.

> If the advisory form is unavailable, reach out privately to maintainer `@bernardopg`.

#### In scope
- Extension code (`js/`, `js/core/`).
- Manifest configuration (`manifest.json`).
- Storage flows (`chrome.storage`), permissions, and interactions with Steam/SteamGifts endpoints.

#### Out of scope
- Vulnerabilities inherent to SteamGifts or Steam themselves.
- Third-party forks or unofficial distributions.
- Attacks requiring physical access to user hardware.

#### Current safeguards
- Minimal, opt-in permissions.
- Console logging limited to `debug/warn/error` levels.
- No telemetry or personal data collection.

</details>

---

Obrigado por ajudar a manter o AutoJoin seguro! • Thank you for keeping AutoJoin safe!

