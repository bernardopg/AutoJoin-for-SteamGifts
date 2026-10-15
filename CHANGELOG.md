# 📝 Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] - 2026-10-15

### 🚀 Adicionado

- Workflow `codeql.yml` (CodeQL `security-and-quality`) habilitando o code scanning do GitHub, que até então não tinha nenhuma análise.
- Workflow `dependency-review.yml` bloqueando PRs que introduzam dependências com vulnerabilidade `high` ou superior.
- `.github/CODEOWNERS` substituindo a chave `reviewers` (descontinuada) do Dependabot.
- Scripts `lint:fix` e `format:fix` para correção automática.
- Node 24 na matriz de testes e campo `engines` no `package.json`.
- Testes para `settings-store`, regras de giveaway, helpers do background, metadata e regressões de fixtures.
- Verificação de uso de chaves i18n na fonte e paridade entre idiomas.
- Helpers puros compartilhados para cálculo de win chance, bloqueio de sessão Steam e regras de giveaway.
- Trava no snapshot de SteamGifts para evitar carregamento de scripts externos de ads.
- `.nvmrc` com a versão LTS padrão (24) e `.npmrc` com `engine-strict`, `package-lock` e `fund=false`.
- `.prettierignore` listando `build/`, `dist/`, `node_modules/` e diretórios de ferramentas, para não depender do `--ignore-path .gitignore` (removido no Prettier 4).
- Campos `engines` e `devEngines` no `package.json` declarando o runtime Node.js suportado e o npm como gerenciador de pacotes.

### ✨ Melhorado

