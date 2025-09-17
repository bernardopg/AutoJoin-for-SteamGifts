# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚀 Adicionado
- Documentação completa do projeto reformulada
- GitHub Actions CI/CD pipeline
- Templates para issues e pull requests
- Política de segurança abrangente
- Guias para agentes automatizados e Warp.dev

### ✨ Melhorado
- README.md com design moderno e informações completas
- Estrutura de arquivos mais organizada
- Licença atualizada para MIT

### 🔧 Alterado
- Migração de GPL v2 para MIT License
- .gitignore expandido e organizado

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
