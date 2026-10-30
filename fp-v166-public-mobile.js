/* Folha do Paiquerê v166 — compact public shell and interactions. */
(() => {
  'use strict';

  const PUBLIC_PAGES = new Set([
    'index.html', 'noticias.html', 'conquistas.html', 'sobre.html',
    'participar.html', 'noticia-single.html', 'perfil.html'
  ]);
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!PUBLIC_PAGES.has(file)) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const icons = {
    settings: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 1 1.51-1 1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 1-1.51 1Z"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/></svg>',
    news: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h13a2 2 0 0 1 2 2v14H6a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z"/><path d="M7 8h9M7 12h9M7 16h6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5.5a4 4 0 0 1-8 0V4ZM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13.5V18m-4 3h8m-7-3h6"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></svg>',
    lamp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M8.1 14.2A6 6 0 1 1 15.9 14.2c-.7.55-1.2 1.3-1.4 2.1h-5c-.2-.8-.7-1.55-1.4-2.1Z"/><path d="M12 2v1.6M4.8 4.8 6 6M2 12h1.7M20.3 12H22M18 6l1.2-1.2"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.1"/><path d="M3 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5a3.1 3.1 0 0 1 0 6M17 15a4.5 4.5 0 0 1 4 4.5V20"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
    install: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.3A8.2 8.2 0 0 1 9.7 3.5 8.7 8.7 0 1 0 20.5 14.3Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>'
  };

  // The veil is real markup so it covers content before the deferred scripts finish.
  const loader = $('#fp-public-loading');
  let loaderHidden = false;
  const hideLoader = () => {
    if (loaderHidden || !loader) return;
    loaderHidden = true;
    loader.classList.add('is-leaving');
    window.setTimeout(() => { loader.hidden = true; loader.remove(); }, 280);
  };
  const hideLoaderAfterMinimum = () => {
    const wait = Math.max(0, 460 - (performance.now() - loaderStart));
    window.setTimeout(hideLoader, wait);
  };
  const loaderStart = performance.now();
  window.addEventListener('load', hideLoaderAfterMinimum, { once: true });
  window.setTimeout(hideLoaderAfterMinimum, 8000);
  if (document.readyState === 'complete') hideLoaderAfterMinimum();

  document.body.classList.add('fp-public-mobile-shell');

  const activePage = file === 'index.html' ? 'home'
    : (file === 'noticias.html' || file === 'noticia-single.html') ? 'news'
    : file === 'conquistas.html' ? 'achievements'
    : file === 'sobre.html' ? 'about' : '';

  const headerMarkup = `
    <header class="fp-mobile-public-header" aria-label="Cabeçalho do jornal">
      <details class="fp-mobile-public-settings" id="fp-mobile-public-settings">
        <summary aria-label="Abrir configurações" title="Configurações">${icons.settings}</summary>
        <div class="fp-mobile-public-settings-popover" role="group" aria-label="Configurações do site">
          <button type="button" class="fp-mobile-public-menu-action" data-public-edit-anonymous>${icons.profile}<span>Editar perfil</span></button>
          <button type="button" class="fp-mobile-public-menu-action" data-pwa-install="public-settings">${icons.install}<span>Baixar site</span></button>
          <a class="fp-mobile-public-menu-action" href="login.html">${icons.people}<span>Área do estudante</span>${icons.arrow}</a>
          <hr class="fp-mobile-public-menu-divider">
          <button type="button" class="fp-mobile-public-menu-action" data-public-theme-toggle>${icons.moon}<span data-public-theme-label>Modo escuro</span></button>
          <div class="fp-mobile-public-font-row"><span>Tamanho do texto</span><button type="button" data-public-font-decrease aria-label="Diminuir tamanho do texto">A−</button><button type="button" data-public-font-increase aria-label="Aumentar tamanho do texto">A+</button></div>
        </div>
      </details>
      <a class="fp-mobile-public-brand" href="index.html" aria-label="Folha do Paiquerê — Início">
        <img src="assets/branding/brasao-folha-paiquere.png" alt="">
        <span>Folha do Paiquerê</span>
      </a>
    </header>
    <nav class="fp-mobile-public-bottom-nav" aria-label="Navegação do site">
      <a class="fp-mobile-public-nav-link" href="index.html" data-public-nav="home" ${activePage === 'home' ? 'aria-current="page"' : ''}>${icons.home}<span>Início</span></a>
      <a class="fp-mobile-public-nav-link" href="noticias.html" data-public-nav="news" ${activePage === 'news' ? 'aria-current="page"' : ''}>${icons.news}<span>Notícias</span></a>
      <a class="fp-mobile-public-nav-link" href="conquistas.html" data-public-nav="achievements" ${activePage === 'achievements' ? 'aria-current="page"' : ''}>${icons.trophy}<span>Conquistas</span></a>
      <a class="fp-mobile-public-nav-link" href="sobre.html" data-public-nav="about" ${activePage === 'about' ? 'aria-current="page"' : ''}>${icons.about}<span>Sobre</span></a>
    </nav>
    <div class="fp-public-anon-profile-backdrop" id="fp-public-anon-profile-backdrop" hidden>
      <section class="fp-public-anon-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="fp-public-anon-profile-title">
        <h2 id="fp-public-anon-profile-title">Editar perfil anônimo</h2>
        <p>Escolha como seu nome aparecerá nos comentários. Essa identificação fica salva somente neste navegador.</p>
        <form data-anon-profile-form>
          <label for="fp-public-anon-name">Nome público</label>
          <input id="fp-public-anon-name" name="publicName" type="text" maxlength="80" autocomplete="nickname" placeholder="Seu nome ou apelido (opcional)">
          <p class="fp-public-anon-status" data-anon-profile-status aria-live="polite"></p>
          <div class="fp-public-anon-profile-actions"><button type="button" data-anon-cancel>Cancelar</button><button type="submit" data-anon-save>Salvar alterações</button></div>
        </form>
      </section>
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', headerMarkup);

  const settings = $('#fp-mobile-public-settings');
  const closeSettings = () => settings?.removeAttribute('open');
  document.addEventListener('click', event => {
    if (settings?.open && !settings.contains(event.target)) closeSettings();
  });
  window.addEventListener('scroll', closeSettings, { passive: true });
  document.addEventListener('touchmove', event => { if(settings?.open && !settings.contains(event.target)) closeSettings(); }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSettings();
      closeAnonModal();
    }
  });

  // Proxy the established desktop controls where they exist. On profile pages that
  // do not carry that accessibility bar, use the same local preferences directly.
  const applyThemeLocally = () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;
    try { localStorage.setItem('theme', next); localStorage.setItem('fp_theme_manual', '1'); } catch (_) {}
    window.dispatchEvent(new CustomEvent('fp:theme-updated', { detail: next }));
    syncThemeControl();
  };
  const themeProxy = $('[data-public-theme-toggle]');
  themeProxy?.addEventListener('click', () => {
    const actual = $('#theme-toggle');
    const wasDark = document.documentElement.classList.contains('dark');
    if (actual) actual.click();
    if (!actual || document.documentElement.classList.contains('dark') === wasDark) applyThemeLocally();
    closeSettings();
    window.setTimeout(syncThemeControl, 0);
  });
  const syncThemeControl = () => {
    if (!themeProxy) return;
    const dark = document.documentElement.classList.contains('dark');
    themeProxy.innerHTML = `${dark ? icons.sun : icons.moon}<span data-public-theme-label>${dark ? 'Modo claro' : 'Modo escuro'}</span>`;
    themeProxy.setAttribute('aria-label', dark ? 'Alternar para modo claro' : 'Alternar para modo escuro');
  };
  window.addEventListener('fp:theme-updated', syncThemeControl);
  window.addEventListener('storage', event => { if (event.key === 'theme') syncThemeControl(); });
  if ('MutationObserver' in window) new MutationObserver(syncThemeControl).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  syncThemeControl();

  const changeFont = delta => {
    const id = delta > 0 ? 'font-increase' : 'font-decrease';
    const actual = document.getElementById(id);
    const storedScale = () => {
      try { return Number(document.documentElement.dataset.fontScale ?? localStorage.getItem('fp-font-scale') ?? 0); }
      catch (_) { return Number(document.documentElement.dataset.fontScale || 0); }
    };
    const before = storedScale();
    if (actual) actual.click();
    const after = storedScale();
    if (actual && Number.isFinite(after) && after !== before) return;
    let value = Number.isFinite(after) ? after : 0;
    value = Math.max(-2, Math.min(3, value + delta));
    document.documentElement.dataset.fontScale = String(value);
    document.documentElement.style.fontSize = `${100 + value * 10}%`;
    try { localStorage.setItem('fp-font-scale', String(value)); } catch (_) {}
    const status = document.getElementById('accessibility-status');
    if (status) status.textContent = `Tamanho do texto ajustado para ${100 + value * 10} por cento.`;
  };
  $('[data-public-font-increase]')?.addEventListener('click', () => changeFont(1));
  $('[data-public-font-decrease]')?.addEventListener('click', () => changeFont(-1));

  // Simple local-only display name. Comments already read this existing key.
  const anonBackdrop = $('#fp-public-anon-profile-backdrop');
  const anonInput = $('#fp-public-anon-name');
  const anonForm = $('[data-anon-profile-form]');
  const anonStatus = $('[data-anon-profile-status]');
  const syncAnonymousVisualViewport = () => {
    const vv=window.visualViewport;const height=Math.max(320,Math.round(vv?.height||window.innerHeight||window.screen?.height||640));
    document.documentElement.style.setProperty('--fp-public-visual-height',`${height}px`);
    if(document.activeElement===anonInput&&anonBackdrop&&!anonBackdrop.hidden)window.setTimeout(()=>anonInput?.scrollIntoView({block:'center',behavior:'auto'}),30);
  };
  window.visualViewport?.addEventListener('resize',syncAnonymousVisualViewport,{passive:true});
  window.visualViewport?.addEventListener('scroll',syncAnonymousVisualViewport,{passive:true});
  window.addEventListener('resize',syncAnonymousVisualViewport,{passive:true});
  let previousFocus = null;
  const openAnonModal = () => {
    previousFocus = document.activeElement;
    try { anonInput.value = String(localStorage.getItem('fp_comment_display_name') || '').slice(0, 80); } catch (_) { anonInput.value = ''; }
    if (anonStatus) anonStatus.textContent = '';
    anonBackdrop?.removeAttribute('hidden');
    anonBackdrop?.classList.add('is-open');
    syncAnonymousVisualViewport();
    window.setTimeout(() => { anonInput?.focus({ preventScroll: true }); syncAnonymousVisualViewport(); anonInput?.scrollIntoView({block:'center',behavior:'auto'}); }, 80);
    closeSettings();
  };
  function closeAnonModal() {
    if (!anonBackdrop?.classList.contains('is-open')) return;
    anonBackdrop.classList.remove('is-open');
    anonBackdrop.setAttribute('hidden', '');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
  }
  $('[data-public-edit-anonymous]')?.addEventListener('click', openAnonModal);
  $('[data-anon-cancel]')?.addEventListener('click', closeAnonModal);
  anonBackdrop?.addEventListener('click', event => { if (event.target === anonBackdrop) closeAnonModal(); });
  anonForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = String(anonInput?.value || '').trim().slice(0, 80);
    try { if (name) localStorage.setItem('fp_comment_display_name', name); else localStorage.removeItem('fp_comment_display_name'); }
    catch (_) { if (anonStatus) anonStatus.textContent = 'O navegador não permitiu salvar esta preferência.'; return; }
    const welcomeInput = $('#visitor-display-name');
    if (welcomeInput) welcomeInput.value = name;
    if (anonStatus) anonStatus.textContent = 'Nome público salvo neste navegador.';
    window.dispatchEvent(new CustomEvent('fp:anonymous-display-name-updated', { detail: { name } }));
    window.setTimeout(closeAnonModal, 400);
  });

  // Add the two quick-access cards before the existing latest-news section.
  if (file === 'index.html' && !$('#fp-mobile-quick-access')) {
    const latest = $('#noticias-recentes-titulo')?.closest('.fp-home-content-section');
    if (latest) {
      const section = document.createElement('section');
      section.id = 'fp-mobile-quick-access';
      section.className = 'fp-mobile-quick-section';
      section.setAttribute('aria-labelledby', 'fp-mobile-quick-heading');
      section.innerHTML = `<h2 class="fp-mobile-quick-heading" id="fp-mobile-quick-heading">Acesso rápido</h2>
        <div class="fp-mobile-quick-grid">
          <a class="fp-mobile-quick-card is-participate" href="participar.html"><span class="fp-mobile-quick-icon">${icons.lamp}</span><strong class="fp-mobile-quick-title">Participe</strong><span class="fp-mobile-quick-subtitle">Mande a sua sugestão</span><span class="fp-mobile-quick-arrow">${icons.arrow}</span></a>
          <a class="fp-mobile-quick-card" href="login.html"><span class="fp-mobile-quick-icon">${icons.people}</span><strong class="fp-mobile-quick-title">Área do estudante</strong><span class="fp-mobile-quick-subtitle">Painel editorial</span><span class="fp-mobile-quick-arrow">${icons.arrow}</span></a>
        </div>`;
      latest.parentNode.insertBefore(section, latest);
    }
  }

  // On compact screens, expose exactly the four requested sort options while keeping
  // the existing desktop-only “Mais visualizações” option and its original handler.
  const sortSelect = $('#news-sort-select');
  if (sortSelect) {
    const viewsOption = sortSelect.querySelector('option[value="views"]');
    const syncCompactSortOptions = () => {
      const compact = window.matchMedia('(max-width: 767px)').matches;
      if (viewsOption) {
        viewsOption.hidden = compact;
        viewsOption.disabled = compact;
      }
      if (compact && sortSelect.value === 'views') {
        sortSelect.value = 'recent';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    syncCompactSortOptions();
    window.addEventListener('resize', syncCompactSortOptions, { passive: true });
  }

  // Expose the News page's existing category options as horizontally scrollable chips.
  const categorySelect = $('#news-category-select');
  if (categorySelect && !$('#fp-mobile-news-categories')) {
    const filterRow = categorySelect.closest('.fp-news-filter-row');
    if (filterRow) {
      const nav = document.createElement('nav');
      nav.id = 'fp-mobile-news-categories';
      nav.className = 'fp-mobile-news-categories';
      nav.setAttribute('aria-label', 'Filtrar notícias por tema');
      nav.innerHTML = [...categorySelect.options].map(option => `<button type="button" class="fp-mobile-news-category" data-news-category="${escapeAttr(option.value)}" aria-pressed="${option.value === categorySelect.value ? 'true' : 'false'}">${escapeHTML(option.textContent.trim())}</button>`).join('');
      filterRow.insertAdjacentElement('afterend', nav);
      nav.addEventListener('click', event => {
        const chip = event.target.closest('[data-news-category]');
        if (!chip) return;
        categorySelect.value = chip.dataset.newsCategory;
        categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
        syncCategoryChips();
      });
      function syncCategoryChips() {
        nav.querySelectorAll('[data-news-category]').forEach(chip => {
          const active = chip.dataset.newsCategory === categorySelect.value;
          chip.setAttribute('aria-pressed', String(active));
          if (active) chip.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        });
      }
      categorySelect.addEventListener('change', syncCategoryChips);
      const queryType = new URLSearchParams(location.search).get('tipo');
      if (queryType === 'entretenimento') {
        categorySelect.value = 'Cantinho Criativo';
        categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  // The existing hero carousel still owns slide timing/data. Add mobile swipe gestures
  // and use the full update card as the target; hidden action buttons remain functional.
  const feature = $('#home-feature-card');
  if (feature && !feature.dataset.fpMobileSwipeBound) {
    feature.dataset.fpMobileSwipeBound = '1';
    feature.setAttribute('tabindex', '0');
    feature.setAttribute('aria-keyshortcuts', 'Enter Space');
    let startX = 0, startY = 0, pointerType = '', suppressClickUntil = 0;
    feature.addEventListener('pointerdown', event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      startX = event.clientX; startY = event.clientY; pointerType = event.pointerType || '';
    }, { passive: true });
    feature.addEventListener('pointerup', event => {
      if (pointerType !== 'touch' && pointerType !== 'pen') return;
      const dx = event.clientX - startX, dy = event.clientY - startY;
      if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      suppressClickUntil = Date.now() + 500;
      event.preventDefault();
      const control = document.getElementById(dx < 0 ? 'home-feature-next' : 'home-feature-prev');
      control?.click();
    });
    feature.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (!window.matchMedia('(max-width: 767px)').matches) return;
      event.preventDefault();
      feature.click();
    });
    feature.addEventListener('click', event => {
      if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); return; }
      if (!window.matchMedia('(max-width: 767px)').matches) return;
      if (event.target.closest('[data-home-open-notice], .fp-home-arrow, .fp-home-dot')) return;
      const type = feature.dataset.slideType || 'welcome';
      // The existing image link already opens notice details; do not trigger a second modal.
      if (type === 'notice' && event.target.closest('#home-feature-link')) return;
      const id = feature.dataset.slideId || '';
      if (type === 'notice') {
        const noticeButton = feature.querySelector('[data-home-open-notice]');
        if (noticeButton) { event.preventDefault(); noticeButton.click(); }
        return;
      }
      const href = type === 'article' && id ? `noticia-single.html?id=${encodeURIComponent(id)}`
        : type === 'achievement' && id ? `conquistas.html#achievement-${encodeURIComponent(id)}`
        : type === 'achievement' ? 'conquistas.html'
        : type === 'welcome' ? 'noticias.html'
        : feature.dataset.mobileHref || 'noticias.html';
      event.preventDefault();
      location.href = href;
    });
  }

  function escapeHTML(value) {
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  function escapeAttr(value) { return escapeHTML(value).replaceAll('`', '&#096;'); }
})();
