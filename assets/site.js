/* ============================================================================
   Datasulus site chrome — единый источник правды для шапки, мегаменю, футера,
   хлебных крошек, модалок и реестра иконок. Рендерится из JS-моделей на
   каждой странице (работает с file://, без сборки, без fetch).
   Vanilla IIFE. На этапе C маппится в React-компоненты + lucide-react.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 1. Реестр иконок (inline SVG, line-style) ----------------------- */
  var ICONS = {
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron:'<path d="M6 9l6 6 6-6"/>',
    bolt:'<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    check:'<path d="M20 6L9 17l-5-5"/>',
    checkCircle:'<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
    layers:'<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',
    code:'<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    cog:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2"/>',
    shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/>',
    plug:'<path d="M9 7V3M15 7V3M8 7h8v4a4 4 0 01-8 0zM12 15v6"/>',
    database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0016 0V5M4 12a8 3 0 0016 0"/>',
    chartBar:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    chartLine:'<path d="M3 17l5-6 4 3 6-8M3 21h18"/>',
    spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
    pipeline:'<path d="M3 7h6a3 3 0 013 3 3 3 0 003 3h6M21 13l-3-2m3 2l-3 2"/>',
    chat:'<path d="M21 12a8 8 0 01-11.3 7.3L3 21l1.7-6.7A8 8 0 1121 12z"/>',
    table:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M9 4v16"/>',
    cloud:'<path d="M7 18a4 4 0 01-1-7.9A5 5 0 0116 9a3.5 3.5 0 011 6.9"/>',
    refresh:'<path d="M21 12a9 9 0 11-3-6.7M21 4v4h-4"/>',
    filter:'<path d="M3 5h18l-7 8v5l-4 2v-7z"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="M11 13l8-8M17 5l2 2M15 7l2 2"/>',
    users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a6 6 0 0111 0M16 5.5a3 3 0 010 5.8M20.5 20a6 6 0 00-4.5-5.4"/>',
    building:'<path d="M5 21V4h10v17M15 9h4v12M8 8h2M8 12h2M8 16h2"/>',
    cart:'<path d="M3 4h2l2 12h11l2-8H7"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
    cap:'<path d="M2 9l10-4 10 4-10 4zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    bank:'<path d="M3 9l9-5 9 5M4 9h16M5 9v8M9 9v8M15 9v8M19 9v8M3 21h18"/>',
    store:'<path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M4 9h16"/>',
    factory:'<path d="M3 21V10l5 3V10l5 3V8l6 4v9zM7 21v-4M12 21v-4M17 21v-4"/>',
    gov:'<path d="M3 21h18M5 21V10M19 21V10M3 10h18l-9-6zM9 21v-7M15 21v-7"/>',
    health:'<path d="M12 21C7 17 3 13 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 13 17 17 12 21zM9.5 11.5h5M12 9v5"/>',
    book:'<path d="M4 4h7a2 2 0 012 2v14a2 2 0 00-2-2H4zM20 4h-7a2 2 0 00-2 2v14a2 2 0 012-2h7z"/>',
    calendar:'<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M4 9h16M8 3v4M16 3v4"/>',
    pen:'<path d="M14 4l6 6L8 22H2v-6zM12 6l6 6"/>',
    lifebuoy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3"/>',
    chatGroup:'<path d="M4 5h12v8H8l-4 3zM10 13h10v6l-3-2h-7"/>',
    rocket:'<path d="M14 3c4 1 7 4 8 8-3 0-5 1-7 3l-4-4c2-2 3-4 3-7zM7 14l-3 3 3 1 1 3 3-3"/><circle cx="9.5" cy="10.5" r="1.4"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    gauge:'<path d="M4 16a8 8 0 0116 0"/><path d="M12 16l4-4"/><circle cx="12" cy="16" r="1.4"/>',
    coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6a7 3 0 0014 0V6M5 12v4a7 3 0 0014 0v-4"/>',
    pin:'<path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',
    briefcase:'<rect x="3" y="8" width="18" height="12" rx="1.5"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"/>',
    sliders:'<path d="M4 7h8M16 7h4M4 12h2M10 12h10M4 17h12M20 17h0"/><circle cx="14" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="17" r="2"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 11v6"/>',
    x:'<path d="M4 4l16 16M20 4L4 20"/>',
    youtube:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10 9l5 3-5 3z"/>',
    facebook:'<path d="M14 8h2V5h-2a3 3 0 00-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 011-1z"/>',
    rss:'<path d="M5 19a1 1 0 100-2 1 1 0 000 2M5 11a8 8 0 018 8M5 5a14 14 0 0114 14"/>',
    star:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.3 6.8 19l1-5.8L3.5 9.2l5.9-.9z"/>'
  };
  function iconSvg(name, cls) {
    var p = ICONS[name]; if (!p) return '';
    return '<svg viewBox="0 0 24 24" class="' + (cls || 'istroke') + '" aria-hidden="true">' + p + '</svg>';
  }
  function renderIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild) return;
      var svg = iconSvg(el.getAttribute('data-icon'));
      if (svg) { el.classList.add('ico'); el.innerHTML = svg; }
    });
  }

  /* ---- 2. Бренд / wordmark --------------------------------------------- */
  // Datasulus wordmark: 3×3 Amber dot grid слева + "Data Sulus" справа.
  // Inter Bold 700, font-size 30. Размер подогнан так, чтобы tagline
  // «AI Data Lakehouse» помещалась под низ точно по ширине wordmark.
  function brandSvg(light) {
    var fill = light ? '#FFFFFF' : '#0B2545';
    // Dot grid: 3×3, диаметр 5, шаг 7.6 → общий размер ~21×21px.
    var dots = '';
    var step = 7.6;
    for (var iy = 0; iy < 3; iy++) {
      for (var ix = 0; ix < 3; ix++) {
        dots += '<circle cx="' + (ix * step + 2.5) + '" cy="' + (iy * step + 2.5) + '" r="2.5"/>';
      }
    }
    // viewBox 210×36: grid 21 + gap 13 + wordmark ~170 + padding 6
    // Rendered: width=185 height=32 (scale 0.88)
    return '<svg viewBox="0 0 210 36" width="185" height="32" role="img" aria-label="Datasulus">' +
      '<g transform="translate(0, 7)" fill="#FFC53D">' + dots + '</g>' +
      '<text x="34" y="29" font-family="Inter,-apple-system,sans-serif" font-weight="700" font-size="30" letter-spacing="-.9" fill="' + fill + '">Data Sulus</text>' +
    '</svg>';
  }

  /* ---- 3. Модель навигации (мегаменю) ---------------------------------- */
  // d:demo  s:stub  (иначе обычный href). Каждый href резолвится: страница / якорь / demo / stub.
  var NAV = [
    { id: 'why', label: 'Почему', cols: [
        { h: 'Узнать', links: [
          { t: 'Для CEO и основателей', href: 'why.html#for-ceo', ic: 'target' },
          { t: 'Для дата-команд', href: 'why.html#for-data', ic: 'users' },
          { t: 'Для отраслевых аналитиков', href: 'why.html#for-analysts', ic: 'chartBar' },
          { t: 'Архитектура Lakehouse', href: 'platform.html#storage', ic: 'database' },
          { t: 'Полная вертикаль данных', href: 'why.html#vertical', ic: 'layers' } ] },
        { h: 'Клиенты', links: [
          { t: 'Истории клиентов', href: 'customers.html', ic: 'star' },
          { t: 'Trendora — e-commerce', href: 'customers.html#trendora', ic: 'cart' },
          { t: 'Hero Study — образование', href: 'customers.html#hero', ic: 'cap' } ] },
        { h: 'Экосистема', links: [
          { t: 'Обзор экосистемы', href: 'company.html#ecosystem', ic: 'globe' },
          { t: 'Trendora, Hero, VOX AI', href: 'company.html#ecosystem', ic: 'users' } ] }
      ], feature: { kicker: 'Идея продукта', title: 'Почему вертикаль важнее набора инструментов', href: 'why.html#vertical' } },

    { id: 'product', label: 'Продукт', cols: [
        { h: 'Платформа Datasulus', links: [
          { t: 'Обзор платформы', href: 'platform.html', ic: 'layers' },
          { t: 'Коннекторы / Ingestion', href: 'platform.html#ingestion', ic: 'plug' },
          { t: 'Lakehouse-хранилище', href: 'platform.html#storage', ic: 'database' },
          { t: 'AI-BI · LLM Router', href: 'platform.html#ai-bi', ic: 'chartBar' },
          { t: 'AI Data Engineer', href: 'ai-data-engineer.html', ic: 'spark' },
          { t: 'Zero Cross-Tenant', href: 'platform.html#security', ic: 'lock' } ] },
        { h: 'API и интеграции', links: [
          { t: 'Data API', href: 'platform.html#data-api', ic: 'code' },
          { t: 'Management API', href: 'platform.html#management-api', ic: 'cog' },
          { t: 'Observability', href: 'platform.html#observability', ic: 'gauge' },
          { t: 'Каталог коннекторов', href: 'platform.html#ingestion', ic: 'sliders' } ] },
        { h: 'Цены и стек', links: [
          { t: 'Обзор цен', href: 'pricing.html', ic: 'coins' },
          { t: 'Калькулятор стоимости', href: 'pricing.html#model', ic: 'gauge' },
          { t: 'Открытый стек', href: 'platform.html#open-source', ic: 'globe' } ] }
      ], feature: { kicker: 'Killer feature', title: 'AI Data Engineer — три шага вместо месяцев', href: 'ai-data-engineer.html' } },

    { id: 'solutions', label: 'Решения', cols: [
        { h: 'Индустрии', links: [
          { t: 'E-commerce и торговля', href: 'solutions.html#ecommerce', ic: 'cart' },
          { t: 'Образование и вузы', href: 'solutions.html#education', ic: 'cap' },
          { t: 'Финансы', href: 'solutions.html#finance', ic: 'bank' },
          { t: 'Ритейл', href: 'solutions.html#retail', ic: 'store' },
          { t: 'Производство', href: 'solutions.html#manufacturing', ic: 'factory' },
          { t: 'Госсектор', href: 'solutions.html#public', ic: 'gov' },
          { t: 'Здравоохранение', href: 'solutions.html#healthcare', ic: 'health' } ] },
        { h: 'Кросс-индустрия', links: [
          { t: 'AI Agentic Company', href: 'solutions.html#cross-industry', ic: 'spark' },
          { t: 'AI-управление данными', href: 'solutions.html#cross-industry', ic: 'sliders' },
          { t: 'Кибербезопасность', href: 'platform.html#security', ic: 'shield' } ] },
        { h: 'Сервисы и ускорители', links: [
          { t: 'Миграция данных', href: 'solutions.html#migration', ic: 'refresh' },
          { t: 'Профессиональные услуги', href: 'solutions.html#services', ic: 'briefcase' },
          { t: 'Trade Intelligence', href: 'solutions.html#accelerators', ic: 'rocket' },
          { t: 'BI для вузов', href: 'solutions.html#accelerators', ic: 'cap' } ] }
      ], feature: { kicker: 'Ускоритель', title: 'Trade Intelligence: 13 эксклюзивных источников', href: 'customers.html#trendora' } },

    { id: 'resources', label: 'Ресурсы', cols: [
        { h: 'Обучение', links: [
          { t: 'Тренинги', href: 'resources.html#learning', ic: 'book' },
          { t: 'Академия и сертификация', href: 'resources.html#learning', ic: 'star' },
          { t: 'Free Edition', href: 'resources.html#learning', ic: 'bolt' } ] },
        { h: 'События и контент', links: [
          { t: 'Data + AI события', href: 'resources.html#events', ic: 'calendar' },
          { t: 'Блог', href: 'resources.html#blog', ic: 'pen' },
          { t: 'Подкасты', href: 'resources.html#blog', ic: 'chat' } ] },
        { h: 'Поддержка', links: [
          { t: 'Документация', href: 'resources.html#docs', ic: 'code' },
          { t: 'Поддержка клиентов', href: 'resources.html#support', ic: 'lifebuoy' },
          { t: 'Сообщество', href: 'resources.html#community', ic: 'chatGroup' } ] }
      ], feature: { kicker: 'Для разработчиков', title: 'Документация Data API и Management API', href: 'resources.html#docs' } },

    { id: 'about', label: 'Компания', cols: [
        { h: 'Компания', links: [
          { t: 'Кто мы', href: 'company.html#mission', ic: 'target' },
          { t: 'Команда и лидерство', href: 'company.html#leadership', ic: 'users' },
          { t: 'Экосистема и инвестиции', href: 'company.html#ecosystem', ic: 'globe' },
          { t: 'Контакты', href: 'company.html#contact', ic: 'mail' } ] },
        { h: 'Карьера', links: [
          { t: 'Открытые вакансии', href: 'careers.html#jobs', ic: 'briefcase' },
          { t: 'Работа в Datasulus', href: 'careers.html#culture', ic: 'spark' } ] },
        { h: 'Пресса и доверие', links: [
          { t: 'Новости и награды', href: 'company.html#press', ic: 'flag' },
          { t: 'Безопасность и доверие', href: 'platform.html#security', ic: 'shield' } ] }
      ], feature: { kicker: 'Ранний доступ', title: 'Обсудим ваш кейс — мы в раннем доступе', demo: true } }
  ];

  /* ---- 4. Модель футера ------------------------------------------------ */
  var FOOTER = {
    cols: [
      { h: 'Продукт', links: [
        ['Платформа', 'platform.html'], ['AI Data Engineer', 'ai-data-engineer.html'],
        ['Коннекторы', 'platform.html#ingestion'], ['Data / Management API', 'platform.html#data-api'],
        ['Безопасность', 'platform.html#security'], ['Цены', 'pricing.html'] ] },
      { h: 'Решения', links: [
        ['E-commerce', 'solutions.html#ecommerce'], ['Образование', 'solutions.html#education'],
        ['Финансы', 'solutions.html#finance'], ['Trade Intelligence', 'solutions.html#accelerators'],
        ['Все индустрии', 'solutions.html#industries'] ] },
      { h: 'Ресурсы', links: [
        ['Документация', 'resources.html#docs'], ['Блог', 'resources.html#blog'],
        ['События', 'resources.html#events'], ['Обучение', 'resources.html#learning'],
        ['Сообщество', 'resources.html#community'] ] },
      { h: 'Компания', links: [
        ['О нас', 'company.html#mission'], ['Команда', 'company.html#leadership'],
        ['Клиенты', 'customers.html'], ['Карьера', 'careers.html'],
        ['Пресса', 'company.html#press'], ['Контакты', 'company.html#contact'] ] },
      { h: 'Почему Datasulus', links: [
        ['Почему Datasulus', 'why.html'], ['Для CEO', 'why.html#for-ceo'],
        ['Для дата-команд', 'why.html#for-data'], ['Экосистема', 'company.html#ecosystem'],
        ['Запросить демо', '@demo'] ] }
    ],
    social: [['linkedin', 'LinkedIn'], ['x', 'X'], ['facebook', 'Facebook'], ['youtube', 'YouTube'], ['rss', 'RSS'], ['globe', 'Glassdoor']],
    legal: [['Политика конфиденциальности', '@stub:legal'], ['Условия использования', '@stub:legal'], ['Cookie', '@stub:legal']]
  };

  /* ---- 5. Роутинг: active-state + хлебные крошки ----------------------- */
  var ROUTING = {
    pageToTop: { platform: 'product', product: 'product', pricing: 'product',
      solutions: 'solutions', customers: 'why', why: 'why',
      resources: 'resources', company: 'about', careers: 'about' },
    crumbs: {
      platform: [['Datasulus', 'index.html'], ['Платформа', null]],
      product: [['Datasulus', 'index.html'], ['Продукт', 'platform.html'], ['AI Data Engineer', null]],
      solutions: [['Datasulus', 'index.html'], ['Решения', null]],
      pricing: [['Datasulus', 'index.html'], ['Цены', null]],
      resources: [['Datasulus', 'index.html'], ['Ресурсы', null]],
      customers: [['Datasulus', 'index.html'], ['Клиенты', null]],
      why: [['Datasulus', 'index.html'], ['Почему Datasulus', null]],
      company: [['Datasulus', 'index.html'], ['Компания', null]],
      careers: [['Datasulus', 'index.html'], ['Компания', 'company.html'], ['Карьера', null]]
    }
  };

  /* ---- 6. Хелперы ссылок ----------------------------------------------- */
  function attr(href) {
    if (href === '@demo') return 'href="#" data-demo';
    if (href && href.indexOf('@stub:') === 0) return 'href="#" data-stub="' + href.slice(6) + '"';
    return 'href="' + href + '"';
  }

  /* ---- 7. Рендер шапки ------------------------------------------------- */
  function renderHeader(active) {
    var topId = ROUTING.pageToTop[active];
    var promo = '<div class="promo-bar">Datasulus — инфраструктура для AI Agentic Companies.' +
      ' <a href="#" data-demo>Запросить демо <span data-icon="arrow"></span></a></div>';

    var items = NAV.map(function (it) {
      var cols = it.cols.map(function (c) {
        var links = c.links.map(function (l) {
          return '<a ' + attr(l.href) + '><span data-icon="' + l.ic + '"></span>' + l.t + '</a>';
        }).join('');
        return '<div class="mega-col"><h5>' + c.h + '</h5>' + links + '</div>';
      }).join('');
      var feat = it.feature ? ('<div class="mega-feature"><div><div class="kicker">' + it.feature.kicker +
        '</div><h4>' + it.feature.title + '</h4></div><a class="btn-link" ' +
        (it.feature.demo ? 'href="#" data-demo' : 'href="' + it.feature.href + '"') +
        '>Подробнее <span data-icon="arrow"></span></a></div>') : '';
      var isActive = (it.id === topId) ? ' class="active"' : '';
      return '<div class="nav-item" data-top="' + it.id + '">' +
        '<a href="#"' + isActive + '>' + it.label + ' <span class="chev" data-icon="chevron"></span></a>' +
        '<div class="mega-panel"><div class="mega-cols">' + cols + '</div>' + feat + '</div></div>';
    }).join('');

    return promo +
      '<div class="nav">' +
        '<a class="brand" href="index.html" aria-label="Datasulus — AI Data Lakehouse Platform">' + brandSvg(true) +
          '<small>AI Data Lakehouse</small></a>' +
        '<nav class="nav-top">' + items + '</nav>' +
        '<div class="nav-actions">' +
          '<span class="lang"><button class="on">RU</button><button>EN</button></span>' +
          '<a class="nav-login" href="#" data-stub="app">Войти</a>' +
          '<a class="btn btn-primary" href="#" data-demo>Запросить демо</a>' +
          '<button class="nav-burger" aria-label="Меню"><span></span></button>' +
        '</div>' +
      '</div>' + renderMobileNav();
  }

  function renderMobileNav() {
    var blocks = NAV.map(function (it) {
      var links = [];
      it.cols.forEach(function (c) { c.links.forEach(function (l) { links.push('<a ' + attr(l.href) + '>' + l.t + '</a>'); }); });
      return '<details><summary>' + it.label + '</summary><div class="m-links">' + links.join('') + '</div></details>';
    }).join('');
    return '<div class="mobile-nav">' + blocks +
      '<div class="m-actions"><a class="btn btn-ghost" href="#" data-stub="app">Войти</a>' +
      '<a class="btn btn-primary" href="#" data-demo>Запросить демо</a></div></div>';
  }

  /* ---- 8. Хлебные крошки ----------------------------------------------- */
  function renderBreadcrumbs(active) {
    var trail = ROUTING.crumbs[active];
    if (!trail) return '';
    var parts = trail.map(function (c, i) {
      var seg = c[1] ? '<a href="' + c[1] + '">' + c[0] + '</a>' : '<span>' + c[0] + '</span>';
      return (i > 0 ? '<span class="sep" data-icon="chevron"></span>' : '') + seg;
    }).join('');
    return '<div class="breadcrumbs"><div class="container">' + parts + '</div></div>';
  }

  /* ---- 9. Футер -------------------------------------------------------- */
  function renderFooter() {
    var cols = FOOTER.cols.map(function (c) {
      var links = c.links.map(function (l) { return '<a ' + attr(l[1]) + '>' + l[0] + '</a>'; }).join('');
      return '<div class="footer-col"><h5>' + c.h + '</h5>' + links + '</div>';
    }).join('');
    var social = FOOTER.social.map(function (s) {
      return '<a href="#" data-stub="social" aria-label="' + s[1] + '"><span data-icon="' + s[0] + '"></span></a>';
    }).join('');
    var legal = FOOTER.legal.map(function (l) { return '<a ' + attr(l[1]) + '>' + l[0] + '</a>'; }).join('');

    return '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-col footer-brand"><a class="brand" href="index.html">' + brandSvg(true) + '</a>' +
          '<small>AI Data Lakehouse Platform. Из 30 Excel’ей и логинов — live-дашборды и AI-инсайты за 2 часа.</small>' +
          '<div class="footer-newsletter"><h5>Будьте в курсе</h5>' +
            '<form id="newsletterForm"><input type="email" placeholder="you@company.com" required>' +
            '<button type="submit">Подписаться</button></form>' +
            '<div class="done" id="newsletterDone">Спасибо! Мы на связи.</div></div>' +
        '</div>' + cols +
      '</div>' +
      '<div class="footer-bottom">' +
        '<div class="footer-social">' + social + '</div>' +
        '<div class="footer-legal">' + legal + '</div>' +
        '<div class="footer-copy">© 2026 Datasulus · Прототип v0.3</div>' +
      '</div></div>';
  }

  /* ---- 10. Модалки (demo + stub) --------------------------------------- */
  function renderModals() {
    return '<div class="modal-overlay" id="demoModal">' +
      '<div class="modal"><button class="modal-close" data-close aria-label="Закрыть"><span data-icon="x"></span></button>' +
        '<h3>Запросить демо</h3><p>Покажем, как Datasulus превращает ваши источники в live-дашборды за 2 часа.</p>' +
        '<form id="demoForm">' +
          '<div><label>Имя</label><input type="text" required></div>' +
          '<div><label>Компания</label><input type="text" required></div>' +
          '<div><label>Рабочая почта</label><input type="email" required></div>' +
          '<button type="submit" class="btn btn-primary">Отправить заявку</button>' +
        '</form>' +
        '<div class="modal-ok" id="demoOk"><div class="ico-box"><span data-icon="check"></span></div>' +
          '<h3>Заявка принята</h3><p>Свяжемся в течение рабочего дня.</p></div>' +
      '</div></div>' +
      '<div class="modal-overlay" id="stubModal">' +
      '<div class="modal"><button class="modal-close" data-close aria-label="Закрыть"><span data-icon="x"></span></button>' +
        '<h3 id="stubTitle">Раздел в подготовке</h3>' +
        '<p id="stubText">Этот раздел появится в следующей версии прототипа.</p>' +
        '<p class="stub-note">Связаться: <a href="mailto:sylenan@gmail.com" style="color:var(--dlp-cyan-700);font-weight:600">sylenan@gmail.com</a></p>' +
      '</div></div>';
  }

  /* ---- 11. Инициализация ----------------------------------------------- */
  function mount(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

  function init() {
    var page = document.body.getAttribute('data-page') || '';
    var header = document.getElementById('site-header');
    if (header) {
      header.className = 'site-header';
      header.innerHTML = renderHeader(page);
    }
    // breadcrumbs (после шапки)
    var bc = renderBreadcrumbs(page);
    if (bc && header) header.insertAdjacentHTML('afterend', bc);
    mount('site-footer', renderFooter());
    document.body.insertAdjacentHTML('beforeend', renderModals());
    renderIcons();
    initInteractions(header);
  }

  function initInteractions(header) {
    if (!header) return;
    var hoverable = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    function closeAll() { header.querySelectorAll('.nav-item.is-open').forEach(function (n) { n.classList.remove('is-open'); }); }
    // мегаменю: hover (desktop) + клик/клавиатура (touch + a11y)
    if (hoverable) {
      header.addEventListener('mouseover', function (e) {
        var item = e.target.closest('.nav-item');
        if (item && item.classList.contains('is-open')) return;
        closeAll();
        if (item) item.classList.add('is-open');
      });
      header.addEventListener('mouseleave', closeAll);
    }
    header.addEventListener('click', function (e) {
      var top = e.target.closest('.nav-item > a');
      if (top) {
        e.preventDefault();
        var item = top.parentElement;
        var open = item.classList.contains('is-open');
        closeAll();
        // hover-устройства: клик/Enter открывает (закрытие — Esc / уход курсора / клик вне).
        // touch: клик тоглит.
        if (hoverable || !open) item.classList.add('is-open');
      }
      if (e.target.closest('.nav-burger')) {
        document.getElementById('site-header').classList.toggle('menu-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') header.querySelectorAll('.nav-item.is-open').forEach(function (n) { n.classList.remove('is-open'); });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item')) header.querySelectorAll('.nav-item.is-open').forEach(function (n) { n.classList.remove('is-open'); });
    });
    // sticky scrolled state
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // expose icon helper for page scripts / ui.js
  window.Datasulus = { icon: iconSvg, renderIcons: renderIcons, ICONS: ICONS };
  // Backward compat alias (page scripts may still use window.DLP)
  window.DLP = window.Datasulus;

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
