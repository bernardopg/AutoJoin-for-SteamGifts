(() => {
  const TRANSLATIONS = Object.freeze({
    en: {
      'common.language': 'Language',
      'common.auto': 'Automatic (browser)',
      'common.english': 'English',
      'common.portugueseBrazil': 'Portuguese (Brazil)',
      'settings.title': 'AutoJoin Settings',
      'settings.subtitle':
        'Configure the AutoJoin extension to match your preferences',
      'settings.close': 'Close settings',
      'settings.tabs.categories': 'Settings categories',
      'settings.tabs.general': 'General',
      'settings.tabs.background': 'Background',
      'settings.tabs.filters': 'Filters',
      'settings.sections.display': 'Display Options',
      'settings.sections.comments': 'Comments',
      'settings.sections.autojoinFeatures': 'AutoJoin Features',
      'settings.sections.autojoinPriority': 'Prioritize giveaways by:',
      'settings.sections.autojoinIgnore': 'Ignore giveaways by:',
      'settings.sections.autojoinSettings': 'AutoJoin Settings',
      'settings.sections.notifications': 'Notifications & Audio',
      'settings.sections.backgroundAutoJoin': 'Background AutoJoin',
      'settings.sections.backgroundPriority': 'Priority Settings',
      'settings.sections.backgroundIgnore': 'Ignore Settings',
      'settings.sections.backgroundTiming': 'Timing Settings',
      'settings.sections.backgroundCostLevel': 'Cost & Level Settings',
      'settings.sections.filterGiveaways': 'Filter Giveaways',
      'settings.sections.levelFilters': 'Level Filters',
      'settings.sections.costFilters': 'Cost Filters',
      'settings.display.infiniteScroll': 'Enable Infinite Scrolling',
      'settings.display.showPoints': 'Show points and level in top-left corner',
      'settings.display.showButtons': 'Show buttons beside each giveaway',
      'settings.display.autoDescription':
        'Auto-load descriptions of joined giveaways',
      'settings.display.showChance': 'Show approximate odds of winning',
      'settings.display.preciseTime': 'Show precise remaining time',
      'settings.display.nightTheme': 'Enable Night theme',
      'settings.comments.autoComment':
        'Automatically post comment on joined giveaways',
      'settings.comments.placeholder': 'Separate different comments with #',
      'settings.warnings.autojoin':
        'Warning: AutoJoin features are against SteamGifts rules and may result in account suspension',
      'settings.warnings.background':
        'Warning: Background AutoJoin is against SteamGifts rules and may result in account suspension',
      'settings.autojoin.showButton': 'Show AutoJoin button',
      'settings.autojoin.loadBefore.prefix': 'Load',
      'settings.autojoin.loadBefore.suffix': 'pages before Auto-join',
      'settings.autojoin.repeat.prefix': 'AutoJoin every',
      'settings.autojoin.repeat.suffix': 'hours if page is open',
      'settings.autojoin.priority.wishlist': 'Steam wishlist giveaways',
      'settings.autojoin.priority.group': 'Steam group giveaways',
      'settings.autojoin.priority.region': 'Region locked giveaways',
      'settings.autojoin.priority.whitelist': 'SteamGifts whitelist giveaways',
      'settings.autojoin.ignore.featured': 'Featured giveaways',
      'settings.autojoin.ignore.groups': 'Steam group giveaways',
      'settings.autojoin.ignore.whitelist': 'SteamGifts whitelist giveaways',
      'settings.autojoin.minCost': 'Min cost to enter',
      'settings.autojoin.maxCost': 'Max cost to enter',
      'settings.autojoin.delay': 'Delay between requests',
      'settings.notifications.playSound': 'Play sound when won',
      'settings.notifications.volume': 'Volume',
      'settings.notifications.notifyLimit.prefix': 'Notify when I have',
      'settings.notifications.notifyLimit.suffix': '+ points',
      'settings.notifications.autoRedeem': 'Auto-redeem Steam keys',
      'settings.background.enable.prefix': 'Enable AutoJoin in background on:',
      'settings.background.page.all': 'Main page (All)',
      'settings.background.page.wishlist': 'Wishlist',
      'settings.background.page.group': 'Group',
      'settings.background.page.new': 'New',
      'settings.background.page.recommended': 'Recommended',
      'settings.background.priority.none': 'No priority',
      'settings.background.priority.level': 'Higher level giveaways',
      'settings.background.priority.odds': 'Higher odds of winning',
      'settings.background.wishlistFirst':
        'Enter wishlist giveaways first for Main page',
      'settings.background.ignorePreserveWishlist':
        'Ignore preserve points for wishlist on Main page',
      'settings.background.ignoreGroups':
        'Ignore groups giveaways for Main page',
      'settings.background.ignoreFeatured': 'Ignore featured giveaways',
      'settings.background.repeatEvery': 'AutoJoin every',
      'settings.background.pagesToLoad': 'Pages to load',
      'settings.background.delay': 'Delay between requests',
      'settings.background.minLevel': 'Min level',
      'settings.background.minCost': 'Min cost',
      'settings.background.maxCost': 'Max cost',
      'settings.background.preservePoints': 'Preserve points',
      'settings.filters.hideDlc': 'Hide DLC giveaways',
      'settings.filters.hideNonTradingCards': 'Hide non-trading card giveaways',
      'settings.filters.hideGroups': 'Hide Steam group giveaways',
      'settings.filters.hideWhitelist': 'Hide SteamGifts whitelist giveaways',
      'settings.filters.hideEntered': 'Hide joined giveaways',
      'settings.filters.hideLevelsBelow': 'Hide giveaways below level',
      'settings.filters.hideLevelsAbove': 'Hide giveaways above level',
      'settings.filters.hideCostsBelow': 'Hide giveaways below',
      'settings.filters.hideCostsAbove': 'Hide giveaways above',
      'settings.links.chrome': 'Chrome Web Store',
      'settings.links.firefox': 'Firefox Add-ons',
      'settings.links.steamGroup': 'Steam Group',
      'settings.links.github': 'GitHub Page',
      'settings.actions.save': 'Save Settings',
      'settings.actions.cancel': 'Cancel',
      'settings.actions.reset': 'Reset to defaults',
      'settings.actions.saving': 'Saving...',
      'settings.actions.saved': 'Settings Saved!',
      'settings.actions.resetDone':
        'Defaults restored. Review and save when ready.',
      'settings.actions.resetConfirm':
        'Reset all settings to their default values? This will update the form, but only becomes permanent after saving.',
      'settings.status.ready': 'Settings are up to date.',
      'settings.status.unsaved': 'You have unsaved changes.',
      'settings.status.validation':
        'Please review the highlighted fields before saving.',
      'content.settingsButton': 'AutoJoin Settings',
      'content.autoJoin': 'AutoJoin',
      'content.loadingPages': 'Loading Pages...',
      'content.processing': 'Processing...',
      'content.join': 'Join',
      'content.leave': 'Leave',
      'content.needHigherLevel': 'Need a higher level',
      'content.notEnoughPoints': 'Not enough points',
      'content.networkError': 'Network Error',
      'content.goodLuck': 'Good luck!',
      'content.noEntries': 'No entries',
      'content.joinedButton': 'Joined {count}!',
      'content.enteredSummary.none': 'No giveaways entered.',
      'content.enteredSummary.one': 'Entered {count} giveaway.',
      'content.enteredSummary.other': 'Entered {count} giveaways.',
      'content.showDescription': 'Show description',
      'content.hideDescription': 'Hide description',
      'content.winOddsTitle': 'approx. odds of winning',
      'content.suspensionRisk':
        'By using AutoJoin button and AutoJoin in background you risk getting a suspension.',
      'content.readMore': 'Click to read more...',
      'content.notifications.autoJoinFailed': 'AutoJoin failed: {message}',
      'content.notifications.settingsLoadFailed':
        'Failed to load settings. Please refresh the page.',
      'content.notifications.settingsSaveFailed': 'Failed to save settings.',
      'content.notifications.autoJoinSummary.one':
        'Successfully joined {count} giveaway',
      'content.notifications.autoJoinSummary.other':
        'Successfully joined {count} giveaways',
      'content.notifications.noGiveawaysMatched':
        'No giveaways were joined based on your criteria',
      'content.notifications.securityTokenMissing':
        'Security token not found. Please refresh the page.',
      'content.notifications.permissionDenied':
        'Steam Community permission not granted. Owned games and wishlist will remain unavailable.',
      'content.notifications.ownedGamesParseFailed':
        'Could not parse owned games. Is your Steam profile public?',
      'content.notifications.steamLoginRequired':
        'Steam Community returned a sign-in or error page. Sign in to Steam in this browser, allow Steam cookies for extension requests if your browser blocks them, and make sure your game details and wishlist are public.',
      'content.notifications.skipOwnedGames':
        'Missing permission for Steam Community. Skipping owned games fetch.',
      'content.notifications.skipWishlist':
        'Missing permission for Steam Community. Skipping wishlist fetch.',
      'content.permissionBanner.title': 'Steam data unavailable.',
      'content.permissionBanner.body':
        'Grant permission when prompted and ensure your Steam profile game details and wishlist are public.',
      'content.permissionBanner.loginBody':
        'Sign in to Steam in this browser, allow Steam cookies for extension requests if your browser blocks them, and ensure your game details and wishlist are public.',
      'content.permissionBanner.retry': 'Check permission again',
      'content.noDescription': 'No description.',
      'utils.notification.success': 'Success',
      'utils.notification.error': 'Error',
      'utils.notification.warning': 'Warning',
      'utils.notification.info': 'Info',
      'utils.close': 'Close',
      'utils.loading': 'Loading...',
      'utils.time.day.one': 'day',
      'utils.time.day.other': 'days',
      'utils.time.hour.one': 'hour',
      'utils.time.hour.other': 'hours',
      'utils.time.minute.one': 'minute',
      'utils.time.minute.other': 'minutes',
      'utils.time.second.one': 'second',
      'utils.time.second.other': 'seconds',
      'utils.time.zeroSeconds': '0 seconds',
      'utils.time.ended': 'Ended',
      'page.nav.pin': 'Pin navigation bar',
      'page.nav.unpin': 'Unpin navigation bar',
      'page.infinite.end': 'End of giveaways',
      'page.infinite.loadMoreError': 'Error loading more giveaways',
      'page.infinite.loadingMore': 'Loading more giveaways...',
      'page.infinite.page': 'Page {page}',
      'page.theme.dark': 'Dark theme enabled',
      'page.theme.light': 'Light theme enabled',
      'page.aria.joinGiveaway': 'Join giveaway: {label}',
      'page.aria.leaveGiveaway': 'Leave giveaway: {label}',
      'page.aria.viewGiveaway': 'View giveaway: {name}',
      'page.aria.viewGiveawayFallback': 'Game',
      'page.aria.viewSteamStore': 'View on Steam Store',
      'page.skip.content': 'Skip to main content',
      'page.skip.settings': 'Skip to settings',
      'suspensionNotice.ariaLabel':
        'Suspension warning. Press Escape or click X to dismiss.',
      'suspensionNotice.title': 'Suspension Warning Options',
      'suspensionNotice.description':
        'How would you like to handle this warning?',
      'suspensionNotice.option.permanent': 'Hide permanently',
      'suspensionNotice.option.minimize': 'Minimize',
      'suspensionNotice.option.session': 'Hide for this session',
      'suspensionNotice.option.cancel': 'Cancel',
      'background.title': 'AutoJoin',
      'background.winFallbackName': 'a game',
      'background.notifications.win':
        'You won {name}! Click here to open SteamGifts.com',
      'background.notifications.points':
        'You have {points} points on SteamGifts.com. Time to spend!',
      'background.notifications.guidelinesTitle':
        'SteamGifts Guidelines Update',
      'background.notifications.guidelinesBody':
        'Your settings were changed. Click here to read more...',
      'background.keyRedeem.success':
        'Steam code for {games} was redeemed successfully!',
      'background.keyRedeem.failureWithGame':
        'Steam code: {key} for {games} was not redeemed!\nError: {reason}',
      'background.keyRedeem.failure':
        'Steam code: {key} was not redeemed!\nError: {reason}',
      'background.keyRedeem.unknown':
        'Steam code: {key} was not redeemed!\nUnknown error.',
      'offscreen.notify.invalidFormat':
        'Invalid format!\nCode: {key} was not redeemed!',
      'offscreen.notify.manualRedeem':
        'Could not redeem code automatically. Please redeem manually: {key}',
      'offscreen.notify.httpError':
        'Redeem failed (HTTP {status}). Code: {key}',
      'offscreen.notify.redeemed': 'Code redeemed! {key}',
      'offscreen.notify.unsuccessful':
        'Redeem unsuccessful ({reason}). Code: {key}',
      'offscreen.notify.unexpected': 'Unexpected error while redeeming a key.',
      'offscreen.unknownReason': 'Unknown',
      'validation.commentTooLong': 'Comment text cannot exceed 1000 characters',
      'validation.rangeError': '{name} must be between {min} and {max}',
      'validation.levelRange':
        'Hide levels below cannot be greater than hide levels above',
      'validation.costRange':
        'Hide costs below cannot be greater than hide costs above',
      'validation.minCostRange':
        'Minimum cost cannot be greater than maximum cost',
      'validation.backgroundMinCostRange':
        'Background minimum cost cannot be greater than background maximum cost',
      'validation.fixErrors': 'Please fix the following errors:\n• {errors}',
      'validation.fields.repeatHours': 'Repeat hours',
      'validation.fields.backgroundRepeatHours': 'Background repeat hours',
      'validation.fields.pagesToLoad': 'Pages to load',
      'validation.fields.backgroundPagesToLoad': 'Background pages to load',
      'validation.fields.delay': 'Delay',
      'validation.fields.backgroundDelay': 'Background delay',
      'validation.fields.minimumCost': 'Minimum cost',
      'validation.fields.backgroundMinimumCost': 'Background minimum cost',
      'validation.fields.maximumCost': 'Maximum cost',
      'validation.fields.backgroundMaximumCost': 'Background maximum cost',
      'validation.fields.pointsToPreserve': 'Points to preserve',
      'validation.fields.notificationLimit': 'Notification limit',
      'validation.fields.hideLevelsBelow': 'Hide levels below',
      'validation.fields.hideLevelsAbove': 'Hide levels above',
      'validation.fields.hideCostsBelow': 'Hide costs below',
      'validation.fields.hideCostsAbove': 'Hide costs above',
      'validation.fields.backgroundMinimumLevel': 'Background minimum level',
    },
    'pt-BR': {
      'common.language': 'Idioma',
      'common.auto': 'Automático (navegador)',
      'common.english': 'Inglês',
      'common.portugueseBrazil': 'Português (Brasil)',
      'settings.title': 'Configurações do AutoJoin',
      'settings.subtitle':
        'Configure a extensão AutoJoin de acordo com suas preferências',
      'settings.close': 'Fechar configurações',
      'settings.tabs.categories': 'Categorias de configurações',
      'settings.tabs.general': 'Geral',
      'settings.tabs.background': 'Background',
      'settings.tabs.filters': 'Filtros',
      'settings.sections.display': 'Opções de exibição',
      'settings.sections.comments': 'Comentários',
      'settings.sections.autojoinFeatures': 'Recursos do AutoJoin',
      'settings.sections.autojoinPriority': 'Priorizar sorteios por:',
      'settings.sections.autojoinIgnore': 'Ignorar sorteios por:',
      'settings.sections.autojoinSettings': 'Configurações do AutoJoin',
      'settings.sections.notifications': 'Notificações e áudio',
      'settings.sections.backgroundAutoJoin': 'AutoJoin em background',
      'settings.sections.backgroundPriority': 'Configurações de prioridade',
      'settings.sections.backgroundIgnore': 'Configurações de ignorar',
      'settings.sections.backgroundTiming': 'Configurações de tempo',
      'settings.sections.backgroundCostLevel': 'Configurações de custo e nível',
      'settings.sections.filterGiveaways': 'Filtrar sorteios',
      'settings.sections.levelFilters': 'Filtros de nível',
      'settings.sections.costFilters': 'Filtros de custo',
      'settings.display.infiniteScroll': 'Ativar rolagem infinita',
      'settings.display.showPoints':
        'Mostrar pontos e nível no canto superior esquerdo',
      'settings.display.showButtons': 'Mostrar botões ao lado de cada sorteio',
      'settings.display.autoDescription':
        'Carregar automaticamente descrições dos sorteios participados',
      'settings.display.showChance': 'Mostrar chance aproximada de vitória',
      'settings.display.preciseTime': 'Mostrar tempo restante preciso',
      'settings.display.nightTheme': 'Ativar tema noturno',
      'settings.comments.autoComment':
        'Publicar comentário automaticamente nos sorteios em que entrar',
      'settings.comments.placeholder': 'Separe comentários diferentes com #',
      'settings.warnings.autojoin':
        'Aviso: os recursos de AutoJoin violam as regras do SteamGifts e podem resultar em suspensão da conta',
      'settings.warnings.background':
        'Aviso: o AutoJoin em background viola as regras do SteamGifts e pode resultar em suspensão da conta',
      'settings.autojoin.showButton': 'Mostrar botão AutoJoin',
      'settings.autojoin.loadBefore.prefix': 'Carregar',
      'settings.autojoin.loadBefore.suffix': 'páginas antes do AutoJoin',
      'settings.autojoin.repeat.prefix': 'Executar AutoJoin a cada',
      'settings.autojoin.repeat.suffix': 'horas se a página estiver aberta',
      'settings.autojoin.priority.wishlist': 'Sorteios da wishlist da Steam',
      'settings.autojoin.priority.group': 'Sorteios de grupos da Steam',
      'settings.autojoin.priority.region': 'Sorteios com trava regional',
      'settings.autojoin.priority.whitelist':
        'Sorteios da whitelist do SteamGifts',
      'settings.autojoin.ignore.featured': 'Sorteios em destaque',
      'settings.autojoin.ignore.groups': 'Sorteios de grupos da Steam',
      'settings.autojoin.ignore.whitelist':
        'Sorteios da whitelist do SteamGifts',
      'settings.autojoin.minCost': 'Custo mínimo para entrar',
      'settings.autojoin.maxCost': 'Custo máximo para entrar',
      'settings.autojoin.delay': 'Intervalo entre requisições',
      'settings.notifications.playSound': 'Tocar som ao ganhar',
      'settings.notifications.volume': 'Volume',
      'settings.notifications.notifyLimit.prefix': 'Notificar quando eu tiver',
      'settings.notifications.notifyLimit.suffix': '+ pontos',
      'settings.notifications.autoRedeem':
        'Resgatar chaves Steam automaticamente',
      'settings.background.enable.prefix': 'Ativar AutoJoin em background em:',
      'settings.background.page.all': 'Página principal (Todas)',
      'settings.background.page.wishlist': 'Wishlist',
      'settings.background.page.group': 'Grupo',
      'settings.background.page.new': 'Novos',
      'settings.background.page.recommended': 'Recomendados',
      'settings.background.priority.none': 'Sem prioridade',
      'settings.background.priority.level': 'Sorteios de nível mais alto',
      'settings.background.priority.odds': 'Maiores chances de vitória',
      'settings.background.wishlistFirst':
        'Entrar primeiro em sorteios da wishlist na página principal',
      'settings.background.ignorePreserveWishlist':
        'Ignorar preservação de pontos para wishlist na página principal',
      'settings.background.ignoreGroups':
        'Ignorar sorteios de grupos na página principal',
      'settings.background.ignoreFeatured': 'Ignorar sorteios em destaque',
      'settings.background.repeatEvery': 'Executar AutoJoin a cada',
      'settings.background.pagesToLoad': 'Páginas para carregar',
      'settings.background.delay': 'Intervalo entre requisições',
      'settings.background.minLevel': 'Nível mínimo',
      'settings.background.minCost': 'Custo mínimo',
      'settings.background.maxCost': 'Custo máximo',
      'settings.background.preservePoints': 'Preservar pontos',
      'settings.filters.hideDlc': 'Ocultar sorteios de DLC',
      'settings.filters.hideNonTradingCards':
        'Ocultar sorteios sem cartas colecionáveis',
      'settings.filters.hideGroups': 'Ocultar sorteios de grupos da Steam',
      'settings.filters.hideWhitelist':
        'Ocultar sorteios da whitelist do SteamGifts',
      'settings.filters.hideEntered': 'Ocultar sorteios já participados',
      'settings.filters.hideLevelsBelow': 'Ocultar sorteios abaixo do nível',
      'settings.filters.hideLevelsAbove': 'Ocultar sorteios acima do nível',
      'settings.filters.hideCostsBelow': 'Ocultar sorteios abaixo de',
      'settings.filters.hideCostsAbove': 'Ocultar sorteios acima de',
      'settings.links.chrome': 'Chrome Web Store',
      'settings.links.firefox': 'Complementos do Firefox',
      'settings.links.steamGroup': 'Grupo Steam',
      'settings.links.github': 'Página no GitHub',
      'settings.actions.save': 'Salvar configurações',
      'settings.actions.cancel': 'Cancelar',
      'settings.actions.reset': 'Restaurar padrões',
      'settings.actions.saving': 'Salvando...',
      'settings.actions.saved': 'Configurações salvas!',
      'settings.actions.resetDone':
        'Os padrões foram restaurados. Revise os campos e salve quando estiver pronto.',
      'settings.actions.resetConfirm':
        'Deseja restaurar todas as configurações para os valores padrão? Isso atualiza o formulário agora, mas só fica permanente depois de salvar.',
      'settings.status.ready': 'As configurações estão em dia.',
      'settings.status.unsaved': 'Você tem alterações não salvas.',
      'settings.status.validation':
        'Revise os campos destacados antes de salvar.',
      'content.settingsButton': 'Configurações do AutoJoin',
      'content.autoJoin': 'AutoJoin',
      'content.loadingPages': 'Carregando páginas...',
      'content.processing': 'Processando...',
      'content.join': 'Entrar',
      'content.leave': 'Sair',
      'content.needHigherLevel': 'Nível mais alto necessário',
      'content.notEnoughPoints': 'Pontos insuficientes',
      'content.networkError': 'Erro de rede',
      'content.goodLuck': 'Boa sorte!',
      'content.noEntries': 'Nenhuma entrada',
      'content.joinedButton': '{count} participados!',
      'content.enteredSummary.none': 'Nenhum sorteio participado.',
      'content.enteredSummary.one': '{count} sorteio participado.',
      'content.enteredSummary.other': '{count} sorteios participados.',
      'content.showDescription': 'Mostrar descrição',
      'content.hideDescription': 'Ocultar descrição',
      'content.winOddsTitle': 'chance aproximada de vitória',
      'content.suspensionRisk':
        'Ao usar o botão AutoJoin e o AutoJoin em background você corre o risco de ser suspenso.',
      'content.readMore': 'Clique para ler mais...',
      'content.notifications.autoJoinFailed': 'AutoJoin falhou: {message}',
      'content.notifications.settingsLoadFailed':
        'Falha ao carregar as configurações. Recarregue a página.',
      'content.notifications.settingsSaveFailed':
        'Falha ao salvar as configurações.',
      'content.notifications.autoJoinSummary.one':
        '{count} sorteio participado com sucesso',
      'content.notifications.autoJoinSummary.other':
        '{count} sorteios participados com sucesso',
      'content.notifications.noGiveawaysMatched':
        'Nenhum sorteio foi participado com base nos seus critérios',
      'content.notifications.securityTokenMissing':
        'Token de segurança não encontrado. Recarregue a página.',
      'content.notifications.permissionDenied':
        'A permissão do Steam Community não foi concedida. Jogos da biblioteca e wishlist continuarão indisponíveis.',
      'content.notifications.ownedGamesParseFailed':
        'Não foi possível ler seus jogos. Seu perfil Steam está público?',
      'content.notifications.steamLoginRequired':
        'A Steam Community retornou uma página de login ou erro. Entre na Steam neste navegador, permita cookies da Steam para as requisições da extensão se o navegador as estiver bloqueando, e garanta que os detalhes dos seus jogos e a wishlist estejam públicos.',
      'content.notifications.skipOwnedGames':
        'Permissão do Steam Community ausente. Ignorando busca de jogos da biblioteca.',
      'content.notifications.skipWishlist':
        'Permissão do Steam Community ausente. Ignorando busca da wishlist.',
      'content.permissionBanner.title': 'Dados da Steam indisponíveis.',
      'content.permissionBanner.body':
        'Conceda a permissão quando solicitado e garanta que os detalhes dos jogos e a wishlist do seu perfil Steam estejam públicos.',
      'content.permissionBanner.loginBody':
        'Entre na Steam neste navegador, permita cookies da Steam para as requisições da extensão se o navegador as estiver bloqueando, e garanta que os detalhes dos seus jogos e a wishlist estejam públicos.',
      'content.permissionBanner.retry': 'Verificar permissão novamente',
      'content.noDescription': 'Sem descrição.',
      'utils.notification.success': 'Sucesso',
      'utils.notification.error': 'Erro',
      'utils.notification.warning': 'Aviso',
      'utils.notification.info': 'Informação',
      'utils.close': 'Fechar',
      'utils.loading': 'Carregando...',
      'utils.time.day.one': 'dia',
      'utils.time.day.other': 'dias',
      'utils.time.hour.one': 'hora',
      'utils.time.hour.other': 'horas',
      'utils.time.minute.one': 'minuto',
      'utils.time.minute.other': 'minutos',
      'utils.time.second.one': 'segundo',
      'utils.time.second.other': 'segundos',
      'utils.time.zeroSeconds': '0 segundos',
      'utils.time.ended': 'Encerrado',
      'page.nav.pin': 'Fixar barra de navegação',
      'page.nav.unpin': 'Desfixar barra de navegação',
      'page.infinite.end': 'Fim dos sorteios',
      'page.infinite.loadMoreError': 'Erro ao carregar mais sorteios',
      'page.infinite.loadingMore': 'Carregando mais sorteios...',
      'page.infinite.page': 'Página {page}',
      'page.theme.dark': 'Tema escuro ativado',
      'page.theme.light': 'Tema claro ativado',
      'page.aria.joinGiveaway': 'Participar do sorteio: {label}',
      'page.aria.leaveGiveaway': 'Sair do sorteio: {label}',
      'page.aria.viewGiveaway': 'Ver sorteio: {name}',
      'page.aria.viewGiveawayFallback': 'Jogo',
      'page.aria.viewSteamStore': 'Ver na Steam Store',
      'page.skip.content': 'Pular para o conteúdo principal',
      'page.skip.settings': 'Pular para as configurações',
      'suspensionNotice.ariaLabel':
        'Aviso de suspensão. Pressione Escape ou clique no X para dispensar.',
      'suspensionNotice.title': 'Opções do aviso de suspensão',
      'suspensionNotice.description': 'Como você deseja lidar com este aviso?',
      'suspensionNotice.option.permanent': 'Ocultar permanentemente',
      'suspensionNotice.option.minimize': 'Minimizar',
      'suspensionNotice.option.session': 'Ocultar nesta sessão',
      'suspensionNotice.option.cancel': 'Cancelar',
      'background.title': 'AutoJoin',
      'background.winFallbackName': 'um jogo',
      'background.notifications.win':
        'Você ganhou {name}! Clique aqui para abrir o SteamGifts.com',
      'background.notifications.points':
        'Você tem {points} pontos no SteamGifts.com. Hora de gastar!',
      'background.notifications.guidelinesTitle':
        'Atualização das diretrizes do SteamGifts',
      'background.notifications.guidelinesBody':
        'Suas configurações foram alteradas. Clique aqui para ler mais...',
      'background.keyRedeem.success':
        'O código Steam de {games} foi resgatado com sucesso!',
      'background.keyRedeem.failureWithGame':
        'Código Steam: {key} para {games} não foi resgatado!\nErro: {reason}',
      'background.keyRedeem.failure':
        'Código Steam: {key} não foi resgatado!\nErro: {reason}',
      'background.keyRedeem.unknown':
        'Código Steam: {key} não foi resgatado!\nErro desconhecido.',
      'offscreen.notify.invalidFormat':
        'Formato inválido!\nCódigo: {key} não foi resgatado!',
      'offscreen.notify.manualRedeem':
        'Não foi possível resgatar o código automaticamente. Resgate manualmente: {key}',
      'offscreen.notify.httpError':
        'Falha no resgate (HTTP {status}). Código: {key}',
      'offscreen.notify.redeemed': 'Código resgatado! {key}',
      'offscreen.notify.unsuccessful':
        'Resgate sem sucesso ({reason}). Código: {key}',
      'offscreen.notify.unexpected': 'Erro inesperado ao resgatar uma chave.',
      'offscreen.unknownReason': 'Desconhecido',
      'validation.commentTooLong':
        'O comentário não pode exceder 1000 caracteres',
      'validation.rangeError': '{name} deve estar entre {min} e {max}',
      'validation.levelRange':
        'O nível mínimo oculto não pode ser maior que o nível máximo oculto',
      'validation.costRange':
        'O custo mínimo oculto não pode ser maior que o custo máximo oculto',
      'validation.minCostRange':
        'O custo mínimo não pode ser maior que o custo máximo',
      'validation.backgroundMinCostRange':
        'O custo mínimo em background não pode ser maior que o custo máximo em background',
      'validation.fixErrors': 'Corrija os seguintes erros:\n• {errors}',
      'validation.fields.repeatHours': 'Horas de repetição',
      'validation.fields.backgroundRepeatHours':
        'Horas de repetição em background',
      'validation.fields.pagesToLoad': 'Páginas para carregar',
      'validation.fields.backgroundPagesToLoad':
        'Páginas em background para carregar',
      'validation.fields.delay': 'Intervalo',
      'validation.fields.backgroundDelay': 'Intervalo em background',
      'validation.fields.minimumCost': 'Custo mínimo',
      'validation.fields.backgroundMinimumCost': 'Custo mínimo em background',
      'validation.fields.maximumCost': 'Custo máximo',
      'validation.fields.backgroundMaximumCost': 'Custo máximo em background',
      'validation.fields.pointsToPreserve': 'Pontos para preservar',
      'validation.fields.notificationLimit': 'Limite de notificação',
      'validation.fields.hideLevelsBelow': 'Ocultar níveis abaixo de',
      'validation.fields.hideLevelsAbove': 'Ocultar níveis acima de',
      'validation.fields.hideCostsBelow': 'Ocultar custos abaixo de',
      'validation.fields.hideCostsAbove': 'Ocultar custos acima de',
      'validation.fields.backgroundMinimumLevel': 'Nível mínimo em background',
    },
  });

  const FALLBACK_LOCALE = 'en';
  const AUTO_LOCALE = 'auto';

  const normalizeLocale = (locale) => {
    if (!locale || locale === AUTO_LOCALE) return AUTO_LOCALE;

    const normalized = String(locale).toLowerCase().replace('_', '-');
    if (normalized === 'pt' || normalized === 'pt-br') {
      return 'pt-BR';
    }

    return FALLBACK_LOCALE;
  };

  const resolveLocale = (locale) => {
    const normalized = normalizeLocale(locale);
    if (normalized !== AUTO_LOCALE) {
      return normalized;
    }

    const browserLocale =
      globalThis.navigator?.language ||
      globalThis.navigator?.languages?.[0] ||
      FALLBACK_LOCALE;

    const resolved = normalizeLocale(browserLocale);
    return resolved === AUTO_LOCALE ? FALLBACK_LOCALE : resolved;
  };

  let currentLocale = resolveLocale(AUTO_LOCALE);

  const getMessageTemplate = (locale, key) =>
    TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS[FALLBACK_LOCALE]?.[key] ?? key;

  function interpolate(template, params = {}) {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return params[key];
      }

      return match;
    });
  }

  const t = (key, params = {}, locale = currentLocale) =>
    interpolate(getMessageTemplate(locale, key), params);

  const apply = (root = document) => {
    if (!root?.querySelectorAll) return;

    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });

    if (root === document) {
      document.documentElement.lang = currentLocale.toLowerCase();
    }
  };

  const setLocale = (locale) => {
    currentLocale = resolveLocale(locale);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = currentLocale.toLowerCase();
    }
    return currentLocale;
  };

  const getLocale = () => currentLocale;
  const listLocales = () => Object.keys(TRANSLATIONS);
  const getCatalog = (locale = currentLocale) => ({
    ...TRANSLATIONS[resolveLocale(locale)],
  });

  const api = {
    AUTO_LOCALE,
    FALLBACK_LOCALE,
    normalizeLocale,
    resolveLocale,
    setLocale,
    getLocale,
    listLocales,
    getCatalog,
    t,
    apply,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalThis.AutoJoinI18n = api;
})();