- Font Awesome empacotado atualizado de `6.0.0` (2022) para `7.3.1`: CSS regerado a partir do `all.css` oficial com os caminhos de fonte em `./webfonts/` (como `js/autoentry.js` espera) e as quatro fontes `woff2` substituídas pelas oficiais. As 30 classes de ícone usadas pela extensão continuam existindo na v7; as únicas classes legadas (`fa-clock-o`, `fa-times`, etc.) que a v7 não define são seletores do HTML do SteamGifts, não ícones próprios.
- Dependências de desenvolvimento atualizadas: ESLint `10.12.0`, `globals` `17.13.0`, Prettier `3.9.10` e lockfile regenerado via `npm ci`.
- Node 20 (fim de vida em 2026-04-30) removido do `engines` e da matriz de testes; o CI agora roda em Node 22, 24 e 26, com Node 24 como versão padrão dos jobs.
- Workflows do GitHub Actions com `timeout-minutes`, `persist-credentials: false` no checkout e auto-merge do Dependabot removendo a branch após o merge.
- Dependabot com `cooldown` por severidade SemVer (reduz risco de supply chain), agendamento semanal explícito e prefixos de commit `chore`/`ci`.
- ESLint migrado da v8 (fim de vida) para a v10 com flat config (`eslint.config.mjs`); `eslint-config-airbnb-base` e `eslint-plugin-import`, ambos sem manutenção e travando o upgrade, foram removidos.
- `scripts/*.mjs` passaram a ser cobertos por lint e format check.
- Job de build do CI passou a usar `npm run package`, gerando o mesmo `.zip` do build local em vez de um zip ad-hoc que incluía arquivos internos do repositório.
- Job de release passou a pular a publicação quando a tag da versão já existe.
- Auditoria de segurança do CI separada: dependências de runtime bloqueiam o pipeline, dependências de desenvolvimento apenas reportam.
- Actions com pins consistentes entre todos os workflows (`checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `download-artifact@v8`).
- `concurrency` adicionado aos workflows e `permissions` reduzidas ao mínimo por job.
- Dependabot com agrupamento de updates minor/patch para reduzir ruído de PRs.
- README alinhado com defaults reais, scripts disponíveis e convenção de locale.
- Documentação do locale esclarecida: a app usa `pt-BR` e os messages da extensão ficam em `_locales/pt_BR`.
- `html/settings.html` passou a usar `media/autologo.png` para evitar 404 do logo.

### 🔧 Alterado

- `js/autoentry.js`, `js/core/autoentry-giveaway.js`, `js/core/autoentry-steam-data.js` e `js/settings.js` foram corrigidos e reestruturados.
- `js/backgroundpage.js` e `js/core/giveaway.js` agora delegam lógica pura para helpers testáveis.
- `TO-DO.md` foi sincronizado com as entregas concluídas.

### 🗑️ Removido

- Fontes `ttf` (`fa-brands-400`, `fa-regular-400`, `fa-solid-900`, `fa-v4compatibility`) removidas de `css/fontawesome/webfonts/` e de `web_accessible_resources`: a Font Awesome 7 só publica `woff2`, suportado por todos os navegadores alvo. Isso reduz o pacote em ~550 KB.

### 🐛 Corrigido

- Os 8 alertas da primeira análise do CodeQL:
  - `js/incomplete-url-substring-sanitization` (4x): checagens de host por `String.includes` em `background-helpers.js`, `backgroundpage.js`, `page-enhancements.js` e `tests/manifest.test.js` aceitavam hosts como `steamcommunity.com.evil.tld`. Agora comparam o hostname parseado via novo helper `matchesHost`.
  - `js/bad-tag-filter` e `js/incomplete-multi-character-sanitization`: removido o strip de `<script>` por regex em `settings.js`. O comentário do usuário só é enviado como campo de `FormData`, nunca vai para `innerHTML`, e o regex era contornável (`</script >`).
  - `js/remote-property-injection`: `AutoJoinUtils.getUrlParams` acumulava chaves da query string via escrita dinâmica de propriedade, permitindo `?__proto__=`. Passou a usar `Object.fromEntries`, que define propriedades próprias e não aciona setters.
  - `js/comparison-between-incompatible-types`: guarda duplicada de `cacheData` em `autoentry-giveaway.js`.
- Alertas abertos do Dependabot (`js-yaml` e `brace-expansion`, ambos `high`) resolvidos via atualização do `package-lock.json`; era essa a causa da falha recorrente do job `🔒 Security Audit` no CI.
- `brace-expansion` `5.0.9` → `5.0.12` no lockfile (GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7 e GHSA-6j4f-fj2g-mc7p); `npm audit` volta a reportar zero vulnerabilidades.
- `js/core/page-enhancements.js`: declaração `let` sem bloco dentro de `case` do atalho `Alt+S` (vazava o binding para os demais `case`).
- `js/backgroundpage.js`: atribuições iniciais mortas em `latestSteamKeyRedeemResponse` e `linkToUse`.
- Bindings de `catch` não utilizados substituídos por optional catch binding.
- Erros de sintaxe e wiring que quebravam o fluxo principal da extensão.
- 404 do logo no settings.
- Carregamento externo de `adsbygoogle` no snapshot de SteamGifts.

## [2.0.1] - 2024-12-17

### 🐛 Corrigido

- Compatibilidade com Manifest V3
- Melhorias na interface do usuário
- Otimizações de performance

### 🔒 Segurança

- Atualização de dependências com vulnerabilidades
- Implementação de Content Security Policy rigorosa

## [2.0.0] - 2024-10-15

### 🚀 Adicionado

- **BREAKING**: Migração completa para Manifest V3
- Service Workers substituindo background scripts
- Offscreen documents para processamento isolado
- Interface moderna com tema escuro aprimorado
- Sistema de filtragem avançado
- Notificações nativas do navegador
- Sincronização de configurações entre dispositivos

### ✨ Melhorado

- Performance significativamente melhorada
- Interface mais responsiva e acessível
- Sistema de logs mais limpo
- Compatibilidade estendida com navegadores

### 🔧 Alterado

- **BREAKING**: Estrutura de arquivos reorganizada
- **BREAKING**: APIs internas refatoradas
- Migração de jQuery para JavaScript vanilla
- Simplificação da arquitetura de componentes

### 🗑️ Removido

- **BREAKING**: Suporte para Manifest V2
- Dependências legadas descontinuadas
- Código não utilizado e comentado

### 🔒 Segurança

- Implementação de CSP (Content Security Policy)
- Validação rigorosa de inputs
- Permissões mínimas necessárias
- Isolamento de contextos de execução

## [1.9.2] - 2024-08-20

### 🐛 Corrigido

- Bug na sincronização de configurações
- Problema com detecção de sorteios duplicados
- Memory leak em long-running sessions

### 🔒 Segurança

- Patch para vulnerabilidade em dependência externa

## [1.9.1] - 2024-07-12

### 🐛 Corrigido

- Incompatibilidade com atualizações do SteamGifts
- Erro na validação de nível de usuário
- Problema de timeout em conexões lentas

### ✨ Melhorado

- Mensagens de erro mais informativas
- Tratamento melhor de edge cases

## [1.9.0] - 2024-06-05

### 🚀 Adicionado

- Filtro por odds de vitória
- Blacklist de jogos indesejados
- Estatísticas de uso da extensão
- Backup/restore de configurações

### ✨ Melhorado

- Algoritmo de detecção de sorteios otimizado
- Interface de configurações redesenhada
- Performance geral da extensão

### 🔧 Alterado

- Estrutura de dados de configuração
- Sistema de cache interno

## [1.8.3] - 2024-04-18

### 🐛 Corrigido

- Bug crítico no auto-join
- Problemas de compatibilidade com Firefox
- Erro na contagem de pontos disponíveis

## [1.8.2] - 2024-03-22

### 🐛 Corrigido

- Interface quebrada no modo escuro
- Problema com sorteios de grupos privados
- Memory leak em páginas de longa duração

### ✨ Melhorado

- Velocidade de scanning de páginas
- Precisão na detecção de sorteios elegíveis

## [1.8.1] - 2024-02-14

### 🐛 Corrigido

- Crash ao carregar configurações corrompidas
- Problema com caracteres especiais em nomes de jogos
- Bug na navegação entre páginas

### 🔒 Segurança

- Sanitização melhorada de inputs de usuário

## [1.8.0] - 2024-01-10

### 🚀 Adicionado

- Suporte inicial para Manifest V3
- Sistema de agenda para auto-join
- Integração com lista de desejos Steam
- Modo de compatibilidade para updates do site

### ✨ Melhorado

- Arquitetura preparada para migração MV3
- Sistema de logs mais robusto
- Interface mais polida

### 🔧 Alterado

- Refatoração de módulos principais
- Otimização de imports e dependências

## [1.7.2] - 2023-11-25

### 🐛 Corrigido

- Problemas com atualizações do SteamGifts
- Bug na detecção de level restriction
- Erro em sorteios com múltiplas cópias

## [1.7.1] - 2023-10-08

### 🐛 Corrigido

- Incompatibilidade com Chrome 118+
- Problema na sincronização de configurações
- Bug visual no contador de pontos

### ✨ Melhorado

- Suporte aprimorado para temas customizados
- Performance em páginas com muitos sorteios

## [1.7.0] - 2023-09-12

### 🚀 Adicionado

- Filtro por tipo de jogo (jogo base vs DLC)
- Suporte para grupos de prioridade
- Sistema de comentários automáticos
- Dashboard de estatísticas

### ✨ Melhorado

- UI/UX completamente redesenhada
- Sistema de notificações mais inteligente
- Algoritmos de filtragem otimizados

### 🔧 Alterado

- Migração para arquitetura modular
- Sistema de configuração refatorado

## [1.6.5] - 2023-07-20

### 🐛 Corrigido

- Bug crítico em auto-join loop
- Problema com detecção de página
- Erro na validação de nível mínimo

### 🔒 Segurança

- Correção de vulnerabilidade XSS potencial

## [1.6.4] - 2023-06-15

### 🐛 Corrigido

- Compatibilidade com Firefox 114+
- Problema na leitura de configurações
- Bug na interface de configurações

## [1.6.3] - 2023-05-10

### 🐛 Corrigido

- Crash em páginas específicas do SteamGifts
- Problema com sorteios regionais
- Bug na contagem de entradas

### ✨ Melhorado

- Tratamento de erros mais robusto
- Performance em conexões lentas

## [1.6.2] - 2023-04-05

### 🐛 Corrigido

- Problemas após update do SteamGifts
- Bug na detecção de whitelist
- Erro na interface mobile

## [1.6.1] - 2023-03-12

### 🐛 Corrigido

- Memory leak em sessões longas
- Problema com caracteres Unicode
- Bug visual no modo escuro

### ✨ Melhorado

- Estabilidade geral da extensão
- Compatibilidade com atualizações do site

## [1.6.0] - 2023-02-20

### 🚀 Adicionado

- Sistema de whitelist/blacklist avançado
- Filtros personalizáveis por regex
- Backup automático de configurações
- Modo debug para desenvolvedores

### ✨ Melhorado

- Interface de usuário modernizada
- Sistema de filtragem mais flexível
- Performance geral otimizada

### 🔧 Alterado

- Estrutura interna de dados
- Algoritmos de matching

---

## 📊 Estatísticas de Versão

| Versão | Data | Tipo | Mudanças |
|--------|------|------|----------|
| 2.0.1 | 2024-12-17 | Patch | Bug fixes, security |
| 2.0.0 | 2024-10-15 | Major | Manifest V3, breaking changes |
| 1.9.x | 2024-08-20 | Minor | Features, improvements |
| 1.8.x | 2024-04-18 | Minor | Stability, performance |
| 1.7.x | 2023-11-25 | Minor | UI/UX redesign |
| 1.6.x | 2023-06-15 | Minor | Core features |

---

## 🔗 Links Úteis

- **Releases**: [GitHub Releases](https://github.com/bernardopg/AutoJoin-for-SteamGifts/releases)
- **Issues**: [Report Bugs](https://github.com/bernardopg/AutoJoin-for-SteamGifts/issues/new/choose)
- **Discussões**: [GitHub Discussions](https://github.com/bernardopg/AutoJoin-for-SteamGifts/discussions)

---

## 📝 Notas de Versão

### Convenções de Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (2.0.0): Mudanças incompatíveis na API
- **MINOR** (1.9.0): Nova funcionalidade mantendo compatibilidade
- **PATCH** (1.8.1): Correções de bugs mantendo compatibilidade

### Tipos de Mudanças

- **🚀 Adicionado**: Novas funcionalidades
- **✨ Melhorado**: Melhorias em funcionalidades existentes
- **🔧 Alterado**: Mudanças em funcionalidades existentes
- **🐛 Corrigido**: Correções de bugs
- **🗑️ Removido**: Funcionalidades removidas
- **🔒 Segurança**: Correções e melhorias de segurança

---

<div align="center">

**📝 Mantenha-se atualizado com as mudanças! 🔄**

Para mais detalhes sobre cada versão, visite nossa página de [releases](https://github.com/bernardopg/AutoJoin-for-SteamGifts/releases).

</div>
