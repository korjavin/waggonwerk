// app.js — vanilla JS port of WaggonWerk landing site

const t = (k) => Lang.t(k);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

// ===== state =====
const state = {
  view: 'home',
  configLine: 'classic',
  cart: [],
  blogFilter: 'all',
  // configurator state
  cfg: { line: 'classic', scale: 'HO', material: 'PLA', filament: 'Bone', quantity: 'Set of 5' },
  // notify form
  notify: { email: '', submitted: false, error: '', count: 412 },
  // contact form
  contact: { topic: 'topic_replace', name: '', email: '', country: '', message: '', consent: false, sent: false, showErr: false },
};

// ===== atoms =====
const eyebrow = (s) => `<div class="ww-eyebrow">${esc(s)}</div>`;
const label = (s) => `<div class="ww-label">${esc(s)}</div>`;
const spec = (s) => `<span class="ww-spec">${esc(s)}</span>`;
const badge = (variant, s) => `<span class="ww-badge ${variant}">${esc(s)}</span>`;
const btn = (variant, label, action, extra) => {
  const a = action ? `data-action="${esc(action)}"` : '';
  const e = extra ? Object.entries(extra).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ') : '';
  return `<button class="ww-btn ww-btn-${variant}" ${a} ${e}>${label}</button>`;
};
const rivets = () => `
  <span class="ww-plate-rivet tl"></span>
  <span class="ww-plate-rivet tr"></span>
  <span class="ww-plate-rivet bl"></span>
  <span class="ww-plate-rivet br"></span>`;

// ===== Header =====
function header() {
  const items = [
    { id: 'home',    label: t('nav_catalog') },
    { id: 'config',  label: t('nav_config') },
    { id: 'about',   label: t('nav_about') },
    { id: 'blog',    label: t('nav_blog') },
    { id: 'contact', label: t('nav_contact') },
  ];
  const active = state.view;
  const cartCount = state.cart.length;
  const cartTotal = state.cart.reduce((s, x) => s + x.total, 0).toFixed(2).replace('.', ',');
  return `
  <header class="ww-header">
    <div class="ww-header-inner">
      <a class="ww-wm" data-action="nav" data-view="home" style="cursor:pointer">
        WAGGON<span class="a">WERK</span>
      </a>
      <nav class="ww-nav">
        ${items.map(it => `
          <a class="${active === it.id ? 'active' : ''}"
             data-action="nav" data-view="${it.id}">${esc(it.label)}</a>`).join('')}
      </nav>
      <div style="display:flex;align-items:center;gap:16px">
        <div class="ww-langtoggle" role="group" aria-label="Language">
          <button class="ww-langtoggle-btn ${Lang.current === 'en' ? 'active' : ''}"
                  data-action="lang" data-lang="en" aria-pressed="${Lang.current === 'en'}">EN</button>
          <span class="ww-langtoggle-sep">·</span>
          <button class="ww-langtoggle-btn ${Lang.current === 'de' ? 'active' : ''}"
                  data-action="lang" data-lang="de" aria-pressed="${Lang.current === 'de'}">DE</button>
        </div>
        <div class="ww-cart">${esc(t('cart_label'))} ${cartCount} · €&nbsp;${cartTotal}</div>
      </div>
    </div>
  </header>`;
}

// ===== Footer =====
function footer() {
  return `
  <footer class="ww-footer">
    <div class="container">
      <div class="ww-footer-grid">
        <div>
          <div class="ww-wm" style="font-size:18px;margin-bottom:12px">
            WAGGON<span class="a">WERK</span>
          </div>
          <p>${esc(t('foot_blurb'))}</p>
        </div>
        <div>
          <h4>${esc(t('foot_h_catalog'))}</h4>
          <ul>
            <li><a>${esc(t('foot_li_classic'))}</a></li>
            <li><a>${esc(t('foot_li_modernist'))}</a></li>
            <li><a>${esc(t('foot_li_voyager'))}</a></li>
            <li><a>${esc(t('foot_li_limited'))}</a></li>
          </ul>
        </div>
        <div>
          <h4>${esc(t('foot_h_workshop'))}</h4>
          <ul>
            <li><a>${esc(t('foot_li_commission'))}</a></li>
            <li><a data-action="nav" data-view="replace">${esc(t('foot_li_replace'))}</a></li>
            <li><a>${esc(t('foot_li_bulk'))}</a></li>
            <li><a>${esc(t('foot_li_care'))}</a></li>
          </ul>
        </div>
        <div>
          <h4>${esc(t('foot_h_manufaktur'))}</h4>
          <ul>
            <li><a data-action="nav" data-view="about">${esc(t('foot_li_about'))}</a></li>
            <li><a>${esc(t('foot_li_methods'))}</a></li>
            <li><a>${esc(t('foot_li_shipping'))}</a></li>
            <li><a>${esc(t('foot_li_imprint'))}</a></li>
          </ul>
        </div>
      </div>
      <div class="ww-footer-base">
        <div>${esc(t('foot_copy'))}</div>
        <div>${esc(t('foot_disclaimer'))}</div>
      </div>
    </div>
  </footer>`;
}

