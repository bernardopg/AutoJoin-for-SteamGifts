# 🤝 Guia de Contribuição | Contributing Guide

<div align="center">

**Bem-vindo(a) à comunidade AutoJoin for SteamGifts!**
*Welcome to the AutoJoin for SteamGifts community!*

[![Contributors](https://img.shields.io/github/contributors/bernardopg/AutoJoin-for-SteamGifts)](https://github.com/bernardopg/AutoJoin-for-SteamGifts/graphs/contributors)
[![Pull Requests](https://img.shields.io/github/issues-pr/bernardopg/AutoJoin-for-SteamGifts)](https://github.com/bernardopg/AutoJoin-for-SteamGifts/pulls)
[![Issues](https://img.shields.io/github/issues/bernardopg/AutoJoin-for-SteamGifts)](https://github.com/bernardopg/AutoJoin-for-SteamGifts/issues)

</div>

---

## 🇧🇷 Português (Brasil)

### 📋 Índice

- [🎯 Como Contribuir](#-como-contribuir)
- [🐛 Reportando Bugs](#-reportando-bugs)
- [💡 Sugerindo Melhorias](#-sugerindo-melhorias)
- [🔧 Desenvolvimento Local](#-desenvolvimento-local)
- [📝 Padrões de Código](#-padrões-de-código)
- [🌿 Estratégia de Branches](#-estratégia-de-branches)
- [📨 Pull Requests](#-pull-requests)
- [🏷️ Versionamento](#-versionamento)
- [🎨 Estilo de Commits](#-estilo-de-commits)
- [🧪 Testes](#-testes)
- [📚 Documentação](#-documentação)
- [🎉 Reconhecimento](#-reconhecimento)

### 🎯 Como Contribuir

Existem várias maneiras de contribuir para o AutoJoin for SteamGifts:

#### 🐛 **Reportar Bugs**
- Encontrou um problema? Relate-o usando nossos templates
- Inclua informações detalhadas para facilitar a correção

#### 💡 **Sugerir Melhorias**
- Tem uma ideia legal? Compartilhe conosco!
- Use nossos templates para estruturar a sugestão

#### 🔧 **Contribuir com Código**
- Correções de bugs, novos recursos, melhorias de performance
- Siga nossos padrões e diretrizes de desenvolvimento

#### 📝 **Melhorar Documentação**
- Documentação clara é essencial para o projeto
- Corrija typos, adicione exemplos, melhore explicações

#### 🌐 **Traduções**
- Ajude a tornar o projeto acessível globalmente
- Português e Inglês são nossas linguagens principais

### 🐛 Reportando Bugs

Antes de reportar um bug:

1. **Verifique issues existentes** - O bug já foi reportado?
2. **Use a versão mais recente** - O problema ainda existe?
3. **Reproduza o bug** - Consegue replicar consistentemente?

#### 📋 Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Comportamento Atual**
O que realmente está acontecendo.

**Screenshots**
Se aplicável, adicione screenshots.

**Informações do Ambiente:**
 - OS: [ex: Windows 11]
 - Navegador: [ex: Chrome 120]
 - Versão da Extensão: [ex: 2.0.1]

**Contexto Adicional**
Qualquer informação adicional relevante.
```

### 💡 Sugerindo Melhorias

Sugestões são sempre bem-vindas! Para propor uma melhoria:

1. **Verifique se já existe** - Procure em issues abertas
2. **Seja específico** - Explique claramente o problema e solução
3. **Considere o escopo** - A sugestão se alinha com os objetivos do projeto?

#### 📋 Template de Feature Request

```markdown
**Problema/Necessidade**
Qual problema esta feature resolve?

**Solução Proposta**
Descrição clara da solução desejada.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Impacto**
Como isso beneficiaria os usuários?

**Implementação**
Ideias de como implementar (opcional).
```

### 🔧 Desenvolvimento Local

#### 📦 Configuração Inicial

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU_USERNAME/AutoJoin-for-SteamGifts.git
cd AutoJoin-for-SteamGifts

# 2. Instale dependências
npm install

# 3. Configure git remotes
git remote add upstream https://github.com/bernardopg/AutoJoin-for-SteamGifts.git

# 4. Verifique se tudo está funcionando
npm run check
npm test
```

#### 🛠️ Scripts de Desenvolvimento

```bash
# Linting e formatação
npm run lint          # ESLint
npm run format        # Prettier
npm run check         # Lint + Format

# Testes
npm test              # Testes unitários
npm run test:watch    # Testes em modo watch

# Utilidades
npm run dev           # Modo desenvolvimento
npm run build         # Build para produção
npm run package       # Criar .zip para distribuição
```

### 📝 Padrões de Código

#### 🎯 Princípios Gerais

- **Legibilidade** - Código deve ser claro e autodocumentado
- **Consistência** - Siga padrões existentes no projeto
- **Simplicidade** - Prefira soluções simples e diretas
- **Performance** - Considere impacto de performance, especialmente em content scripts
- **Segurança** - Valide inputs, evite vulnerabilidades

#### 📏 Estilo de Código

**JavaScript:**
```javascript
// ✅ Bom
const processGiveaways = async (giveaways) => {
  const validGiveaways = giveaways.filter(g => g.isValid());
  return await Promise.all(validGiveaways.map(joinGiveaway));
};

// ❌ Ruim
function processGiveaways(giveaways){
var valid=giveaways.filter(function(g){return g.isValid()})
return Promise.all(valid.map(joinGiveaway))
}
```

**CSS:**
```css
/* ✅ Bom - BEM methodology */
.autojoin-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
}

.autojoin-button--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.autojoin-button__icon {
  margin-right: 8px;
}
```

#### 📚 Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Variáveis/Funções** | camelCase | `userSettings`, `joinGiveaway()` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_ENDPOINTS` |
| **Classes CSS** | kebab-case + BEM | `autojoin-card`, `autojoin-card__title` |
| **Arquivos** | kebab-case | `page-enhancements.js`, `settings-store.js` |
| **Branches** | feature/fix/docs + kebab-case | `feature/auto-join-scheduler` |

### 🌿 Estratégia de Branches

Usamos uma estratégia baseada em **Git Flow simplificado**:

#### 🌳 Branches Principais

- **`main`** - Código de produção, sempre estável
- **`develop`** - Branch de desenvolvimento, integração de features

#### 🌱 Branches de Trabalho

- **`feature/nome-da-feature`** - Novas funcionalidades
- **`fix/nome-do-fix`** - Correções de bugs
- **`docs/nome-da-doc`** - Melhorias de documentação
- **`refactor/nome-do-refactor`** - Refatorações de código

#### 🔄 Fluxo de Trabalho

```bash
# 1. Sincronize com upstream
git checkout develop
git pull upstream develop

# 2. Crie branch para sua feature
git checkout -b feature/minha-nova-feature

# 3. Desenvolva e commit
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 4. Push para seu fork
git push origin feature/minha-nova-feature

# 5. Abra Pull Request no GitHub
```

### 📨 Pull Requests

#### ✅ Checklist Pré-PR

Antes de abrir um PR, verifique:

- [ ] **Código** - Funciona conforme esperado
- [ ] **Testes** - `npm test` passa
- [ ] **Lint** - `npm run check` sem erros
- [ ] **Documentação** - Atualizada se necessário
- [ ] **Branch** - Baseada em `develop`
- [ ] **Commits** - Seguem padrão do projeto
- [ ] **Descrição** - PR bem documentado

#### 📝 Template de Pull Request

```markdown
## 📋 Descrição

Breve descrição das mudanças realizadas.

## 🔗 Issue Relacionada

Fixes #123

## 🧪 Como Testar

1. Passo 1
2. Passo 2
3. Verificar resultado

## 📸 Screenshots

[Se aplicável]

## ✅ Checklist

- [ ] Testes passam
- [ ] Código lint limpo
- [ ] Documentação atualizada
- [ ] Testado manualmente
- [ ] Segue padrões do projeto

## 📝 Notas Adicionais

Qualquer informação adicional relevante.
```

### 🏷️ Versionamento

Seguimos **Semantic Versioning (SemVer)**:

- **MAJOR** (1.0.0 → 2.0.0) - Mudanças incompatíveis
- **MINOR** (1.0.0 → 1.1.0) - Novas funcionalidades compatíveis
- **PATCH** (1.0.0 → 1.0.1) - Correções de bugs

#### 🏷️ Exemplo de Tags

```bash
# Versões de produção
v2.0.0 - Major release com breaking changes
v2.1.0 - Nova funcionalidade
v2.1.1 - Correção de bug

# Versões pré-produção
v2.2.0-beta.1 - Beta release
v2.2.0-rc.1   - Release candidate
```

### 🎨 Estilo de Commits

Usamos **Conventional Commits** para mensagens padronizadas:

#### 📏 Formato

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

#### 🏷️ Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona filtro por odds` |
| `fix` | Correção de bug | `fix: corrige crash ao carregar configurações` |
| `docs` | Documentação | `docs: atualiza guia de instalação` |
| `style` | Formatação/estilo | `style: formata código com prettier` |
| `refactor` | Refatoração | `refactor: extrai lógica de filtragem` |
| `test` | Testes | `test: adiciona testes para giveaway model` |
| `chore` | Tarefas de manutenção | `chore: atualiza dependências` |
| `perf` | Performance | `perf: otimiza scanning de sorteios` |

#### ✅ Exemplos Bons

```bash
feat: adiciona agendador de auto-join
fix(settings): corrige salvamento de configurações
docs: adiciona exemplos de uso da API
refactor(core): simplifica lógica de filtros
test: adiciona cobertura para utils
```

#### ❌ Exemplos Ruins

```bash
mudancas
fix bug
update docs
WIP
asdfgh
```

### 🧪 Testes

#### 📋 Tipos de Teste

- **Unit Tests** - Testam funções/módulos isoladamente
- **Integration Tests** - Testam interação entre componentes
- **E2E Tests** - Testam fluxos completos (planejado)

#### 🏃‍♂️ Executando Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- --grep "giveaway"

# Coverage report
npm run test:coverage

# Modo watch
npm run test:watch
```

#### ✍️ Escrevendo Testes

```javascript
// tests/giveaway.test.js
import { describe, it, expect } from 'node:test';
import { Giveaway } from '../js/core/giveaway.js';

describe('Giveaway', () => {
  it('should calculate odds correctly', () => {
    const giveaway = new Giveaway({
      entries: 1000,
      copies: 1
    });

    expect(giveaway.getOdds()).toBe(0.001);
  });

  it('should filter by minimum level', () => {
    const giveaway = new Giveaway({
      levelRestriction: 5
    });

    expect(giveaway.meetsLevelRequirement(3)).toBe(false);
    expect(giveaway.meetsLevelRequirement(6)).toBe(true);
  });
});
```

### 📚 Documentação

#### 📝 O que Documentar

- **README.md** - Visão geral, instalação, uso básico
- **API docs** - Funções públicas, parâmetros, retornos
- **Code comments** - Lógica complexa, hacks necessários
- **Examples** - Casos de uso comuns

#### 📖 Estilo de Documentação

```javascript
/**
 * Filtra sorteios baseado nas configurações do usuário
 *
 * @param {Array<Giveaway>} giveaways - Lista de sorteios
 * @param {UserSettings} settings - Configurações de filtro
 * @returns {Promise<Array<Giveaway>>} Sorteios válidos
 *
 * @example
 * const validGiveaways = await filterGiveaways(allGiveaways, userSettings);
 */
async function filterGiveaways(giveaways, settings) {
  // Implementação...
}
```

#### 📄 Documentação em Português

Todo código deve ter comentários e documentação em **português brasileiro**:

```javascript
// ✅ Bom
// Calcula as odds de vitória considerando o número de cópias
const calculateWinningOdds = (entries, copies) => {
  // Se não há participantes, odds são 100%
  if (entries === 0) return 1.0;

  // Odds = cópias / total de participantes
  return Math.min(copies / entries, 1.0);
};

// ❌ Ruim (inglês em projeto brasileiro)
// Calculate winning odds considering number of copies
```

### 🎉 Reconhecimento

#### 🏆 Tipos de Contribuição

Reconhecemos todas as formas de contribuição:

- 💻 **Code** - Contribuições de código
- 📖 **Documentation** - Melhorias na documentação
- 🐛 **Bug Reports** - Identificação de problemas
- 💡 **Ideas** - Sugestões e feedback
- 🌐 **Translation** - Traduções
- 🎨 **Design** - UI/UX e recursos visuais
- 📢 **Outreach** - Divulgação do projeto
- 🤔 **Mentoring** - Ajuda a novos contribuidores

#### 🎖️ Hall da Fama

Contribuidores são reconhecidos:

- **README.md** - Seção de contribuidores
- **CONTRIBUTORS.md** - Lista detalhada
- **Release Notes** - Créditos em releases
- **GitHub** - Badges e estatísticas

---

## 🇺🇸 English

### 📋 Table of Contents

- [🎯 How to Contribute](#-how-to-contribute-en)
- [🐛 Reporting Bugs](#-reporting-bugs-en)
- [💡 Suggesting Features](#-suggesting-features-en)
- [🔧 Local Development](#-local-development-en)
- [📝 Code Standards](#-code-standards-en)
- [🌿 Branching Strategy](#-branching-strategy-en)
- [📨 Pull Requests](#-pull-requests-en)
- [🏷️ Versioning](#-versioning-en)
- [🎨 Commit Style](#-commit-style-en)
- [🧪 Testing](#-testing-en)
- [📚 Documentation](#-documentation-en)
- [🎉 Recognition](#-recognition-en)

### 🎯 How to Contribute {#-how-to-contribute-en}

There are several ways to contribute to AutoJoin for SteamGifts:

#### 🐛 **Report Bugs**
- Found an issue? Report it using our templates
- Include detailed information to facilitate fixes

#### 💡 **Suggest Improvements**
- Have a cool idea? Share it with us!
- Use our templates to structure suggestions

#### 🔧 **Contribute Code**
- Bug fixes, new features, performance improvements
- Follow our standards and development guidelines

#### 📝 **Improve Documentation**
- Clear documentation is essential for the project
- Fix typos, add examples, improve explanations

#### 🌐 **Translations**
- Help make the project globally accessible
- Portuguese and English are our primary languages

### 🐛 Reporting Bugs {#-reporting-bugs-en}

Before reporting a bug:

1. **Check existing issues** - Has the bug been reported?
2. **Use latest version** - Does the problem still exist?
3. **Reproduce the bug** - Can you replicate consistently?

#### 📋 Bug Report Template

```markdown
**Bug Description**
Clear and concise description of the problem.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll to '....'
4. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What is actually happening.

**Screenshots**
If applicable, add screenshots.

**Environment Information:**
 - OS: [e.g., Windows 11]
 - Browser: [e.g., Chrome 120]
 - Extension Version: [e.g., 2.0.1]

**Additional Context**
Any other relevant information.
```

### 💡 Suggesting Features {#-suggesting-features-en}

Suggestions are always welcome! To propose an improvement:

1. **Check if it exists** - Search in open issues
2. **Be specific** - Clearly explain the problem and solution
3. **Consider scope** - Does the suggestion align with project goals?

#### 📋 Feature Request Template

```markdown
**Problem/Need**
What problem does this feature solve?

**Proposed Solution**
Clear description of the desired solution.

**Alternatives Considered**
Other solutions you considered.

**Impact**
How would this benefit users?

**Implementation**
Ideas on how to implement (optional).
```

### 🔧 Local Development {#-local-development-en}

#### 📦 Initial Setup

```bash
# 1. Fork and clone repository
git clone https://github.com/YOUR_USERNAME/AutoJoin-for-SteamGifts.git
cd AutoJoin-for-SteamGifts

# 2. Install dependencies
npm install

# 3. Configure git remotes
git remote add upstream https://github.com/bernardopg/AutoJoin-for-SteamGifts.git

# 4. Verify everything works
npm run check
npm test
```

### 🎨 Commit Style {#-commit-style-en}

We use **Conventional Commits** for standardized messages:

#### 📏 Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

#### 🏷️ Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add odds filter` |
| `fix` | Bug fix | `fix: resolve settings loading crash` |
| `docs` | Documentation | `docs: update installation guide` |
| `style` | Formatting/style | `style: format code with prettier` |
| `refactor` | Refactoring | `refactor: extract filter logic` |
| `test` | Tests | `test: add giveaway model tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance | `perf: optimize giveaway scanning` |

### 🧪 Testing {#-testing-en}

#### 📋 Test Types

- **Unit Tests** - Test functions/modules in isolation
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete flows (planned)

#### 🏃‍♂️ Running Tests

```bash
# All tests
npm test

# Specific tests
npm test -- --grep "giveaway"

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### 📚 Documentation {#-documentation-en}

#### 📝 What to Document

- **README.md** - Overview, installation, basic usage
- **API docs** - Public functions, parameters, returns
- **Code comments** - Complex logic, necessary hacks
- **Examples** - Common use cases

### 🎉 Recognition {#-recognition-en}

#### 🏆 Contribution Types

We recognize all forms of contribution:

- 💻 **Code** - Code contributions
- 📖 **Documentation** - Documentation improvements
- 🐛 **Bug Reports** - Problem identification
- 💡 **Ideas** - Suggestions and feedback
- 🌐 **Translation** - Translations
- 🎨 **Design** - UI/UX and visual resources
- 📢 **Outreach** - Project promotion
- 🤔 **Mentoring** - Help new contributors

---

## 📞 Contato | Contact

### 🇧🇷 Português
- **Issues**: [GitHub Issues](https://github.com/bernardopg/AutoJoin-for-SteamGifts/issues)
- **Discussões**: [GitHub Discussions](https://github.com/bernardopg/AutoJoin-for-SteamGifts/discussions)
- **Email**: Para questões sensíveis ou privadas

### 🇺🇸 English
- **Issues**: [GitHub Issues](https://github.com/bernardopg/AutoJoin-for-SteamGifts/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bernardopg/AutoJoin-for-SteamGifts/discussions)
- **Email**: For sensitive or private matters

---

<div align="center">

**Obrigado por contribuir! | Thanks for contributing!** 🙏

Cada contribuição, por menor que seja, faz a diferença.
*Every contribution, no matter how small, makes a difference.*

[⬆️ Voltar ao Topo | Back to Top](#-guia-de-contribuição--contributing-guide)

</div>
