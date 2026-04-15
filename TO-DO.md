# TO-DO

> Backlog criado a partir da codebase inspection em 2026-04-15 00:02:25 -03.
> Objetivo: organizar melhorias de UX/UI, lógica, arquitetura, qualidade, upgrades e novas features.

## Como priorizar

- P0 = corrigir agora
- P1 = alto impacto / próximo ciclo
- P2 = melhorias importantes, mas não urgentes
- P3 = nice to have / roadmap futuro

---

## P0 — Correções imediatas e saúde do projeto

### Metadados e documentação fora de sincronia
- [x] Alinhar a versão em `package.json` com `manifest.json`.
- [x] Revisar o `README.md` para remover ou implementar scripts prometidos que hoje não existem (`build`, `package`, `release`, `test:e2e`).
- [x] Revisar a documentação de defaults para refletir os valores reais de `js/core/settings-store.js`.
- [x] Garantir consistência entre README, changelog, manifest e package metadata.

### Dependências e segurança
- [x] Resolver o `npm audit` atual (`flatted`, `brace-expansion`) sem quebrar o fluxo de lint/test.
- [x] Rodar `npm audit fix` em branch separada e validar com `npm run check` e `npm test`.
- [x] Revisar se dependências de dev podem ser atualizadas para versões menos vulneráveis sem aumentar complexidade.

### Estrutura e higiene do repositório
- [x] Decidir se a pasta `scrarper/` deve ser renomeada para `scraper/`.
- [x] Documentar claramente o propósito de `scrarper/steamgifts.html` ou mover esse snapshot para uma área de fixtures/tests.
- [x] Revisar se artefatos pesados de apoio devem continuar versionados na raiz do projeto.

---

## P1 — Arquitetura e lógica

### Refatoração do núcleo de conteúdo
- [ ] Quebrar `js/autoentry.js` em módulos menores por responsabilidade.
- [ ] Extrair parsing de giveaway para módulo dedicado.
- [ ] Extrair filtros de elegibilidade e prioridade para módulo testável sem DOM.
- [ ] Extrair ações de entrada/saída (`join/leave`) para camada isolada.
- [ ] Extrair cache e sincronização de dados Steam para módulo próprio.
- [ ] Extrair renderização de botões, badges, odds e banners para funções/componentes menores.

### Refatoração do service worker
- [ ] Quebrar `js/backgroundpage.js` em helpers de tabs, sessão Steam, notificações, áudio e mensageria offscreen.
- [ ] Centralizar timeouts, retries e mensagens de erro do fluxo Steam.
- [ ] Padronizar retorno de funções assíncronas com objetos previsíveis (`success`, `message`, `data`).
- [ ] Revisar pontos de falha silenciosa em fetch, tab injection e offscreen messaging.

### Configuração e estado
- [ ] Criar esquema único para settings com defaults, limites e validações em um só lugar.
- [ ] Garantir que `settings.js`, `settings-store.js` e `README.md` usem a mesma fonte de verdade para nomes e defaults.
- [ ] Revisar nomes ambíguos ou antigos nas chaves de configuração para facilitar manutenção.
- [ ] Separar melhor `chrome.storage.sync` e `chrome.storage.local` por responsabilidade.

### Internacionalização
- [x] Revisar cobertura de traduções para garantir que toda string de UI tenha chave i18n.
- [x] Padronizar locale `pt-BR` vs pasta `_locales/pt_BR` e documentar essa decisão.
- [x] Criar teste para detectar chaves faltando entre idiomas.

---

## P1 — Testes e qualidade

### Cobertura de testes
- [x] Adicionar testes unitários para regras de filtro de giveaway.
- [x] Adicionar testes para cálculo de prioridade e chance.
- [x] Adicionar testes para `settings-store.js`.
- [x] Adicionar testes para helpers de `backgroundpage.js` que não dependam diretamente da API do navegador.
- [x] Adicionar testes para regressões de parsing do SteamGifts usando fixtures.
- [x] Adicionar teste que valide consistência entre manifest e arquivos realmente existentes.

### Testabilidade da arquitetura
- [x] Isolar lógica pura da manipulação de DOM para facilitar testes.
- [ ] Reduzir dependência de `globalThis` em módulos que podem exportar APIs puras.
- [x] Criar fixtures menores e mais focadas para cenários de giveaway, Steam Store e Steam Community.

### Qualidade contínua
- [x] Adicionar verificação de chaves i18n órfãs/faltantes no CI.
- [x] Adicionar verificação para drift entre `package.json`, `manifest.json` e `README.md`.
- [ ] Considerar cobertura mínima de testes no CI para impedir regressão silenciosa.

---

## P1 — UX/UI

### Página de configurações
- [ ] Reduzir densidade visual de `html/settings.html` e `js/settings.js` dividindo em seções/componentes mais reutilizáveis.
- [ ] Criar cabeçalhos e descrições curtas para grupos de configuração mais complexos.
- [ ] Adicionar estados visuais mais claros para “salvando”, “salvo”, “erro” e “valor inválido”.
- [ ] Exibir validações inline perto do campo, além do resumo geral de erros.
- [ ] Reavaliar a ordem das opções para destacar primeiro o que impacta mais o usuário.
- [ ] Criar presets de configuração (casual, wishlist-first, conservador, agressivo/manual assistido).