// ===== Homepage sections =====
function hero() {
  return `
  <section class="ww-hero">
    <div class="ww-hero-corner">${esc(t('hero_corner'))}</div>
    <div class="ww-hero-inner">
      <div>
        ${eyebrow(t('hero_eyebrow'))}
        <h1>
          ${esc(t('hero_h1_a'))}<br>
          ${esc(t('hero_h1_b'))}<br>
          ${esc(t('hero_h1_c'))}<br>
          ${esc(t('hero_h1_d'))} <span class="accent">${esc(t('hero_h1_accent'))}</span>.
        </h1>
        <p class="ww-hero-lede">${esc(t('hero_lede'))}</p>
        <div class="ww-hero-cta">
          ${btn('primary', esc(t('hero_cta_build')), 'configure', { line: 'classic' })}
          ${btn('ghost', esc(t('hero_cta_stl')), 'nav', { view: 'contact' })}
        </div>
        <div style="margin-top:18px;font-family:var(--ww-font-mono);font-size:11px;color:var(--ww-steel-700);letter-spacing:0.04em;max-width:460px">
          ${esc(t('hero_disclaimer'))}
        </div>
      </div>
      <div class="ww-hero-specimen">
        <div class="ww-hero-specimen-loco">${locoSpecimen('classic')}</div>
        <div style="position:absolute;bottom:12px;right:12px;font-family:var(--ww-font-mono);font-size:10px;color:var(--ww-brass);letter-spacing:0.18em">
          ${esc(t('hero_specimen_caption'))}
        </div>
      </div>
    </div>
  </section>`;
}

function linesShowcase() {
  const lines = [
    { id: 'classic',   pn: 'Linie I',   titleKey: 'line_classic_title',   descKey: 'line_classic_desc',   metaMaterial: 'line_classic_meta',   price: '€12 / set' },
    { id: 'modernist', pn: 'Linie II',  titleKey: 'line_modernist_title', descKey: 'line_modernist_desc', metaMaterial: 'line_modernist_meta', price: '€10 / set' },
    { id: 'voyager',   pn: 'Linie III', titleKey: 'line_voyager_title',   descKey: 'line_voyager_desc',   metaMaterial: 'line_voyager_meta',   price: '€15 / set' },
  ];
  return `
  <section class="ww-section">
    <div class="container">
      <div class="ww-section-header">
        <div>
          ${eyebrow(t('lines_eyebrow'))}
          <h2>${esc(t('lines_title'))}</h2>
        </div>
        ${spec(t('lines_subline'))}
      </div>
      <div class="ww-lines">
        ${lines.map(l => `
          <div class="ww-line ${l.id}" data-action="configure" data-line="${l.id}">
            <div>
              <div class="pn">${esc(l.pn)} · WW-${l.id.slice(0, 3).toUpperCase()}</div>
              <h3>${esc(t(l.titleKey))}</h3>
              <p class="desc">${esc(t(l.descKey))}</p>
            </div>
            <div style="margin-top:24px">
              ${locoSpecimen(l.id, 0.7)}
              <div class="meta" style="margin-top:16px">
                <span>· ${esc(t(l.metaMaterial))}</span>
                <span>· ${esc(t('meta_unpainted'))}</span>
                <span>· ${esc(l.price)}</span>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function replacementsBand() {
  return `
  <section class="ww-band">
    <div class="container">
      <div class="ww-band-inner">
        <div>
          ${eyebrow(t('repl_eyebrow'))}
          <h2>${esc(t('repl_h2_a'))} <span class="red">${esc(t('repl_h2_b'))}</span></h2>
        </div>
        <div>
          <p>${esc(t('repl_body'))}</p>
          <div style="margin-top:24px;display:flex;gap:12px">
            ${btn('primary', esc(t('repl_cta')), 'nav', { view: 'contact' })}
            ${btn('ghost', esc(t('repl_cta2')), 'nav', { view: 'about' })}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function serviceIcon(kind) {
  switch (kind) {
    case 'print':   return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="4" y="4" width="16" height="11"/><rect x="7" y="15" width="10" height="6"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="17" cy="7" r="0.8" fill="currentColor"/></svg>`;
    case 'ship':    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`;
    case 'stl':     return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z"/><path d="M4 8 L12 12 L20 8"/><line x1="12" y1="12" x2="12" y2="20"/></svg>`;
    case 'replace': return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><rect x="3" y="7" width="18" height="13"/><line x1="3" y1="11" x2="21" y2="11"/><path d="M9 7 L9 4 L15 4 L15 7"/></svg>`;
    case 'paint':   return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M5 4 L19 4 L19 10 L13 10 L13 14 L11 14 L11 20 L13 20"/><line x1="5" y1="4" x2="5" y2="10"/><line x1="5" y1="10" x2="19" y2="10"/></svg>`;
  }
  return '';
}

