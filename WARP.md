# ⚡ Guia Warp.dev | Cloud Development Guide

<div align="center">

**Documentação especializada para desenvolvimento no Warp.dev**
*Specialized documentation for Warp.dev development*

[![Warp](https://img.shields.io/badge/Warp-Terminal-purple.svg)](https://www.warp.dev/)
[![Cloud Dev](https://img.shields.io/badge/Cloud-Development-blue.svg)](#-quick-start-warpdev)

[🇧🇷 Português](#-português-brasil) • [🇺🇸 English](#-english)

</div>

---

## 🇧🇷 Português (Brasil)

### ⚡ Quick Start Warp.dev

#### 🚀 Configuração Inicial
```bash
# 1. Instalar dependências
npm install

# 2. Verificar saúde do projeto
npm run check

# 3. Executar testes
npm test
```

#### 🔄 Workflows Recomendados

**Workflow de Desenvolvimento:**
```bash
# Criar um workflow no Warp
npm run lint -- --fix && npm test && echo "✅ Pronto para commit"
```

**Workflow de Build:**
```bash
# Gerar build para teste
zip -r "AutoJoin_$(date +%Y%m%d).zip" . -x "node_modules/*" -x ".git/*" -x "*.md"
```

#### 🛠️ Comandos Essenciais

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `npm run check` | Lint + Format | Antes de commits |
| `npm test` | Executar testes | Validação |
| `npm run lint -- --fix` | Corrigir lint | Auto-fix |

### 🔒 Segurança no Warp

#### ✅ Permitido
- Executar scripts npm locais
- Análise de código e estrutura
- Testes automatizados
- Build local da extensão

#### ❌ Restrito
- Não armazenar credenciais no Warp
- Não executar scripts externos não verificados
- Não modificar permissões da extensão
- Não publicar builds automaticamente

### 🎯 Dicas Warp.dev

#### 📋 Usar Output Blocks
```bash
# Salvar logs importantes em blocos
npm run check 2>&1 | tee check_results.log
```

#### 🤖 AI Commands
- Use `#` para comandos AI contextuais
- Configure aliases para comandos frequentes
- Use workflows para sequências complexas

---

## 🇺🇸 English

### ⚡ Quick Start Warp.dev

#### 🚀 Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Check project health
npm run check

# 3. Run tests
npm test
```

#### 🔄 Recommended Workflows

**Development Workflow:**
```bash
# Create a Warp workflow
npm run lint -- --fix && npm test && echo "✅ Ready to commit"
```

**Build Workflow:**
```bash
# Generate test build
zip -r "AutoJoin_$(date +%Y%m%d).zip" . -x "node_modules/*" -x ".git/*" -x "*.md"
```

#### 🛠️ Essential Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run check` | Lint + Format | Before commits |
| `npm test` | Run tests | Validation |
| `npm run lint -- --fix` | Fix linting | Auto-fix |

### 🔒 Security in Warp

#### ✅ Allowed
- Run local npm scripts
- Code analysis and structure review
- Automated testing
- Local extension builds

#### ❌ Restricted
- Don't store credentials in Warp
- Don't execute unverified external scripts
- Don't modify extension permissions
- Don't auto-publish builds

### 🎯 Warp.dev Tips

#### 📋 Use Output Blocks
```bash
# Save important logs in blocks
npm run check 2>&1 | tee check_results.log
```

#### 🤖 AI Commands
- Use `#` for contextual AI commands
- Set up aliases for frequent commands
- Use workflows for complex sequences

---

## 🔧 Configuração Avançada | Advanced Configuration

### 📝 Warp Settings

```json
{
  "terminal": {
    "shell": "/bin/zsh",
    "theme": "dark",
    "font_size": 14
  },
  "workflows": {
    "autojoin_check": "npm run check",
    "autojoin_test": "npm test",
    "autojoin_build": "zip -r AutoJoin.zip . -x node_modules/*"
  }
}
```

### 🚀 Aliases Úteis | Useful Aliases

```bash
# Adicionar ao ~/.zshrc ou ~/.bashrc
alias ajcheck="npm run check"
alias ajtest="npm test"
alias ajbuild="zip -r AutoJoin_$(date +%Y%m%d).zip . -x 'node_modules/*' -x '.git/*'"
alias ajlint="npm run lint -- --fix"
```

---

## 📞 Suporte | Support

### 🇧🇷 Português
- **📖 Documentação completa**: [README.md](README.md)
- **🤝 Contribuir**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **🔒 Segurança**: [SECURITY.md](SECURITY.md)

### 🇺🇸 English
- **📖 Full documentation**: [README.md](README.md)
- **🤝 Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **🔒 Security**: [SECURITY.md](SECURITY.md)

---

<div align="center">

**Desenvolvimento eficiente com Warp.dev! ⚡🚀**
*Efficient development with Warp.dev!*

[⬆️ Voltar ao Topo | Back to Top](#-guia-warpdev--cloud-development-guide)

</div>