### Descoberta e onboarding
- [ ] Criar experiência de primeira execução explicando permissões, riscos e principais recursos.
- [ ] Melhorar o banner de indisponibilidade dos dados Steam com instruções mais objetivas e passos numerados.
- [ ] Adicionar tooltips ou ajuda contextual nas configurações mais confusas.
- [ ] Criar seção “Resetar configurações” e “Restaurar padrão com segurança”.

### Feedback em tempo real
- [ ] Mostrar prévia do impacto dos filtros antes de executar autojoin.
- [ ] Exibir resumo mais rico após execução: quantos avaliados, quantos ignorados e por quê.
- [ ] Melhorar feedback para casos de sessão Steam expirada, perfil privado e permissão negada.
- [ ] Padronizar linguagem das mensagens de erro/sucesso entre content script, options e background.

### Acessibilidade
- [ ] Revisar contraste e foco visível nos componentes do tema escuro.
- [ ] Garantir navegação por teclado completa nos fluxos principais da página de settings.
- [ ] Revisar labels/roles/aria-live em banners, notificações e botões dinâmicos.

---

## P2 — Features de produto

### Controle e transparência
- [ ] Adicionar modo “simulação” para mostrar em quais giveaways entraria sem executar de fato.
- [ ] Criar painel/resumo local com histórico recente de execuções e motivos de skip.
- [ ] Adicionar export/import de configurações em JSON.
- [ ] Adicionar página de diagnóstico para permissões, sessão Steam, storage e estado da extensão.

### Filtros e estratégia
- [ ] Permitir presets por contexto (main page, wishlist, background).
- [ ] Criar filtros mais explícitos para região, grupos, whitelist e DLC com explicações visuais.
- [ ] Adicionar ordenação/score configurável com peso por wishlist, nível, odds e custo.
- [ ] Considerar blacklist/whitelist de appids com UI melhor do que texto solto.

### Experiência no SteamGifts
- [ ] Melhorar cards/indicadores visuais de giveaways já analisados.
- [ ] Adicionar ações rápidas mais consistentes ao lado de cada giveaway.
- [ ] Exibir informações extras úteis sem poluir a interface (wishlist, owned, cards, grupo, região).
- [ ] Permitir esconder ou recolher elementos acessórios para usuários que preferem interface limpa.

---

## P2 — Build, release e manutenção

### Scripts de desenvolvimento
- [ ] Implementar scripts reais para `build`, `package` e `release` ou remover a promessa do README.
- [ ] Criar script local para gerar zip da extensão sem arquivos desnecessários.
- [ ] Padronizar o processo de release usando a versão do manifest como source of truth.

### CI/CD
- [ ] Revisar workflow de release para evitar gerar tag/release se a versão já existir.
- [ ] Adicionar validação de changelog antes de release.
- [ ] Garantir que o pacote publicado não leve arquivos de desenvolvimento desnecessários.

### Compatibilidade
- [ ] Testar explicitamente Chrome/Edge/Brave/Firefox e documentar diferenças reais de comportamento.
- [ ] Revisar compatibilidade do fluxo offscreen/document/runtime contexts entre navegadores.

---

## P3 — Roadmap futuro

### Arquitetura mais moderna
- [ ] Avaliar migração gradual para TypeScript nos módulos core primeiro.
- [ ] Avaliar uso de bundler leve apenas se trouxer ganho real de manutenção/testes.
- [ ] Criar camada de domínio para giveaway/settings/session separada da camada de browser APIs.

### Observabilidade local
- [ ] Criar modo debug com logs estruturados e ativação por configuração.
- [ ] Adicionar painel local de erros recentes para facilitar suporte e debugging.

### UX avançada
- [ ] Criar centro de notificações interno da extensão.
- [ ] Adicionar busca/filtro dentro da própria página de configurações.
- [ ] Adicionar comando de teclado para abrir settings/diagnóstico rapidamente.

---

## Sugestão de ordem de execução

### Sprint 1
- [ ] Alinhar `package.json` vs `manifest.json`
- [ ] Corrigir README/scripts/defaults
- [ ] Resolver `npm audit`
- [ ] Organizar `scrarper/steamgifts.html`

### Sprint 2
- [ ] Extrair módulos de `autoentry.js`
- [ ] Cobrir filtros/prioridade com testes
- [ ] Melhorar banner/diagnóstico de sessão Steam

### Sprint 3
- [ ] Extrair módulos de `backgroundpage.js`
- [ ] Melhorar UX da página de settings
- [ ] Adicionar export/import de configurações

### Sprint 4
- [ ] Implementar build/package/release reais
- [ ] Adicionar modo simulação
- [ ] Criar painel local de histórico/diagnóstico

---

## Critério de sucesso para esta lista

- Menos lógica concentrada em arquivos gigantes
- Documentação confiável e sincronizada com o código
- Fluxos Steam mais previsíveis e fáceis de depurar
- Página de settings mais clara, rápida e amigável
- Mais testes nas áreas críticas
- Processo de release mais simples e reproduzível
