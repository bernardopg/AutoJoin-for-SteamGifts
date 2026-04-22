# 🎮 AutoJoin for SteamGifts

<div align="center">

[![Version](https://img.shields.io/badge/version-2.0.1-blue.svg)](https://github.com/bernardopg/AutoJoin-for-SteamGifts/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extention-red?logo=chromewebstore&logoColor=red)](https://chrome.google.com/webstore)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox&logoColor=red)](https://addons.mozilla.org/)
[![🚀 CI/CD Pipeline](https://github.com/bernardopg/AutoJoin-for-SteamGifts/actions/workflows/ci.yml/badge.svg)](https://github.com/bernardopg/AutoJoin-for-SteamGifts/actions/workflows/ci.yml)

**Extensão inteligente que automatiza sua participação em sorteios do SteamGifts com segurança, elegância e total controle.**

[🇧🇷 Português](#-português-brasil) • [🇺🇸 English](#-english) • [📦 Instalação](#-instalação-rápida) • [🚀 Recursos](#-recursos-principais) • [📖 Documentação](#-documentação)

</div>

---

## 🇧🇷 Português (Brasil)

<details>
  <summary>📋 Índice</summary>
  
- [🎯 Visão Geral](#-visão-geral)
- [✨ Recursos Principais](#-recursos-principais)
- [📦 Instalação Rápida](#-instalação-rápida)
- [🎮 Como Usar](#-como-usar)
- [⚙️ Configuração Básica](#%EF%B8%8F-configuração-básica)
- [⚙️ Configuração Avançada](#%EF%B8%8F-configuração-avançada)
- [🛠️ Scripts de Desenvolvimento](#-scripts-de-desenvolvimento)
- [🏗️ Arquitetura](#-arquitetura)
- [🔒 Segurança e Privacidade](#-segurança-e-privacidade)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)
  
</details>

### 🎯 Visão Geral

**AutoJoin for SteamGifts** é uma extensão moderna e inteligente para navegadores que revoluciona sua experiência no SteamGifts.com. Desenvolvida com **Manifest V3**, oferece automação segura, interface aprimorada e recursos avançados para maximizar suas chances nos sorteios.

#### 🌟 Por que escolher o AutoJoin?

- **🧠 Inteligência Artificial**: Filtragem inteligente baseada em seus critérios
- **🔒 Segurança Total**: Nenhum dado enviado para terceiros, código 100% transparente
- **🎨 Interface Moderna**: Design responsivo com tema escuro elegante
- **⚡ Performance**: Otimizado com Service Workers e técnicas modernas
- **🔄 Sincronização**: Configurações sincronizadas entre dispositivos
- **🌍 Multilíngue**: Suporte completo em Português e Inglês

### ✨ Recursos Principais

#### 🎮 Automação Inteligente

- **Participação Automática**: Entra nos sorteios seguindo seus filtros personalizados
- **Gestão de Pontos**: Controle inteligente de gastos com pontos
- **Filtros Avançados**: Por nível, grupos, listas de desejos e muito mais
- **Agenda Flexível**: Configure horários específicos para ativação

#### 🎨 Interface Aprimorada

- **Tema Escuro Premium**: Design moderno com alta legibilidade
- **Indicadores Visuais**: Odds em tempo real, status de participação
- **Navegação Intuitiva**: Atalhos e melhorias de usabilidade
- **Acessibilidade**: Compatível com leitores de tela e navegação por teclado

#### 🔧 Recursos Técnicos

- **Manifest V3**: Tecnologia de ponta para máxima segurança
- **Service Worker**: Execução em segundo plano otimizada
- **Offscreen Documents**: Processamento HTML isolado e seguro
- **Chrome Storage API**: Sincronização automática entre dispositivos
- **i18n nativo**: Interface e configurações em Português e Inglês; o locale da app usa `pt-BR` e os arquivos de extensão vivem em `_locales/pt_BR`
- **Steam autenticada**: Biblioteca e wishlist sincronizadas pela sessão real do navegador

#### 🛡️ Segurança e Privacidade

- **Zero Telemetria**: Seus dados permanecem totalmente privados
- **Permissões Mínimas**: Apenas o necessário para funcionamento
- **Código Aberto**: Transparência total, auditável por qualquer pessoa
- **Criptografia Local**: Dados protegidos com APIs nativas do navegador

### 📦 Instalação Rápida

#### 🌐 Instalação via Web Store (Recomendado)

```bash
# Em breve nas lojas oficiais
Chrome Web Store: [Em análise]
Firefox Add-ons: [Em análise]
```

#### 🔧 Instalação Manual (Desenvolvedores)

1. **Clone o repositório**:

```bash
git clone https://github.com/bernardopg/AutoJoin-for-SteamGifts.git
cd AutoJoin-for-SteamGifts
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Valide a base local**:

```bash
npm run verify
```

4. **Carregue no navegador**:

**Chrome/Edge/Brave:**

- Abra `chrome://extensions/`
- Ative o "Modo do desenvolvedor"
- Clique em "Carregar sem compactação"
- Selecione a pasta do projeto
- Aceite as permissões adicionais de `tabs` e `scripting` se o navegador solicitar

**Firefox:**

- Abra `about:debugging`
- Clique em "Este Firefox"
- Clique em "Carregar extensão temporária"
- Selecione o arquivo `manifest.json`

### 🎮 Como Usar

#### 🚀 Primeiros Passos

1. **Instale a extensão** seguindo as instruções acima
2. **Visite o SteamGifts.com** - a interface será automaticamente aprimorada
3. **Configure suas preferências** clicando em "AutoJoin Settings" no menu
4. **Ative o AutoJoin** e deixe a mágica acontecer!

#### ⚙️ Configuração Básica

| Configuração | Descrição | Padrão |
|-------------|-----------|--------|
| **Botão AutoJoin** | Exibe o botão principal da extensão | Desativado |
| **Auto Description** | Abre descrições automaticamente ao entrar | Ativado |
| **Auto Comment** | Publica comentário automático após entrar | Desativado |
| **Pontos preservados** | Reserva mínima antes do AutoJoin | 0 |
| **Repetir na página** | Reexecuta o fluxo na página atual | Desativado |
| **Horas entre repetições** | Intervalo padrão do loop em horas | 5 |
| **Páginas carregadas** | Quantidade padrão de páginas analisadas | 3 |
| **Scroll infinito** | Carrega mais páginas ao rolar | Ativado |
| **Mostrar pontos** | Exibe o indicador flutuante de pontos | Ativado |
| **Mostrar botões** | Exibe botões de entrar/sair nos sorteios | Ativado |
| **Priorizar wishlist** | Dá prioridade a giveaways da wishlist | Ativado |
| **Filtro DLC** | Ignorar conteúdos DLC | Desativado |
| **Ocultar entrados** | Esconde giveaways já participados | Desativado |
| **Tema Escuro** | Interface com tema escuro | Desativado |
| **Som de notificações** | Tocar áudio em alertas de vitória | Ativado |
| **Auto Redeem Key** | Resgata chaves automaticamente | Desativado |

Os defaults completos vivem em [`js/core/settings-store.js`](js/core/settings-store.js).

#### 🎯 Filtros Avançados

**Listas de Prioridade**:

- **Whitelist**: Jogos que você SEMPRE quer
- **Blacklist**: Jogos que você NUNCA quer
- **Lista de Desejos Steam**: Sincronização automática

**Filtros de Grupo**:

- Participe apenas de grupos específicos
- Exclua grupos indesejados
- Configuração flexível por regex

### ⚙️ Configuração Avançada

#### 🔧 Configurações Avançadas

```javascript
// Configurações avançadas (chrome.storage.sync)
const advancedConfig = {
  autoJoinDelay: 2000,        // Delay entre participações (ms)
  maxPointsPerSession: 500,   // Máximo de pontos por sessão
  enableAudioNotifications: true,
  customFilters: {
    minOdds: 0.01,           // Odds mínimas (1%)
    maxEntries: 50000,       // Máximo de participantes
    preferredCategories: ['Action', 'Adventure', 'RPG']
  }
}
```

#### 🎨 Personalização de Tema

```css
/* Variáveis CSS customizáveis */
:root {
  --aj-primary-color: #4A90E2;
  --aj-success-color: #7ED321;
  --aj-warning-color: #F5A623;
  --aj-danger-color: #D0021B;
  --aj-dark-bg: #1a1a1a;
  --aj-card-bg: #2d2d2d;
}
```

### 🛠️ Scripts de Desenvolvimento

```bash
# Instalar dependências
npm install

# Qualidade de código
npm run lint            # ESLint
npm run format          # Prettier (check)
npm run check           # lint + format

# Validações automatizadas
npm run metadata:check  # versão/README/repositório
npm run i18n:check      # paridade de traduções
npm test                # testes unitários
npm run verify          # metadata + i18n + testes

# Build e distribuição
npm run build           # valida e monta build/extension
npm run package         # gera dist/AutoJoin-for-SteamGifts-vX.Y.Z.zip
npm run release         # alias local para package
```

### 🏗️ Arquitetura

#### 📁 Estrutura do Projeto

```
AutoJoin-for-SteamGifts/
├── 📁 js/                    # Scripts JavaScript
│   ├── autoentry.js          # Script principal de conteúdo
│   ├── backgroundpage.js     # Service Worker
│   ├── offscreen.js          # Documento offscreen
│   ├── settings.js           # Interface de configurações
│   ├── 📁 core/             # Módulos principais
│   │   ├── giveaway.js       # Modelo de sorteio
│   │   ├── i18n.js           # Traduções e locale ativo
│   │   ├── page-enhancements.js # Melhorias de UI
│   │   ├── settings-store.js # Gerenciamento de configurações
│   │   ├── steam-community.js # Resolução de steamid em perfis Steam
│   │   └── steam-store.js    # Normalização de dados autenticados da Steam Store
│   └── utils-enhanced.js     # Utilitários
├── 📁 css/                   # Estilos
│   ├── main.css             # Estilos principais
│   ├── night.css            # Tema escuro
│   ├── animations.css       # Animações
│   └── 📁 fontawesome/      # Ícones
├── 📁 html/                  # Páginas HTML
│   ├── settings.html        # Página de configurações
│   └── offscreen.html       # Documento offscreen
├── 📁 media/                 # Recursos de mídia
├── 📁 tests/                 # Testes
├── 📁 docs/                  # Documentação
└── 📁 .github/              # GitHub Actions
```

#### 🔐 Sessão Steam e permissões

- A extensão usa `tabs` e `scripting` para abrir uma aba inativa temporária da Steam Store e ler `dynamicstore/userdata` com a sessão autenticada do navegador.
- Isso reduz falhas de cookies e políticas same-site em `fetch` direto do service worker.
- A permissão opcional de `steamcommunity.com/profiles/*` continua como fallback para perfis públicos.
- Os textos da UI e das configurações ficam centralizados em `js/core/i18n.js`, com suporte inicial para `en` e `pt-BR`.

#### 🔄 Fluxo de Execução

```mermaid
graph TD
    A[SteamGifts Page Load] --> B[Content Script Injection]
    B --> C[DOM Enhancement]
    C --> D[Settings Loaded]
    D --> E{AutoJoin Active?}
    E -->|Yes| F[Scan Giveaways]
    E -->|No| G[UI Enhancements Only]
    F --> H[Apply Filters]
    H --> I[Join Selected Giveaways]
    I --> J[Update UI & Notify]
    J --> K[Schedule Next Run]
```

### 🔒 Segurança e Privacidade

#### 🛡️ Compromisso com a Privacidade

- **❌ Zero Tracking**: Nenhum analytics ou telemetria
- **❌ Sem Terceiros**: Dados nunca saem do seu navegador
- **✅ Código Aberto**: 100% transparente e auditável
- **✅ Permissões Mínimas**: Apenas o essencial para funcionar

#### 🔐 Práticas de Segurança

- **Manifest V3**: Maior segurança e isolamento
- **Content Security Policy**: Proteção contra XSS
- **Validação Rigorosa**: Todos os inputs são validados
- **Criptografia Local**: APIs nativas do navegador

#### 📊 Dados Coletados vs. Armazenados

| Tipo de Dado | Coletado | Armazenado Localmente | Enviado Externamente |
|--------------|----------|---------------------|---------------------|
| Configurações Pessoais | ✅ | ✅ | ❌ |
| Histórico de Sorteios | ✅ | ✅ | ❌ |
| Dados de Navegação | ❌ | ❌ | ❌ |
| Informações Pessoais | ❌ | ❌ | ❌ |
| Telemetria/Analytics | ❌ | ❌ | ❌ |

### 🤝 Contribuindo

Adoramos contribuições da comunidade! Veja como participar:

#### 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado
2. Use nosso [template de issue](.github/ISSUE_TEMPLATE/bug_report.md)
3. Inclua logs e screenshots quando possível

#### 🚀 Sugerindo Recursos

1. Use nosso [template de feature request](.github/ISSUE_TEMPLATE/feature_request.md)
2. Explique o problema que resolve
3. Proponha uma solução detalhada

#### 🔧 Desenvolvendo

1. Faça fork do repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -am 'Adiciona nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

#### 📋 Checklist para PRs

- [ ] Código segue o estilo do projeto (`npm run check`)
- [ ] Testes passam (`npm test`)
- [ ] Documentação atualizada se necessário
- [ ] Commit messages são descritivos
- [ ] PR descreve as mudanças claramente

### 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License - Copyright (c) 2024 bernardopg

Você pode usar, copiar, modificar e distribuir este software livremente,
mantendo os avisos de copyright e esta licença.
```

---

## 🇺🇸 English

### 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [📦 Quick Installation](#-quick-installation)
- [🎮 How to Use](#-how-to-use)
- [⚙️ Advanced Configuration](#-advanced-configuration)
- [🛠️ Development Scripts](#-development-scripts)
- [🏗️ Architecture](#-architecture)
- [🔒 Security & Privacy](#-security--privacy)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

### 🎯 Overview

**AutoJoin for SteamGifts** is a modern and intelligent browser extension that revolutionizes your SteamGifts.com experience. Built with **Manifest V3**, it offers secure automation, enhanced interface, and advanced features to maximize your giveaway success rate.

#### 🌟 Why Choose AutoJoin?

- **🧠 Smart AI**: Intelligent filtering based on your criteria
- **🔒 Total Security**: No data sent to third parties, 100% transparent code
- **🎨 Modern Interface**: Responsive design with elegant dark theme
- **⚡ Performance**: Optimized with Service Workers and modern techniques
- **🔄 Sync**: Settings synchronized across devices
- **🌍 Multilingual**: Full support in Portuguese and English

### ✨ Key Features

#### 🎮 Smart Automation

- **Auto Participation**: Joins giveaways following your custom filters
- **Point Management**: Intelligent spending control
- **Advanced Filters**: By level, groups, wishlists and much more
- **Flexible Schedule**: Configure specific activation times

#### 🎨 Enhanced Interface

- **Premium Dark Theme**: Modern design with high readability
- **Visual Indicators**: Real-time odds, participation status
- **Intuitive Navigation**: Shortcuts and usability improvements
- **Accessibility**: Compatible with screen readers and keyboard navigation

#### 🔧 Technical Features

- **Manifest V3**: Cutting-edge technology for maximum security
- **Service Worker**: Optimized background execution
- **Offscreen Documents**: Isolated and secure HTML processing
- **Chrome Storage API**: Automatic synchronization across devices
- **Built-in i18n**: Interface and settings available in Portuguese and English
- **Authenticated Steam sync**: Owned games and wishlist loaded from the browser's real Steam session

#### 🛡️ Security & Privacy

- **Zero Telemetry**: Your data remains completely private
- **Minimal Permissions**: Only what's necessary for operation
- **Open Source**: Total transparency, auditable by anyone
- **Local Encryption**: Data protected with native browser APIs

### 📦 Quick Installation

#### 🌐 Web Store Installation (Recommended)

```bash
# Coming soon to official stores
Chrome Web Store: [Under Review]
Firefox Add-ons: [Under Review]
```

#### 🔧 Manual Installation (Developers)

1. **Clone the repository**:

```bash
git clone https://github.com/bernardopg/AutoJoin-for-SteamGifts.git
cd AutoJoin-for-SteamGifts
```

2. **Install dependencies**:

```bash
npm install
```

3. **Validate the local workspace**:

```bash
npm run verify
```

4. **Load in browser**:

**Chrome/Edge/Brave:**

- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the project folder
- Accept the additional `tabs` and `scripting` permissions if the browser prompts for them

**Firefox:**

- Open `about:debugging`
- Click "This Firefox"
- Click "Load Temporary Add-on"
- Select the `manifest.json` file

### 🎮 How to Use

#### 🚀 Getting Started

1. **Install the extension** following the instructions above
2. **Visit SteamGifts.com** - the interface will be automatically enhanced
3. **Configure your preferences** by clicking "AutoJoin Settings" in the menu
4. **Activate AutoJoin** and let the magic happen!

#### ⚙️ Basic Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| **AutoJoin Button** | Shows the main extension button | Disabled |
| **Auto Description** | Opens descriptions automatically when joining | Enabled |
| **Auto Comment** | Posts an automatic comment after joining | Disabled |
| **Preserved Points** | Minimum reserve before AutoJoin | 0 |
| **Repeat on Page** | Re-runs the flow on the current page | Disabled |
| **Repeat Interval** | Default loop interval in hours | 5 |
| **Pages to Load** | Default number of pages scanned | 3 |
| **Infinite Scrolling** | Loads more pages while scrolling | Enabled |
| **Show Points** | Shows the floating points badge | Enabled |
| **Show Buttons** | Shows join/leave buttons on giveaways | Enabled |
| **Wishlist Priority** | Prioritizes wishlist giveaways | Enabled |
| **DLC Filter** | Ignore DLC content | Disabled |
| **Hide Entered** | Hides already-entered giveaways | Disabled |
| **Dark Theme** | Dark theme interface | Disabled |
| **Notification Sound** | Play audio for win alerts | Enabled |
| **Auto Redeem Key** | Redeems keys automatically | Disabled |

The full canonical defaults live in [`js/core/settings-store.js`](js/core/settings-store.js).

### 🛠️ Development Scripts

```bash
# Install dependencies
npm install

# Code quality
npm run lint            # ESLint
npm run format          # Prettier (check)
npm run check           # lint + format

# Automated validation
npm run metadata:check  # version/README/repository
npm run i18n:check      # translation parity
npm test                # unit tests
npm run verify          # metadata + i18n + tests

# Build and distribution
npm run build           # validate and stage build/extension
npm run package         # generate dist/AutoJoin-for-SteamGifts-vX.Y.Z.zip
npm run release         # local alias for package
```

### 🔒 Security & Privacy

#### 🛡️ Privacy Commitment

- **❌ Zero Tracking**: No analytics or telemetry
- **❌ No Third Parties**: Data never leaves your browser
- **✅ Open Source**: 100% transparent and auditable
- **✅ Minimal Permissions**: Only essential for operation

#### 🔐 Security Practices

- **Manifest V3**: Enhanced security and isolation
- **Content Security Policy**: XSS protection
- **Rigorous Validation**: All inputs are validated
- **Local Encryption**: Native browser APIs

### 🏗️ Architecture

#### 📁 Main Modules

- `js/autoentry.js`: content-script workflow, giveaway actions, Steam cache usage
- `js/backgroundpage.js`: service worker, messaging and authenticated Steam Store fallback
- `js/core/i18n.js`: translations and locale selection
- `js/core/steam-community.js`: vanity profile to `steamid` resolution
- `js/core/steam-store.js`: normalization of authenticated Steam Store payloads
- `js/offscreen.js`: offscreen parsing, audio playback and key redemption helpers

#### 🔐 Steam Session and Permissions

- The extension uses `tabs` and `scripting` to open a temporary inactive Steam Store tab and read `dynamicstore/userdata` with the browser's authenticated session.
- This reduces common cookie and same-site failures from direct service-worker `fetch` requests.
- The optional `steamcommunity.com/profiles/*` permission remains as a fallback for public profile data.
- UI and settings strings are centralized in `js/core/i18n.js`, with initial support for `en` and `pt-BR`; the app locale stays `pt-BR` while extension message files live under `_locales/pt_BR`.

### 🤝 Contributing

We love community contributions! Here's how to participate:

#### 🐛 Reporting Bugs

1. Check if the bug has already been reported
2. Use our [issue template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Include logs and screenshots when possible

#### 🚀 Suggesting Features

1. Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
2. Explain the problem it solves
3. Propose a detailed solution

### 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📖 Documentação

- [📋 Contributing Guide](CONTRIBUTING.md) - Como contribuir para o projeto
- [🔒 Security Policy](SECURITY.md) - Política de segurança e reporte de vulnerabilidades
- [📘 Project Site](docs/index.md) - Página inicial da documentação do projeto
- [🗺️ Technical Backlog](TO-DO.md) - Roadmap priorizado de melhorias
- [🚀 Warp Development](WARP.md) - Manual específico para warp.dev

## 🏆 Reconhecimentos

- **SteamGifts Community** - Por criar uma plataforma incrível
- **Contributors** - Todos que contribuem para melhorar o projeto
- **Users** - Por usar, testar e dar feedback valioso

## 📊 Estatísticas

![GitHub stars](https://img.shields.io/github/stars/bernardopg/AutoJoin-for-SteamGifts?style=social)
![GitHub forks](https://img.shields.io/github/forks/bernardopg/AutoJoin-for-SteamGifts?style=social)
![GitHub issues](https://img.shields.io/github/issues/bernardopg/AutoJoin-for-SteamGifts)
![GitHub last commit](https://img.shields.io/github/last-commit/bernardopg/AutoJoin-for-SteamGifts)

---

<div align="center">

**Feito com ❤️ para a comunidade SteamGifts**

[⬆️ Voltar ao Topo](#-autojoin-for-steamgifts)

</div>