function servicesStrip() {
  const services = [
    { pn: '§ 01', kind: 'print',    titleKey: 'svc_print_title',   descKey: 'svc_print_desc' },
    { pn: '§ 02', kind: 'stl',      titleKey: 'svc_stl_title',     descKey: 'svc_stl_desc' },
    { pn: '§ 03', kind: 'replace',  titleKey: 'svc_replace_title', descKey: 'svc_replace_desc' },
    { pn: '§ 04', kind: 'paint',    titleKey: 'svc_paint_title',   descKey: 'svc_paint_desc' },
    { pn: '§ 05', kind: 'ship',     titleKey: 'svc_ship_title',    descKey: 'svc_ship_desc' },
  ];
  return `
  <section class="ww-section" style="padding-top:0">
    <div class="container">
      <div class="ww-services">
        ${services.map(s => `
          <div class="ww-service">
            <div class="ww-service-icon">${serviceIcon(s.kind)}</div>
            <div>
              <div class="ww-service-pn">${esc(s.pn)}</div>
              <div class="ww-service-title">${esc(t(s.titleKey))}</div>
              <div class="ww-service-desc">${esc(t(s.descKey))}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function notifyBand() {
  const n = state.notify;
  return `
  <section class="ww-notify" id="notify">
    <div class="container">
      <div class="ww-notify-inner">
        <div>
          ${eyebrow(t('notify_eyebrow'))}
          <h2>
            ${esc(t('notify_h2_a'))}
            <span class="accent">${esc(t('notify_h2_accent'))}</span>
          </h2>
          <p>${esc(t('notify_body'))}</p>
          <div class="ww-notify-meta">
            <span>${esc(t('notify_meta1'))}</span>
            <span>${esc(t('notify_meta2'))}</span>
            <span>${esc(t('notify_meta3'))}</span>
          </div>
        </div>
        <div>
          ${n.submitted ? `
            <div class="ww-notify-thanks">
              <div class="ww-notify-thanks-glyph">№${n.count}</div>
              <div>
                <h3>${esc(t('notify_thanks_h'))}</h3>
                <p>${esc(t('notify_thanks_b'))}</p>
              </div>
            </div>` : `
            <form class="ww-notify-form" data-action="notify-submit">
              <div class="stamp">Pre-Queue</div>
              <div class="ww-notify-form-pn">
                <span>FORMULAR · WW-Q · NOTIFY</span>
                <span>№ ${n.count + (n.email ? 1 : 0)}</span>
              </div>
              ${label(t('contact_email'))}
              <div class="ww-notify-row">
                <input type="email" class="ww-input" name="notifyEmail"
                       placeholder="${esc(t('notify_placeholder'))}"
                       value="${esc(n.email)}"
                       ${n.error ? 'style="border-color:var(--ww-signal)"' : ''} required>
                <button class="ww-btn ww-btn-primary" type="submit">${esc(t('notify_cta'))} →</button>
              </div>
              <div class="ww-notify-tiny">
                ${n.error
                  ? `<span style="color:var(--ww-signal)">· ${esc(n.error)} ·</span>`
                  : '<span>· DSGVO-konform · gespeichert auf einem Laptop in Berlin ·</span>'}
              </div>
            </form>`}
          <div class="ww-notify-counter">${esc(t('notify_count'))}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function makerStory() {
  return `
  <section class="ww-section ww-maker">
    <div class="container">
      <div class="ww-maker-grid">
        <div class="ww-maker-portrait">
          <div class="ww-plate copper">
            ${rivets()}
            <div style="aspect-ratio:4/5;background:linear-gradient(180deg,#f3ead4 0%,#d6c79a 100%);display:flex;align-items:flex-end;justify-content:center;padding:24px;position:relative">
              <div style="position:absolute;inset:24px;border:1px dashed rgba(94,56,24,0.4)"></div>
              <svg viewBox="0 0 200 240" style="width:85%;height:auto" aria-hidden="true">
                <g fill="none" stroke="#5e3818" stroke-width="1.6" stroke-linecap="round">
                  <circle cx="100" cy="60" r="22"/>
                  <path d="M78 86 L78 150 L122 150 L122 86"/>
                  <path d="M122 100 L150 110 L160 130"/>
                  <rect x="148" y="118" width="22" height="10"/>
                  <circle cx="153" cy="130" r="2"/>
                  <circle cx="166" cy="130" r="2"/>
                  <rect x="40" y="160" width="120" height="50"/>
                  <line x1="60" y1="160" x2="60" y2="210"/>
                  <line x1="140" y1="160" x2="140" y2="210"/>
                  <rect x="80" y="170" width="40" height="30"/>
                  <line x1="20" y1="210" x2="180" y2="210"/>
                </g>
                <text x="100" y="232" text-anchor="middle"
                  font-family="JetBrains Mono, monospace" font-size="9"
                  fill="#5e3818" letter-spacing="2">${esc(t('portrait_age'))}</text>
              </svg>
            </div>
          </div>
          <div style="margin-top:12px;font-family:var(--ww-font-mono);font-size:10px;color:var(--ww-copper-dark);letter-spacing:0.18em;text-align:center">
            ${esc(t('portrait_caption'))}
          </div>
        </div>
        <div>
          ${eyebrow(t('maker_eyebrow'))}
          <h2 class="ww-maker-title">
            ${esc(t('maker_title_a'))}<br>
            ${esc(t('maker_title_b'))} <span class="accent">${esc(t('maker_title_accent'))}</span><br>
            ${esc(t('maker_title_c'))}
          </h2>
          <p class="ww-maker-lede">${esc(t('maker_lede'))}</p>
          <div class="ww-maker-stats">
            <div><div class="num">2026</div><div class="lbl">${esc(t('maker_stat_year'))}</div></div>
            <div><div class="num">1</div><div class="lbl">${esc(t('maker_stat_printers'))}</div></div>
            <div><div class="num">12</div><div class="lbl">${esc(t('maker_stat_models'))}</div></div>
          </div>
          <p class="ww-maker-handline">${esc(t('maker_handline'))}</p>
          <p class="ww-maker-quote">${esc(t('maker_quote'))}</p>
        </div>
      </div>
    </div>
  </section>`;
}

function careBand() {
  return `
  <section class="ww-care">
    <div class="container">
      <div class="ww-care-inner">
        <div>
          ${eyebrow(t('care_eyebrow'))}
          <h2>${esc(t('care_h2_a'))} <span class="patina">${esc(t('care_h2_accent'))}</span></h2>
        </div>
        <div>
          <p>${esc(t('care_body'))}</p>
          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
            ${btn('primary', esc(t('care_cta')), 'nav', { view: 'contact' })}
            ${btn('ghost', esc(t('care_cta2')), 'nav', { view: 'about' })}
          </div>
          <div style="margin-top:18px;font-family:var(--ww-font-mono);font-size:11px;letter-spacing:0.04em;color:rgba(255,255,255,0.78)">
            ${esc(t('care_count'))}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function werkblog() {
  const posts = [
    { pn: 'Eintrag 014', date: '24 · IV · 2026', titleKey: 'blog_p1_title', tagKey: 'blog_p1_tag', descKey: 'blog_p1_desc' },
    { pn: 'Eintrag 013', date: '11 · IV · 2026', titleKey: 'blog_p2_title', tagKey: 'blog_p2_tag', descKey: 'blog_p2_desc' },
    { pn: 'Eintrag 012', date: '02 · IV · 2026', titleKey: 'blog_p3_title', tagKey: 'blog_p3_tag', descKey: 'blog_p3_desc' },
  ];
  return `
  <section class="ww-section">
    <div class="container">
      <div class="ww-section-header">
        <div>
          ${eyebrow(t('blog_eyebrow'))}
          <h2>${esc(t('blog_title'))}</h2>
        </div>
        <a class="ww-blog-all" data-action="nav" data-view="blog">${esc(t('blog_all'))}</a>
      </div>
      <div class="ww-blog-grid">
        ${posts.map(p => `
          <article class="ww-blog-card" data-action="nav" data-view="blog">
            <div class="ww-blog-meta">
              <span class="pn">${esc(p.pn)}</span>
              <span class="date">${esc(p.date)}</span>
            </div>
            ${badge('brass', t(p.tagKey))}
            <h3 class="ww-blog-title">${esc(t(p.titleKey))}</h3>
            <p class="ww-blog-desc">${esc(t(p.descKey))}</p>
            <div class="ww-blog-foot"><a>${esc(t('blog_read'))}</a></div>
          </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function catalog() {
  const items = [
    { pn: 'WW-A-0207', title: 'Steam Wagon Mk II',    line: 'classic',   price: '12,00', tag: 'Set of 5' },
    { pn: 'WW-A-0208', title: 'Tender No. 4',          line: 'classic',   price: '4,00',  tag: null },
    { pn: 'WW-A-0211', title: 'Pullman Set',           line: 'classic',   price: '14,00', tag: 'Set of 6' },
    { pn: 'WW-B-0044', title: 'ICE 4 Power Car',       line: 'modernist', price: '5,00',  tag: null },
    { pn: 'WW-B-0045', title: 'ICE 4 Full Set',        line: 'modernist', price: '18,00', tag: 'Set of 8' },
    { pn: 'WW-C-0019', title: 'Voyager Caravan',       line: 'voyager',   price: '15,00', tag: 'Glow' },
  ];
  return `
  <section class="ww-section">
    <div class="container">
      <div class="ww-section-header">
        <div>
          ${eyebrow(t('cat_eyebrow'))}
          <h2>${esc(t('cat_title'))}</h2>
        </div>
        ${spec(t('cat_showing'))}
      </div>
      <div class="ww-catalog">
        ${items.map(it => `
          <div class="ww-cat-card" data-action="configure" data-line="${it.line}">
            <div class="ww-cat-img">${locoSpecimen(it.line, 0.7)}</div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span class="ww-cat-pn">№ ${esc(it.pn)}</span>
              ${it.tag ? badge('brass', it.tag) : ''}
            </div>
            <div class="ww-cat-title">${esc(it.title)}</div>
            <div class="ww-cat-desc">${esc(t('cat_desc'))}</div>
            <div class="ww-cat-foot">
              <span class="ww-cat-price">€&nbsp;${esc(it.price)}</span>
              ${spec(t('cat_ships'))}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

// ===== Configurator =====
function configuratorView() {
  const cfg = state.cfg;
  const lineMeta = {
    classic:   { name: 'The Classic',    pn: 'WW-A-0207', basePrice: 12 },
    modernist: { name: 'The Modernist',  pn: 'WW-B-0044', basePrice: 10 },
    voyager:   { name: 'The Voyager',    pn: 'WW-C-0019', basePrice: 15 },
  }[cfg.line];
  const materialUp = { 'PLA': 0, 'Resin': 3, 'Glow PLA': 4 }[cfg.material] || 0;
  const qtyMul     = { 'Single': 0.25, 'Set of 5': 1, 'Set of 8': 1.6, 'Full game (45)': 4 }[cfg.quantity] || 1;
  const total = (lineMeta.basePrice + materialUp) * qtyMul;

  const opt = (group, value) => `<button class="ww-option ${cfg[group] === value ? 'selected' : ''}"
    data-action="cfg" data-group="${group}" data-value="${esc(value)}">${esc(value)}</button>`;

  return `
  <section class="ww-section">
    <div class="container">
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:24px">
        <a data-action="nav" data-view="home" style="cursor:pointer;font-family:var(--ww-font-display);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ww-copper)">← Back to catalog</a>
        ${spec(`№ ${lineMeta.pn}`)}
      </div>
      <div class="ww-config">
        <div class="ww-config-canvas">
          <div class="ww-config-corner tl">№ ${esc(lineMeta.pn)}</div>
          <div class="ww-config-corner tr">SHEET 01 / 03</div>
          <div class="ww-config-corner bl">SCALE · ${esc(cfg.scale)} 1:87</div>
          <div class="ww-config-corner br">UNPAINTED</div>
          <div style="width:85%">${locoSpecimen(cfg.line)}</div>
        </div>
        <div class="ww-spec-sheet">
          ${eyebrow(`Modell · ${lineMeta.pn}`)}
          <h2>${esc(lineMeta.name)}</h2>
          <div class="subtitle">3D-printed to order in Berlin · ships in 2–4 weeks · unpainted</div>

          ${label('Linie')}
          <div class="ww-options">${['classic','modernist','voyager'].map(v => opt('line', v)).join('')}</div>

          ${label('Scale')}
          <div class="ww-options">${['HO','N','OO','Custom'].map(v => opt('scale', v)).join('')}</div>

          ${label('Material')}
          <div class="ww-options">${['PLA','Resin','Glow PLA'].map(v => opt('material', v)).join('')}</div>

          ${label('Filament colour')}
          <div class="ww-options">${['Bone','Iron','Bronze','Signal-red','Patina','Glow-green'].map(v => opt('filament', v)).join('')}</div>

          ${label('Quantity')}
          <div class="ww-options">${['Single','Set of 5','Set of 8','Full game (45)'].map(v => opt('quantity', v)).join('')}</div>

          <div class="ww-spec-row"><span class="k">Lead time</span><span class="v">2–4 wks</span></div>
          <div class="ww-spec-row"><span class="k">Layer height</span><span class="v">0.05 mm</span></div>
          <div class="ww-spec-row"><span class="k">Finish</span><span class="v">Unpainted — your brush</span></div>
          <div class="ww-spec-row"><span class="k">Got your own STL?</span><span class="v">We print it · €8 / set</span></div>

          <div class="ww-price">
            <div>
              <div class="ww-label" style="margin-bottom:4px">Total</div>
              ${spec('incl. 19% MwSt. · paint not included')}
            </div>
            <div class="val">€&nbsp;${total.toFixed(2).replace('.', ',')}</div>
          </div>

          <div style="display:flex;gap:12px">
            ${btn('primary', 'Add to print queue', 'cfg-add')}
            ${btn('ghost', 'Send my STL instead', 'nav', { view: 'contact' })}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ===== Contact page =====
function contactView() {
  const c = state.contact;
  const topics = ['topic_replace', 'topic_commission', 'topic_stl', 'topic_bulk', 'topic_care', 'topic_other'];
  const errStyle = (cond) => cond ? 'style="border-color:var(--ww-signal)"' : '';

  const formMarkup = `
    <form class="ww-contact-form" data-action="contact-submit">
      <div class="ww-contact-form-head">
        <span>${esc(t('contact_form_pn'))}</span>
        <span>SHEET 01 / 01</span>
      </div>
      <div class="ww-field">
        <label>${esc(t('contact_topic'))}</label>
        <div class="ww-topic-grid">
          ${topics.map(k => `
            <button type="button" class="ww-option ${c.topic === k ? 'selected' : ''}"
              data-action="contact-topic" data-topic="${k}">${esc(t(k))}</button>`).join('')}
        </div>
      </div>
      <div class="ww-field-row">
        <div class="ww-field">
          <label>${esc(t('contact_name'))}</label>
          <input type="text" class="ww-input" name="name" value="${esc(c.name)}"
            ${errStyle(c.showErr && !c.name)}>
        </div>
        <div class="ww-field">
          <label>${esc(t('contact_email'))}</label>
          <input type="email" class="ww-input" name="email" value="${esc(c.email)}"
            ${errStyle(c.showErr && !c.email)}>
        </div>
      </div>
      <div class="ww-field">
        <label>${esc(t('contact_country'))}</label>
        <input type="text" class="ww-input" name="country" value="${esc(c.country)}"
          placeholder="Deutschland · Österreich · United Kingdom · …">
      </div>
      <div class="ww-field">
        <label>${esc(t('contact_message'))}</label>
        <textarea class="ww-textarea" name="message"
          placeholder="${esc(t('contact_message_ph'))}"
          ${errStyle(c.showErr && !c.message)}>${esc(c.message)}</textarea>
      </div>
      <label class="ww-consent">
        <input type="checkbox" name="consent" ${c.consent ? 'checked' : ''}>
        <span ${c.showErr && !c.consent ? 'style="color:var(--ww-signal)"' : ''}>
          ${esc(t('contact_consent'))}
        </span>
      </label>
      <div class="ww-contact-actions">
        <button class="ww-btn ww-btn-primary" type="submit">${esc(t('contact_send'))} →</button>
        <span class="ww-spec" style="font-size:12px">
          Reply within 2 working days · usually the same evening
        </span>
      </div>
    </form>`;

  const sentMarkup = `
    <div class="ww-contact-sent">
      <h3>${esc(t('contact_sent_h'))}</h3>
      <p>${esc(t('contact_sent_b'))}</p>
      ${btn('primary', esc(t('contact_sent_cta')), 'contact-reset')}
    </div>`;

  return `
  <section class="ww-contact-hero">
    <div class="container">
      <a class="ww-blogpage-back" data-action="nav" data-view="home">${esc(t('blog_back'))}</a>
      ${eyebrow(t('contact_eyebrow'))}
      <h1>${esc(t('contact_title'))}</h1>
      <p>${esc(t('contact_lede'))}</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="ww-contact-grid">
        ${c.sent ? sentMarkup : formMarkup}
        <div class="ww-contact-aside">
          <div class="ww-contact-card">
            <h4>${esc(t('contact_aside_h'))}</h4>
            <a class="em" href="mailto:${esc(t('contact_aside_email'))}">${esc(t('contact_aside_email'))}</a>
          </div>
          <div class="ww-contact-card">
            <h4>Werkstatt-Stunden</h4>
            <div class="hours">${esc(t('contact_aside_hours'))}</div>
            <div class="note">${esc(t('contact_aside_note'))}</div>
          </div>
          <div class="ww-contact-card" style="background:linear-gradient(180deg,#1A365D 0%,#112746 100%);border-color:#0a1a2e;color:#fff">
            <h4 style="color:var(--ww-brass-light)">Direct lines</h4>
            <div style="font-family:var(--ww-font-mono);font-size:13px;line-height:1.85;color:rgba(255,255,255,0.92)">
              Replacements →&nbsp;&nbsp;<span style="color:var(--ww-brass-light)">ersatz@wandergeek.org</span><br>
              Commissions →&nbsp;<span style="color:var(--ww-brass-light)">auftrag@wandergeek.org</span><br>
              Care &amp; access →&nbsp;<span style="color:var(--ww-brass-light)">pflege@wandergeek.org</span><br>
              Press →&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--ww-brass-light)">presse@wandergeek.org</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ===== Blog page =====
function blogView() {
  const posts = [
    { pn: 'Eintrag 014', date: '24 · IV · 2026', titleKey: 'blog_p1_title', tagKey: 'blog_p1_tag', tag: 'print',  descKey: 'blog_p1_desc', minutes: 6, line: 'classic' },
    { pn: 'Eintrag 013', date: '11 · IV · 2026', titleKey: 'blog_p2_title', tagKey: 'blog_p2_tag', tag: 'model',  descKey: 'blog_p2_desc', minutes: 8, line: 'modernist' },
    { pn: 'Eintrag 012', date: '02 · IV · 2026', titleKey: 'blog_p3_title', tagKey: 'blog_p3_tag', tag: 'werk',   descKey: 'blog_p3_desc', minutes: 5, line: 'classic' },
    { pn: 'Eintrag 011', date: '20 · III · 2026', titleKey: 'blog_p4_title', tagKey: 'blog_p4_tag', tag: 'print', descKey: 'blog_p4_desc', minutes: 7, line: 'modernist' },
    { pn: 'Eintrag 010', date: '06 · III · 2026', titleKey: 'blog_p5_title', tagKey: 'blog_p5_tag', tag: 'werk',  descKey: 'blog_p5_desc', minutes: 9, line: 'classic' },
    { pn: 'Eintrag 009', date: '21 · II · 2026',  titleKey: 'blog_p6_title', tagKey: 'blog_p6_tag', tag: 'ship',  descKey: 'blog_p6_desc', minutes: 4, line: 'voyager' },
    { pn: 'Eintrag 008', date: '07 · II · 2026',  titleKey: 'blog_p7_title', tagKey: 'blog_p7_tag', tag: 'model', descKey: 'blog_p7_desc', minutes: 6, line: 'classic' },
  ];
  const filters = [
    { id: 'all',   key: 'blog_filter_all' },
    { id: 'print', key: 'blog_filter_print' },
    { id: 'model', key: 'blog_filter_model' },
    { id: 'werk',  key: 'blog_filter_werk' },
    { id: 'ship',  key: 'blog_filter_ship' },
  ];
  const filtered = state.blogFilter === 'all' ? posts : posts.filter(p => p.tag === state.blogFilter);
  const feature = filtered[0];
  const rest = filtered.slice(1);

  return `
  <section class="ww-blogpage-hero">
    <div class="container">
      <a class="ww-blogpage-back" data-action="nav" data-view="home">${esc(t('blog_back'))}</a>
      ${eyebrow(t('blogpage_eyebrow'))}
      <h1>${esc(t('blogpage_title'))}</h1>
      <p>${esc(t('blogpage_lede'))}</p>
      <div class="ww-blogpage-filters">
        ${filters.map(f => `
          <button class="ww-option ${state.blogFilter === f.id ? 'selected' : ''}"
            data-action="blog-filter" data-filter="${f.id}">${esc(t(f.key))}</button>`).join('')}
      </div>
    </div>
  </section>
  <section class="container" style="padding-top:0">
    ${feature ? `
      <article class="ww-blogpage-feature">
        <div class="ww-blogpage-feature-img">
          <div style="width:78%">${locoSpecimen(feature.line)}</div>
        </div>
        <div class="ww-blogpage-feature-body">
          ${badge('signal', 'Latest')}
          <div class="ww-blogpage-feature-meta">
            <span>${esc(feature.pn)}</span>
            <span>${esc(feature.date)}</span>
            <span>${feature.minutes} ${esc(t('blog_minutes'))}</span>
            <span>${esc(t(feature.tagKey))}</span>
          </div>
          <h2>${esc(t(feature.titleKey))}</h2>
          <p>${esc(t(feature.descKey))}</p>
          <div style="margin-top:12px">
            ${btn('ghost', `${esc(t('blog_read_full'))} →`, '')}
          </div>
        </div>
      </article>` : ''}
    <div class="ww-blogpage-grid thirds">
      ${rest.map(p => `
        <article class="ww-blog-card">
          <div class="ww-blog-meta">
            <span class="pn">${esc(p.pn)}</span>
            <span class="date">${esc(p.date)}</span>
          </div>
          ${badge('brass', t(p.tagKey))}
          <h3 class="ww-blog-title">${esc(t(p.titleKey))}</h3>
          <p class="ww-blog-desc">${esc(t(p.descKey))}</p>
          <div class="ww-blog-foot">
            <span>${p.minutes} ${esc(t('blog_minutes'))}</span> · <a>${esc(t('blog_read'))}</a>
          </div>
        </article>`).join('')}
    </div>
    <div class="ww-blogpage-subscribe">
      <div>
        <h3>${esc(t('blog_subscribe_h'))}</h3>
        <p>${esc(t('blog_subscribe_b'))}</p>
      </div>
      ${btn('primary', 'RSS · Atom · E-Mail →', 'nav', { view: 'contact' })}
    </div>
  </section>`;
}

// ===== About page =====
function aboutView() {
  const pillars = [
    { pn: '§ 01', hKey: 'about_pillar1_h', bKey: 'about_pillar1_b' },
    { pn: '§ 02', hKey: 'about_pillar2_h', bKey: 'about_pillar2_b' },
    { pn: '§ 03', hKey: 'about_pillar3_h', bKey: 'about_pillar3_b' },
    { pn: '§ 04', hKey: 'about_pillar4_h', bKey: 'about_pillar4_b' },
  ];
  const detail = [
    { hKey: 'about_h_what', bKey: 'about_b_what' },
    { hKey: 'about_h_how',  bKey: 'about_b_how' },
    { hKey: 'about_h_why',  bKey: 'about_b_why' },
    { hKey: 'about_h_who',  bKey: 'about_b_who' },
  ];
  const timeline = [
    { yKey: 'about_t1_y', tKey: 'about_t1_t', bKey: 'about_t1_b' },
    { yKey: 'about_t2_y', tKey: 'about_t2_t', bKey: 'about_t2_b' },
    { yKey: 'about_t3_y', tKey: 'about_t3_t', bKey: 'about_t3_b' },
    { yKey: 'about_t4_y', tKey: 'about_t4_t', bKey: 'about_t4_b' },
  ];
  return `
  <section class="ww-about-hero">
    <div class="container">
      <a class="ww-blogpage-back" data-action="nav" data-view="home">${esc(t('blog_back'))}</a>
      ${eyebrow(`№ 00 ${t('about_eyebrow')}`)}
      <h1>
        ${esc(t('about_title_a'))} <span class="accent">${esc(t('about_title_b'))}</span> ${esc(t('about_title_c'))}
      </h1>
      <p>${esc(t('about_lede'))}</p>
    </div>
  </section>
  <section class="container">
    <div class="ww-about-pillars">
      ${pillars.map(p => `
        <div class="ww-about-pillar">
          <span class="pn">${esc(p.pn)}</span>
          <h4>${esc(t(p.hKey))}</h4>
          <p>${esc(t(p.bKey))}</p>
        </div>`).join('')}
    </div>
  </section>
  <section class="ww-about-detail">
    <div class="container">
      <div class="ww-about-detail-grid">
        ${detail.map(d => `
          <div class="ww-about-block">
            <h3>${esc(t(d.hKey))}</h3>
            <p>${esc(t(d.bKey))}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>
  <section class="ww-about-timeline">
    <div class="container">
      <h2 class="ww-about-timeline-h">${esc(t('about_timeline_h'))}</h2>
      <div class="ww-about-rail">
        ${timeline.map(s => `
          <div class="ww-about-rail-step">
            <div class="y">№ ${esc(t(s.yKey))}</div>
            <h5>${esc(t(s.tKey))}</h5>
            <p>${esc(t(s.bKey))}</p>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:12px;margin-top:56px">
        ${btn('primary', 'Write to the workshop →', 'nav', { view: 'contact' })}
        ${btn('ghost', 'Browse the catalog', 'nav', { view: 'home' })}
      </div>
    </div>
  </section>`;
}

// ===== Render =====
function render() {
  let body = '';
  if (state.view === 'home') {
    body = hero() + linesShowcase() + servicesStrip() + replacementsBand() +
           notifyBand() + makerStory() + careBand() + werkblog() + catalog();
  } else if (state.view === 'config') {
    body = configuratorView();
  } else if (state.view === 'about') {
    body = aboutView();
  } else if (state.view === 'blog') {
    body = blogView();
  } else if (state.view === 'contact') {
    body = contactView();
  }
  document.getElementById('root').innerHTML = header() + body + footer();
  // restore field focus state if a form was rendered
  rebindLiveFields();
}

// Keep contact + notify live values without re-render flicker
function rebindLiveFields() {
  // Notify form: capture email keystrokes locally so we don't re-render every keystroke
  const notifyForm = document.querySelector('form[data-action="notify-submit"]');
  if (notifyForm) {
    const input = notifyForm.querySelector('input[name="notifyEmail"]');
    if (input) {
      input.addEventListener('input', (e) => { state.notify.email = e.target.value; state.notify.error = ''; });
    }
  }
  const contactForm = document.querySelector('form[data-action="contact-submit"]');
  if (contactForm) {
    const map = ['name', 'email', 'country', 'message'];
    map.forEach((field) => {
      const el = contactForm.querySelector(`[name="${field}"]`);
      if (el) el.addEventListener('input', (e) => { state.contact[field] = e.target.value; });
    });
    const consent = contactForm.querySelector('[name="consent"]');
    if (consent) consent.addEventListener('change', (e) => { state.contact.consent = e.target.checked; });
  }
}

// ===== Routing helpers =====
function navigate(view) {
  if (view === 'replace') {
    state.view = 'home';
    render();
    setTimeout(() => {
      const el = document.querySelector('.ww-band');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return;
  }
  state.view = view;
  render();
  try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
}

// ===== Submit handlers =====
async function submitNotify(e) {
  e.preventDefault();
  const email = state.notify.email.trim();
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    state.notify.error = 'bitte gültige E-Mail · valid email please';
    render();
    return;
  }
  try {
    const r = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (r.ok) {
      const data = await r.json();
      state.notify.submitted = true;
      state.notify.count = data.count || state.notify.count;
    } else {
      state.notify.error = 'Server error · please try again';
    }
  } catch (err) {
    state.notify.error = 'Network error · please try again';
  }
  render();
}

async function submitContact(e) {
  e.preventDefault();
  const c = state.contact;
  if (!c.name || !c.email || !c.message || !c.consent) {
    state.contact.showErr = true;
    render();
    return;
  }
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: c.topic, name: c.name, email: c.email,
        country: c.country, message: c.message,
      }),
    });
    if (r.ok) {
      state.contact.sent = true;
      state.contact.showErr = false;
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (er) {}
    }
  } catch (err) {
    // soft-fail still shows confirmation since spec uses optimistic flow
    state.contact.sent = true;
  }
  render();
}

function resetContact() {
  state.contact = { topic: 'topic_replace', name: '', email: '', country: '', message: '', consent: false, sent: false, showErr: false };
  render();
}

// ===== Global event delegation =====
document.addEventListener('click', (e) => {
  const btnEl = e.target.closest('[data-action]');
  if (!btnEl) return;
  const action = btnEl.dataset.action;
  if (action === 'nav') {
    navigate(btnEl.dataset.view);
  } else if (action === 'lang') {
    Lang.set(btnEl.dataset.lang);
    render();
  } else if (action === 'configure') {
    state.cfg.line = btnEl.dataset.line || 'classic';
    navigate('config');
  } else if (action === 'cfg') {
    state.cfg[btnEl.dataset.group] = btnEl.dataset.value;
    render();
  } else if (action === 'cfg-add') {
    const cfg = state.cfg;
    const lineMeta = {
      classic:   { name: 'The Classic',    pn: 'WW-A-0207', basePrice: 12 },
      modernist: { name: 'The Modernist',  pn: 'WW-B-0044', basePrice: 10 },
      voyager:   { name: 'The Voyager',    pn: 'WW-C-0019', basePrice: 15 },
    }[cfg.line];
    const materialUp = { 'PLA': 0, 'Resin': 3, 'Glow PLA': 4 }[cfg.material] || 0;
    const qtyMul     = { 'Single': 0.25, 'Set of 5': 1, 'Set of 8': 1.6, 'Full game (45)': 4 }[cfg.quantity] || 1;
    const total = (lineMeta.basePrice + materialUp) * qtyMul;
    state.cart.push({ ...lineMeta, total, ...cfg });
    navigate('home');
  } else if (action === 'blog-filter') {
    state.blogFilter = btnEl.dataset.filter;
    render();
  } else if (action === 'contact-topic') {
    state.contact.topic = btnEl.dataset.topic;
    render();
  } else if (action === 'contact-reset') {
    resetContact();
  }
});

document.addEventListener('submit', (e) => {
  const f = e.target;
  if (!f.dataset || !f.dataset.action) return;
  if (f.dataset.action === 'notify-submit') submitNotify(e);
  else if (f.dataset.action === 'contact-submit') submitContact(e);
});

// ===== Boot =====
render();
