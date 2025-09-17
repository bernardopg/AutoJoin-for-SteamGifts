# 🤖 Guia para Agentes & Assistentes Automatizados

<div align="center">

**Documentação especializada para agentes de IA, bots e automações**
*Specialized documentation for AI agents, bots, and automation*

[![AI Agents](https://img.shields.io/badge/AI-Agents-blue.svg)](#-tipos-de-agentes-suportados)
[![Automation](https://img.shields.io/badge/Automation-Ready-green.svg)](#-tarefas-automatizáveis)
[![Security](https://img.shields.io/badge/Security-First-red.svg)](#-política-de-segurança)

[🇧🇷 Português](#-português-brasil) • [🇺🇸 English](#-english) • [🔧 Quick Start](#-quick-start-para-agentes) • [🚨 Restrições](#-restrições-importantes)

</div>

---

## 🇧🇷 Português (Brasil)

### 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🤖 Tipos de Agentes Suportados](#-tipos-de-agentes-suportados)
- [⚡ Quick Start para Agentes](#-quick-start-para-agentes)
- [🛠️ Tarefas Automatizáveis](#-tarefas-automatizáveis)
- [🔒 Política de Segurança](#-política-de-segurança)
- [📝 Boas Práticas](#-boas-práticas)
- [🚨 Restrições Importantes](#-restrições-importantes)
- [🧪 Testing & Validation](#-testing--validation)
- [🔧 Troubleshooting](#-troubleshooting)

### 🎯 Visão Geral

Este documento fornece diretrizes específicas para **agentes de IA, bots e sistemas de automação** que interagem com o repositório AutoJoin for SteamGifts. O objetivo é permitir colaboração eficiente mantendo segurança e qualidade.

#### 🌟 Filosofia do Projeto

- **🔒 Segurança em Primeiro Lugar**: Nenhuma ação que comprometa a segurança
- **📈 Qualidade Progressiva**: Melhorias incrementais sempre
- **🤝 Colaboração Inteligente**: Agentes como parceiros, não substitutos
- **📚 Transparência Total**: Toda ação deve ser documentada e auditável

### 🤖 Tipos de Agentes Suportados

#### 🧠 **Assistentes de IA (Claude, GPT, etc.)**
- ✅ Análise de código e sugestões de melhoria
- ✅ Geração de documentação
- ✅ Code review automatizado
- ✅ Refatoração de código

#### 🏗️ **CI/CD & Build Automation**
- ✅ GitHub Actions workflows
- ✅ Automated testing
- ✅ Dependency updates
- ✅ Release automation

#### 🔧 **Development Tools**
- ✅ Warp.dev terminal commands
- ✅ VSCode extensions
- ✅ Git hooks
- ✅ Local automation scripts

#### 🌐 **Web Scrapers & APIs**
- ⚠️ Permitido com restrições de rate limiting
- ⚠️ Apenas para dados públicos do SteamGifts
- ❌ Não para dados pessoais de usuários

### ⚡ Quick Start para Agentes

#### 🚀 Checklist Inicial

```bash
# 1. Verificar saúde do projeto
npm run check                 # ESLint + Prettier
npm test                     # Testes unitários

# 2. Analisar estrutura
ls -la                       # Listar arquivos
cat manifest.json           # Verificar configurações da extensão
cat package.json            # Verificar dependências

# 3. Validar mudanças (se aplicável)
git status                   # Status do repositório
git diff                     # Ver alterações
```

#### 📖 Leitura Obrigatória

1. **[README.md](README.md)** - Visão geral do projeto
2. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Diretrizes de contribuição
3. **[SECURITY.md](SECURITY.md)** - Políticas de segurança
4. **[manifest.json](manifest.json)** - Configurações da extensão

### 🛠️ Tarefas Automatizáveis

#### ✅ **Tarefas Permitidas (Baixo Risco)**

| Categoria | Ações | Comandos Úteis |
|-----------|--------|----------------|
| **🔍 Análise** | Leitura de arquivos, estrutura, dependências | `cat`, `ls`, `tree`, `npm audit` |
| **🎨 Formatação** | ESLint, Prettier, organização de imports | `npm run lint`, `npm run format` |
| **🧪 Testes** | Execução de testes existentes | `npm test`, `npm run test:watch` |
| **📚 Documentação** | Atualização de README, comentários, JSDoc | Editor de texto |
| **🔧 Refatoração** | Simplificação de código, otimizações | Editor com validação |

#### ⚠️ **Tarefas com Restrições (Risco Médio)**

| Categoria | Ações | Restrições |
|-----------|--------|------------|
| **📦 Dependências** | Atualização de packages | Apenas patches de segurança |
| **🏗️ Build** | Geração de .zip para distribuição | Sem upload para lojas |
| **🔄 Git Operations** | Commits, branches | Sem force push |
| **⚙️ Configuração** | Alterações em .eslintrc, etc. | Validação humana necessária |

#### ❌ **Tarefas Proibidas (Alto Risco)**

- 🚫 **Modificar permissões** no manifest.json
- 🚫 **Adicionar dependências** não auditadas
- 🚫 **Publicar na Chrome Web Store** ou AMO
- 🚫 **Executar código externo** não verificado
- 🚫 **Modificar lógica de segurança** crítica

### 🔒 Política de Segurança

#### 🛡️ **Princípios de Segurança para Agentes**

1. **🔐 Zero Trust**: Toda ação deve ser validada
2. **📊 Auditabilidade**: Logs detalhados de todas as ações
3. **🔒 Permissões Mínimas**: Apenas o necessário para a tarefa
4. **🚨 Fail Safe**: Em dúvida, peça aprovação humana
5. **🔍 Transparência**: Código aberto, sem ofuscação

#### 🚨 **Red Flags - Solicitar Aprovação Humana**

```bash
# ⛔ PARE! Situações que requerem aprovação:
# 1. Modificação de permissões
grep -r "permissions" manifest.json

# 2. Adição de dependencies
grep -r "dependencies" package.json

# 3. Modificação de security headers
grep -r "content_security_policy" manifest.json

# 4. Alteração de host permissions
grep -r "host_permissions" manifest.json

# 5. Modificação de scripts críticos
ls js/core/
```

### 📝 Boas Práticas

#### 🎯 **Para Agentes de Code Review**

```javascript
// ✅ BOM: Comentários construtivos
/**
 * Sugestão de melhoria de performance:
 * Considere usar debounce para evitar múltiplas chamadas
 */
const debouncedFunction = debounce(originalFunction, 300);

// ✅ BOM: Explicar o "por quê"
// Validação necessária para prevenir XSS
const sanitizedInput = DOMPurify.sanitize(userInput);

// ❌ RUIM: Mudanças sem explicação
// TODO: fix this
const result = someFunction();
```

#### 🔧 **Para Agentes de Automação**

```bash
# ✅ BOM: Validação antes de modificar
if npm run check; then
  echo "✅ Projeto está saudável"
else
  echo "❌ Corrigir problemas antes de prosseguir"
  exit 1
fi

# ✅ BOM: Backup antes de mudanças críticas
cp manifest.json manifest.json.backup
# ... fazer modificações ...
# Validar e restaurar se necessário

# ❌ RUIM: Mudanças sem validação
sed -i 's/old/new/g' *.js  # Muito perigoso!
```

#### 📚 **Para Agentes de Documentação**

```markdown
<!-- ✅ BOM: Documentação clara e útil -->
## Como usar esta funcionalidade

1. **Instale a extensão** seguindo o [guia de instalação](README.md#instalação)
2. **Configure os filtros** nas configurações
3. **Ative o AutoJoin** e aguarde

<!-- ❌ RUIM: Documentação vaga -->
## Uso
Configure e use.
```

### 🚨 Restrições Importantes

#### 🔴 **Restrições Críticas (Nunca fazer)**

1. **🚫 Credenciais Externas**
   ```bash
   # ❌ NUNCA faça isso
   export API_KEY="secret-key"
   curl -H "Authorization: Bearer $API_KEY"
   ```

2. **🚫 Modificação de Permissões**
   ```json
   // ❌ NUNCA modifique sem aprovação
   {
     "permissions": ["tabs", "storage", "NEW_PERMISSION"]
   }
   ```

3. **🚫 Execução de Código Externo**
   ```bash
   # ❌ NUNCA execute scripts externos
   curl https://external.com/script.sh | bash
   ```

#### 🟡 **Restrições Condicionais (Aprovar primeiro)**

1. **⚠️ Dependências Novas**
   ```bash
   # ⚠️ Aprovar antes de instalar
   npm install new-package
   ```

2. **⚠️ Mudanças de Configuração**
   ```bash
   # ⚠️ Validar antes de modificar
   vim .eslintrc.json
   ```

### 🧪 Testing & Validation

#### 🔍 **Validação Automática**

```bash
# 📋 Checklist completo de validação
echo "🔍 Executando validação completa..."

# 1. Lint e formatação
npm run check
if [ $? -ne 0 ]; then
  echo "❌ Falha no lint/format"
  exit 1
fi

# 2. Testes
npm test
if [ $? -ne 0 ]; then
  echo "❌ Falha nos testes"
  exit 1
fi

# 3. Validação do manifest
node -e "
  const manifest = require('./manifest.json');
  console.log('✅ Manifest válido');
  console.log('📦 Nome:', manifest.name);
  console.log('🔢 Versão:', manifest.version);
"

# 4. Verificação de segurança
npm audit --audit-level high
if [ $? -ne 0 ]; then
  echo "⚠️ Vulnerabilidades encontradas"
fi

echo "✅ Validação concluída com sucesso!"
```

#### 🎯 **Testes Específicos para Extensões**

```bash
# Verificar se todos os arquivos necessários existem
required_files=("manifest.json" "js/autoentry.js" "js/backgroundpage.js")
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Arquivo obrigatório não encontrado: $file"
    exit 1
  fi
done

# Validar estrutura CSS
find css/ -name "*.css" -exec cssvalidate {} \; 2>/dev/null || echo "⚠️ CSS validator não disponível"

# Verificar tamanho da extensão (importante para web stores)
zip -r temp-extension.zip . -x "node_modules/*" -x ".git/*"
size=$(stat -f%z temp-extension.zip 2>/dev/null || stat -c%s temp-extension.zip)
echo "📦 Tamanho da extensão: $(($size / 1024))KB"
rm temp-extension.zip

if [ $size -gt 20971520 ]; then  # 20MB limit
  echo "⚠️ Extensão muito grande (>20MB)"
fi
```

### 🔧 Troubleshooting

#### 🚨 **Problemas Comuns e Soluções**

| Problema | Sintoma | Solução |
|----------|---------|---------|
| **ESLint falha** | `npm run lint` retorna erro | `npm run lint -- --fix` |
| **Testes não passam** | `npm test` falha | Verificar logs detalhados |
| **Manifest inválido** | Extensão não carrega | Validar JSON syntax |
| **Permissões negadas** | Funcionalidade não funciona | Verificar host_permissions |
| **Build muito grande** | Arquivo .zip >20MB | Excluir node_modules do zip |

#### 🛠️ **Comandos de Diagnóstico**

```bash
# 🔍 Diagnóstico completo do projeto
echo "🔍 DIAGNÓSTICO DO PROJETO"
echo "========================"

echo "📊 Status do Git:"
git status --porcelain

echo "📦 Informações do Projeto:"
echo "  Nome: $(node -p 'require("./package.json").name')"
echo "  Versão: $(node -p 'require("./package.json").version')"
echo "  Node: $(node --version)"
echo "  NPM: $(npm --version)"

echo "🔧 Dependências:"
npm ls --depth=0 2>/dev/null | head -10

echo "⚡ Saúde dos Scripts:"
npm run check && echo "✅ Scripts OK" || echo "❌ Scripts com problemas"

echo "🔒 Auditoria de Segurança:"
npm audit --audit-level high --json | jq '.vulnerabilities | length' 2>/dev/null || echo "jq não disponível"

echo "📁 Estrutura de Arquivos Críticos:"
ls -la manifest.json package.json README.md 2>/dev/null || echo "Arquivos críticos não encontrados"
```

#### 📞 **Quando Pedir Ajuda**

Solicite intervenção humana quando:

- ⚠️ **Conflitos de merge** que não consegue resolver
- 🚨 **Vulnerabilidades de segurança** detectadas
- 🔒 **Mudanças de permissões** necessárias
- 📦 **Dependências críticas** precisam ser atualizadas
- 🐛 **Bugs complexos** que afetam funcionalidade principal
- 🤔 **Decisões de arquitetura** que impactam o projeto

---

## 🇺🇸 English

### 📋 Table of Contents

- [🎯 Overview](#-overview-en)
- [🤖 Supported Agent Types](#-supported-agent-types-en)
- [⚡ Quick Start for Agents](#-quick-start-for-agents-en)
- [🛠️ Automatable Tasks](#-automatable-tasks-en)
- [🔒 Security Policy](#-security-policy-en)
- [📝 Best Practices](#-best-practices-en)
- [🚨 Important Restrictions](#-important-restrictions-en)
- [🧪 Testing & Validation](#-testing--validation-en)
- [🔧 Troubleshooting](#-troubleshooting-en)

### 🎯 Overview {#-overview-en}

This document provides specific guidelines for **AI agents, bots, and automation systems** that interact with the AutoJoin for SteamGifts repository. The goal is to enable efficient collaboration while maintaining security and quality.

#### 🌟 Project Philosophy

- **🔒 Security First**: No actions that compromise security
- **📈 Progressive Quality**: Always incremental improvements
- **🤝 Smart Collaboration**: Agents as partners, not replacements
- **📚 Total Transparency**: Every action must be documented and auditable

### 🤖 Supported Agent Types {#-supported-agent-types-en}

#### 🧠 **AI Assistants (Claude, GPT, etc.)**
- ✅ Code analysis and improvement suggestions
- ✅ Documentation generation
- ✅ Automated code review
- ✅ Code refactoring

#### 🏗️ **CI/CD & Build Automation**
- ✅ GitHub Actions workflows
- ✅ Automated testing
- ✅ Dependency updates
- ✅ Release automation

#### 🔧 **Development Tools**
- ✅ Warp.dev terminal commands
- ✅ VSCode extensions
- ✅ Git hooks
- ✅ Local automation scripts

#### 🌐 **Web Scrapers & APIs**
- ⚠️ Allowed with rate limiting restrictions
- ⚠️ Only for public SteamGifts data
- ❌ Not for personal user data

### ⚡ Quick Start for Agents {#-quick-start-for-agents-en}

#### 🚀 Initial Checklist

```bash
# 1. Check project health
npm run check                 # ESLint + Prettier
npm test                     # Unit tests

# 2. Analyze structure
ls -la                       # List files
cat manifest.json           # Check extension settings
cat package.json            # Check dependencies

# 3. Validate changes (if applicable)
git status                   # Repository status
git diff                     # See changes
```

#### 📖 Required Reading

1. **[README.md](README.md)** - Project overview
2. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
3. **[SECURITY.md](SECURITY.md)** - Security policies
4. **[manifest.json](manifest.json)** - Extension configuration

### 🔒 Security Policy {#-security-policy-en}

#### 🛡️ **Security Principles for Agents**

1. **🔐 Zero Trust**: Every action must be validated
2. **📊 Auditability**: Detailed logs of all actions
3. **🔒 Minimum Permissions**: Only what's necessary for the task
4. **🚨 Fail Safe**: When in doubt, request human approval
5. **🔍 Transparency**: Open source, no obfuscation

### 📝 Best Practices {#-best-practices-en}

#### 🎯 **For Code Review Agents**

```javascript
// ✅ GOOD: Constructive comments
/**
 * Performance improvement suggestion:
 * Consider using debounce to avoid multiple calls
 */
const debouncedFunction = debounce(originalFunction, 300);

// ✅ GOOD: Explain the "why"
// Validation needed to prevent XSS
const sanitizedInput = DOMPurify.sanitize(userInput);

// ❌ BAD: Changes without explanation
// TODO: fix this
const result = someFunction();
```

### 🚨 Important Restrictions {#-important-restrictions-en}

#### 🔴 **Critical Restrictions (Never do)**

1. **🚫 External Credentials**
   ```bash
   # ❌ NEVER do this
   export API_KEY="secret-key"
   curl -H "Authorization: Bearer $API_KEY"
   ```

2. **🚫 Permission Modifications**
   ```json
   // ❌ NEVER modify without approval
   {
     "permissions": ["tabs", "storage", "NEW_PERMISSION"]
   }
   ```

3. **🚫 External Code Execution**
   ```bash
   # ❌ NEVER execute external scripts
   curl https://external.com/script.sh | bash
   ```

### 🧪 Testing & Validation {#-testing--validation-en}

#### 🔍 **Automated Validation**

```bash
# 📋 Complete validation checklist
echo "🔍 Running complete validation..."

# 1. Lint and formatting
npm run check
if [ $? -ne 0 ]; then
  echo "❌ Lint/format failed"
  exit 1
fi

# 2. Tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# 3. Manifest validation
node -e "
  const manifest = require('./manifest.json');
  console.log('✅ Valid manifest');
  console.log('📦 Name:', manifest.name);
  console.log('🔢 Version:', manifest.version);
"

echo "✅ Validation completed successfully!"
```

### 🔧 Troubleshooting {#-troubleshooting-en}

#### 🚨 **Common Problems and Solutions**

| Problem | Symptom | Solution |
|---------|---------|----------|
| **ESLint fails** | `npm run lint` returns error | `npm run lint -- --fix` |
| **Tests don't pass** | `npm test` fails | Check detailed logs |
| **Invalid manifest** | Extension won't load | Validate JSON syntax |
| **Permissions denied** | Functionality doesn't work | Check host_permissions |
| **Build too large** | .zip file >20MB | Exclude node_modules from zip |

---

## 🚀 Exemplos Práticos | Practical Examples

### 📊 **Análise de Código Automatizada**

```bash
#!/bin/bash
# Script para análise automatizada de código

echo "🔍 ANÁLISE AUTOMATIZADA DE CÓDIGO"
echo "================================="

# Métricas básicas
echo "📊 Métricas do projeto:"
find js/ -name "*.js" | wc -l | xargs echo "  Arquivos JS:"
find css/ -name "*.css" | wc -l | xargs echo "  Arquivos CSS:"
find html/ -name "*.html" | wc -l | xargs echo "  Arquivos HTML:"

# Complexidade
echo "🧮 Análise de complexidade:"
find js/ -name "*.js" -exec wc -l {} + | tail -n 1 | awk '{print "  Linhas de código JS:", $1}'

# Dependências
echo "📦 Dependências:"
npm ls --depth=0 | grep -E "├── |└──" | wc -l | xargs echo "  Pacotes instalados:"

# Problemas potenciais
echo "⚠️  Problemas potenciais:"
grep -r "console.log" js/ --include="*.js" | wc -l | xargs echo "  Console.logs encontrados:"
grep -r "TODO\|FIXME\|HACK" . --include="*.js" --include="*.css" | wc -l | xargs echo "  TODOs/FIXMEs:"

# Segurança
echo "🔒 Verificações de segurança:"
grep -r "innerHTML\|eval\|document.write" js/ --include="*.js" | wc -l | xargs echo "  Possíveis riscos XSS:"

echo "✅ Análise concluída!"
```

### 🛡️ **Validação de Segurança**

```javascript
/**
 * Script de validação de segurança para agentes
 * Verifica práticas de segurança no código
 */

const fs = require('fs');
const path = require('path');

class SecurityValidator {
  constructor() {
    this.issues = [];
  }

  // Validar manifest.json
  validateManifest() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    // Verificar permissões suspeitas
    const suspiciousPerms = ['tabs', 'history', 'bookmarks', 'webNavigation'];
    const currentPerms = manifest.permissions || [];

    suspiciousPerms.forEach(perm => {
      if (currentPerms.includes(perm)) {
        this.issues.push(`⚠️ Permissão suspeita: ${perm}`);
      }
    });

    // Verificar CSP
    const csp = manifest.content_security_policy;
    if (!csp || !csp.extension_pages) {
      this.issues.push('❌ Content Security Policy não definida');
    }

    return this.issues.length === 0;
  }

  // Validar código JavaScript
  validateJavaScript() {
    const jsFiles = this.getJSFiles('js/');

    jsFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');

      // Verificar práticas inseguras
      if (content.includes('eval(')) {
        this.issues.push(`🚨 eval() encontrado em ${file}`);
      }

      if (content.includes('innerHTML') && !content.includes('DOMPurify')) {
        this.issues.push(`⚠️ innerHTML sem sanitização em ${file}`);
      }

      if (content.includes('document.write')) {
        this.issues.push(`🚨 document.write encontrado em ${file}`);
      }
    });

    return this.issues.length === 0;
  }

  getJSFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(this.getJSFiles(fullPath));
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  // Executar todas as validações
  runAll() {
    console.log('🔒 EXECUTANDO VALIDAÇÃO DE SEGURANÇA');
    console.log('====================================');

    this.validateManifest();
    this.validateJavaScript();

    if (this.issues.length === 0) {
      console.log('✅ Nenhum problema de segurança encontrado!');
      return true;
    } else {
      console.log('❌ Problemas encontrados:');
      this.issues.forEach(issue => console.log(`  ${issue}`));
      return false;
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const validator = new SecurityValidator();
  const isSecure = validator.runAll();
  process.exit(isSecure ? 0 : 1);
}

module.exports = SecurityValidator;
```

---

## 📞 Contato & Suporte | Contact & Support

### 🇧🇷 Para Agentes em Português
- **📖 Documentação**: Leia todos os arquivos .md na raiz do projeto
- **🐛 Problemas**: Abra uma issue no GitHub com detalhes da automação
- **💡 Sugestões**: Use o template de feature request
- **🚨 Emergência**: Para problemas críticos de segurança

### 🇺🇸 For English-speaking Agents
- **📖 Documentation**: Read all .md files in project root
- **🐛 Issues**: Open a GitHub issue with automation details
- **💡 Suggestions**: Use the feature request template
- **🚨 Emergency**: For critical security issues

---

<div align="center">

**Agentes bem-vindos, segurança em primeiro lugar! 🤖🔒**
*Agents welcome, security first!*

Cada agente contribui para um projeto mais robusto e seguro.
*Every agent contributes to a more robust and secure project.*

[⬆️ Voltar ao Topo | Back to Top](#-guia-para-agentes--assistentes-automatizados)

</div>
