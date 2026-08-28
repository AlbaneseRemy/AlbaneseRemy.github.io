(function () {
  'use strict';

  var SUPPORTED = ['fr', 'en'];
  var FALLBACK = 'en';

  var EMAIL_USER = 'remy.albanese2';
  var EMAIL_HOST = 'gmail.com';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var MEDALS = { gold: '🥇', silver: '🥈', bronze: '🥉' };

  var SECTIONS = [
    { id: 'sec-results', key: 'sections.results' },
    { id: 'sec-bests', key: 'sections.bests' },
    { id: 'sec-rankings', key: 'sections.rankings' },
    { id: 'sec-goals', key: 'sections.goals' },
    { id: 'sec-gear', key: 'sections.gear' },
    { id: 'sec-education', key: 'sections.education' },
    { id: 'sec-work', key: 'sections.work' },
  ];

  var state = { lang: null, photoIndex: 0 };

  // ---------------------------------------------------------------- Tools

  function $(sel) { return document.querySelector(sel); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(d, viewBox) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', viewBox || '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    return svg;
  }

  function externalIcon() {
    return icon('M5.5 10.5 10.5 5.5M6.5 5.5h4v4');
  }

  function t(path) {
    var node = window.I18N[state.lang];
    var parts = path.split('.');
    for (const element of parts) {
      if (node == null) return '';
      node = node[element];
    }
    return node == null ? '' : node;
  }

  function clear(node) {
    while (node.firstChild) {
      node.firstChild.remove();
    }
  }

  function emptied(selector) {
    var node = $(selector);
    if (!node) return null;
    clear(node);
    return node;
  }

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // ------------------------------------------------------- Language selection

  function detectLang() {
    var forced = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.includes(forced)) {
      return forced;
    }

    var saved = read('lang');
    if (SUPPORTED.includes(saved)) {
      return saved;
    }

    var tags = navigator.languages || [navigator.language || ''];
    for (const element of tags) {
      var base = String(element).slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(base)) {
        return base;
      }
    }
    return FALLBACK;
  }

  // ------------------------------------------------------------------- Rendering

  function renderContact() {
    var list = emptied('#contact');
    if (!list) return;

    list.appendChild(el('li', null, t('header.location')));

    var mail = el('li');
    var address = EMAIL_USER + '@' + EMAIL_HOST;
    var link = el('a', null, address);
    link.href = 'mailto:' + address;
    mail.appendChild(link);
    list.appendChild(mail);

    t('header.links').forEach(function (item) {
      var li = el('li');
      var a = el('a', null, item.label);
      a.href = item.url;
      a.rel = 'me noopener';
      a.target = '_blank';
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function renderResults() {
    var host = emptied('#results');
    if (!host) return;

    t('results').forEach(function (group) {
      var row = el('div', 'row');
      row.appendChild(el('div', 'row__label', group.year));

      var items = el('ul', 'row__body');
      group.items.forEach(function (item) {
        var li = el('li', 'result' + (item.medal ? ' result--medal' : ''));

        var slot = el('span', 'result__medal');
        if (item.medal) {
          slot.textContent = MEDALS[item.medal];
          slot.setAttribute('role', 'img');
          slot.setAttribute('aria-label', t('ui.medal' + item.medal.charAt(0).toUpperCase() +
                                            item.medal.slice(1)));
        } else {
          slot.setAttribute('aria-hidden', 'true');
        }
        li.appendChild(slot);

        li.appendChild(el('span', 'result__text', item.text));

        if (item.url) {
          var a = el('a', 'result__link');
          a.href = item.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.setAttribute('aria-label', t('ui.resultLink') + ' — ' + item.text);
          a.appendChild(document.createTextNode(t('ui.resultLink')));
          a.appendChild(externalIcon());
          li.appendChild(a);
        }
        items.appendChild(li);
      });

      row.appendChild(items);
      host.appendChild(row);
    });
  }

  function renderBests() {
    var host = emptied('#bests');
    if (!host) return;

    t('bests').forEach(function (best) {
      var li = el('li', 'best');
      li.appendChild(el('span', 'best__label', best.label));

      var score;
      if (best.url) {
        score = el('a', 'best__score', best.score);
        score.href = best.url;
        score.target = '_blank';
        score.rel = 'noopener';
        score.setAttribute('aria-label', best.label + ' : ' + best.score + ' — ' + t('ui.resultLink'));
      } else {
        score = el('span', 'best__score', best.score);
      }
      li.appendChild(score);
      host.appendChild(li);
    });
  }

  function renderRankings() {
    var section = $('#sec-rankings');
    var host = emptied('#rankings');
    if (!host || !section) return;

    var data = t('rankings');
    var items = ((data?.items) || []).filter(function (item) { return item.rank; });

    section.hidden = items.length === 0;
    if (section.hidden) return;

    var title = $('#rankings-title');
    if (title) title.textContent = t('sections.rankings') + ' ' + data.season;

    items.forEach(function (item) {
      var li = el('li', 'best');
      li.appendChild(el('span', 'best__label', item.label));

      var rank;
      if (item.url) {
        rank = el('a', 'best__score', item.rank);
        rank.href = item.url;
        rank.target = '_blank';
        rank.rel = 'noopener';
        rank.setAttribute('aria-label', item.label + ' : ' + item.rank + ' — ' + t('ui.resultLink'));
      } else {
        rank = el('span', 'best__score', item.rank);
      }
      li.appendChild(rank);

      if (item.note) li.appendChild(el('span', 'best__note', item.note));
      host.appendChild(li);
    });
  }

  function renderGoals() {
    var host = emptied('#goals');
    if (!host) return;

    host.appendChild(el('p', null, t('goals.shortTermIntro')));

    var list = el('ul');
    t('goals.shortTerm').forEach(function (item) {
      list.appendChild(el('li', null, item));
    });
    host.appendChild(list);

    host.appendChild(el('p', null, t('goals.selection')));
    host.appendChild(el('p', null, t('goals.longTerm')));
  }

  function renderGear() {
    var host = emptied('#gear');
    if (!host) return;

    t('gear').forEach(function (entry) {
      var row = el('div', 'gear__row');
      row.appendChild(el('dt', 'gear__label', entry.label));

      var dd = el('dd', 'gear__value');
      if (entry.items) {
        var ul = el('ul');
        entry.items.forEach(function (item) { ul.appendChild(el('li', null, item)); });
        dd.appendChild(ul);
      } else {
        dd.textContent = entry.value;
      }
      row.appendChild(dd);
      host.appendChild(row);
    });
  }

  function renderEntries(selector, key) {
    var host = emptied(selector);
    if (!host) return;

    t(key).forEach(function (entry) {
      var li = el('li', 'row');
      li.appendChild(el('div', 'row__label', entry.period));

      var body = el('div', 'entry');
      body.appendChild(el('div', 'entry__title', entry.title));
      body.appendChild(el('div', 'entry__place', entry.place));
      if (entry.note) body.appendChild(el('div', 'entry__note', entry.note));

      li.appendChild(body);
      host.appendChild(li);
    });
  }

  function renderGallery() {
    var host = emptied('#gallery');
    if (!host) return;

    t('photos').forEach(function (photo, index) {
      var li = el('li');
      var fig = el('figure', 'photo');

      var btn = el('button', 'photo__btn');
      btn.type = 'button';
      btn.setAttribute('aria-label', t('ui.openPhoto') + ' — ' + photo.caption);

      var img = el('img', 'photo__img');
      img.src = 'assets/photos/' + photo.file + '-thumb.webp';
      img.alt = photo.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = photo.w;
      img.height = photo.h;
      btn.appendChild(img);

      btn.addEventListener('click', function () { openLightbox(index); });
      fig.appendChild(btn);

      var caption = el('figcaption', 'photo__caption');
      caption.appendChild(el('span', 'photo__title', photo.caption));
      if (photo.credit) caption.appendChild(el('span', 'photo__credit', photo.credit));
      fig.appendChild(caption);

      li.appendChild(fig);
      host.appendChild(li);
    });
  }

  function renderToc() {
    var list = emptied('#toc-list');
    if (!list) return;

    SECTIONS.forEach(function (section) {
      var target = document.getElementById(section.id);
      if (target?.hidden) {
        return;
      }

      var li = el('li');
      var a = el('a', 'toc__link', t(section.key));
      a.href = '#' + section.id;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function initToc() {
    if (!('IntersectionObserver' in window)) return;

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });

      var current = null;
      for (var i = 0; i < SECTIONS.length && !current; i++) {
        if (visible[SECTIONS[i].id]) current = SECTIONS[i].id;
      }

      document.querySelectorAll('.toc__link').forEach(function (link) {
        if (current && link.getAttribute('href') === '#' + current) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    SECTIONS.forEach(function (section) {
      var node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });
  }

  // -------------------------------------------------------------- Full screen

  var lightbox = $('#lightbox');

  function preload(index) {
    var photos = t('photos');
    var photo = photos[(index + photos.length) % photos.length];
    new Image().src = 'assets/photos/' + photo.file + '.webp';
  }

  function showPhoto(index) {
    var photos = t('photos');
    state.photoIndex = (index + photos.length) % photos.length;
    var photo = photos[state.photoIndex];

    var img = $('#lightbox-img');
    img.src = 'assets/photos/' + photo.file + '.webp';
    img.alt = photo.alt;
    img.width = photo.w;
    img.height = photo.h;

    $('#lightbox-caption').textContent = photo.caption;
    $('#lightbox-credit').textContent = photo.credit || '';
    $('#lb-counter').textContent = t('ui.photoCounter')
      .replace('{n}', String(state.photoIndex + 1))
      .replace('{total}', String(photos.length));

    preload(state.photoIndex + 1);
    preload(state.photoIndex - 1);
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.showModal();
  }

  function initLightbox() {
    if (!lightbox) return;
    $('#lb-next').addEventListener('click', function () { showPhoto(state.photoIndex + 1); });
    $('#lb-prev').addEventListener('click', function () { showPhoto(state.photoIndex - 1); });
    $('#lb-close').addEventListener('click', function () { lightbox.close(); });

    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(state.photoIndex + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(state.photoIndex - 1); }
    });

    lightbox.addEventListener('click', function (event) {
      if (!event.target.closest('.lightbox__img, .iconbtn, .lightbox__caption')) lightbox.close();
    });

    lightbox.addEventListener('close', function () {
      requestAnimationFrame(function () {
        var thumbnails = document.querySelectorAll('.photo__btn');
        if (thumbnails[state.photoIndex]) thumbnails[state.photoIndex].focus();
      });
    });
  }

  // ------------------------------------------------------------------ Tabs

  var TABS = [
    { tab: '#tab-cv', panel: '#panel-cv', hash: 'cv' },
    { tab: '#tab-annex', panel: '#panel-annex', hash: 'photos' },
  ];

  function selectTab(index, options) {
    var opts = options || {};
    TABS.forEach(function (entry, i) {
      var tab = $(entry.tab);
      var panel = $(entry.panel);
      var active = i === index;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
    var toc = $('#toc');
    if (toc) toc.hidden = index !== 0;
    if (opts.focus) $(TABS[index].tab).focus();
    if (opts.updateHash !== false) {
      history.replaceState(null, '', location.pathname + location.search + '#' + TABS[index].hash);
    }
  }

  function currentTab() {
    for (var i = 0; i < TABS.length; i++) {
      if ($(TABS[i].tab).getAttribute('aria-selected') === 'true') return i;
    }
    return 0;
  }

  function initTabs() {
    TABS.forEach(function (entry, i) {
      $(entry.tab).addEventListener('click', function () { selectTab(i); });
    });

    $('.tabs__list').addEventListener('keydown', function (event) {
      var index = currentTab();
      var next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = TABS.length - 1;
      if (next === null) return;
      event.preventDefault();
      selectTab(next, { focus: true });
    });

    function tabForHash() {
      var hash = location.hash.replace('#', '');
      for (var i = 0; i < TABS.length; i++) {
        if (TABS[i].hash === hash) return i;
      }
      return -1;
    }

    window.addEventListener('hashchange', function () {
      var index = tabForHash();
      if (index !== -1) selectTab(index, { updateHash: false });
    });

    selectTab(Math.max(tabForHash(), 0), { updateHash: false });
  }

  // -------------------------------------------------------------------- Theme

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    var explicit = document.documentElement.dataset.theme;
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function syncThemeButton() {
    var dark = effectiveTheme() === 'dark';
    var button = $('#theme-toggle');
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.setAttribute('aria-label', t(dark ? 'ui.themeToLight' : 'ui.themeToDark'));
    button.title = button.getAttribute('aria-label');
  }

  function initTheme() {
    $('#theme-toggle').addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      store('theme', next);
      syncThemeButton();
    });

    darkQuery.addEventListener('change', syncThemeButton);
  }

  // ------------------------------------------------------------------- Language

  function applyLang(lang, options) {
    var opts = options || {};
    state.lang = lang;

    document.documentElement.lang = lang;
    document.title = t('meta.title');

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('meta.description'));

    var pdf = $('#pdf-link');
    if (pdf) {
      pdf.href = t('meta.pdf');
      pdf.setAttribute('aria-label', t('ui.downloadPdfFull'));
    }

    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
      var parts = node.dataset.i18nAttr.split(':');
      node.setAttribute(parts[0], t(parts[1]));
    });

    var footer = $('#footer-name');
    if (footer) footer.textContent = t('header.name');

    var portrait = $('#portrait');
    if (portrait) portrait.alt = t('ui.portraitAlt');

    document.querySelectorAll('.langswitch__btn').forEach(function (button) {
      button.setAttribute('aria-pressed', button.dataset.lang === lang ? 'true' : 'false');
    });

    renderContact();
    renderResults();
    renderBests();
    renderRankings();
    renderGoals();
    renderGear();
    renderEntries('#education', 'education');
    renderEntries('#work', 'work');
    renderGallery();
    renderToc();
    syncThemeButton();

    if (lightbox && lightbox.open) showPhoto(state.photoIndex);

    if (opts.persist) {
      store('lang', lang);
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
  }

  function initLangSwitch() {
    document.querySelectorAll('.langswitch__btn').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.lang === state.lang) return;
        var offset = window.scrollY;
        applyLang(button.dataset.lang, { persist: true });
        window.scrollTo({ top: offset, left: 0, behavior: 'instant' });
      });
    });
  }

  // --------------------------------------------------------------- Startup

  initTabs();
  initToc();
  initTheme();
  initLightbox();
  initLangSwitch();
  applyLang(detectLang());
})();
