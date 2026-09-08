// app.js — vanilla JS WaggonWerk site (post-pivot: steampunk set + custom inquiries, USD, U.S. shipping)

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PRODUCTS = {
  single: { pn: 'WW-S-SET', title: 'The Steampunk Set', price: 28,  pieces: '1 SET · 45 PCS' },
  bundle: { pn: 'WW-S-BDL', title: '5-Set Bundle',      price: 110, pieces: '5 SETS · 225 PCS' },
};
const CUSTOM_EMPTY = { game: '', desc: '', link: '', dims: '', qty: '', budget: '', deadline: '', email: '', zip: '' };

// ===== state =====
const state = {
  view: 'home',
  qty: 'single',
  notify: { email: '', submitted: false, error: '' },
  contact: { topic: 'topic_order', email: '', message: '', sent: false, showErr: false, error: '' },
  custom: { f: { ...CUSTOM_EMPTY }, sent: false, showErr: false, error: '' },
};

// ===== atoms =====
const eyebrow = (s) => `<div class="ww-eyebrow">${esc(s)}</div>`;
const label = (s) => `<div class="ww-label">${esc(s)}</div>`;
const spec = (s) => `<span class="ww-spec">${esc(s)}</span>`;
const badge = (variant, s) => `<span class="ww-badge ${variant}">${esc(s)}</span>`;
const btn = (variant, label, action, extra) => {
  const a = action ? `data-action="${esc(action)}"` : 'type="submit"';
  const e = extra ? Object.entries(extra).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ') : '';
  return `<button class="ww-btn ww-btn-${variant}" ${a} ${e}>${label}</button>`;
};
const navBtn = (variant, label, view) => btn(variant, esc(label), 'nav', { view });
const back = () => `<a class="ww-blogpage-back" data-action="nav" data-view="home">${esc(t('back_home'))}</a>`;
const photo = (ph) => `<div class="ww-photo">${esc(ph)}</div>`;
const img = (name, alt) => `<img class="ww-render" src="/img/${name}.png" alt="${esc(alt)}" loading="lazy">`;
const RENDERS = { classic: 'steam-tank', modernist: 'modernist-head', voyager: 'voyager-loco' };
const errStyle = (cond) => cond ? 'style="border-color:var(--ww-signal)"' : '';
const errLine = (msg) => msg ? `<div class="ww-spec" style="color:var(--ww-signal);margin-bottom:12px">${esc(msg)}</div>` : '';

// ===== Header / Footer =====
function header() {
  const items = [
    { id: 'home',    label: t('nav_shop') },
    { id: 'config',  label: t('nav_config') },
    { id: 'custom',  label: t('nav_custom') },
    { id: 'about',   label: t('nav_about') },
    { id: 'contact', label: t('nav_contact') },
  ];
  return `
  <header class="ww-header">
    <div class="ww-header-inner">
      <a class="ww-wm" data-action="nav" data-view="home" style="cursor:pointer">WAGGON<span class="a">WERK</span></a>
      <nav class="ww-nav">
        ${items.map(it => `<a class="${state.view === it.id ? 'active' : ''}" data-action="nav" data-view="${it.id}">${esc(it.label)}</a>`).join('')}
      </nav>
      <div class="ww-cart" data-action="nav" data-view="config" style="cursor:pointer">USD</div>
    </div>
  </header>`;
}

function footer() {
  const li = (view, k) => `<li><a data-action="nav" data-view="${view}">${esc(t(k))}</a></li>`;
  return `
  <footer class="ww-footer">
    <div class="container">
      <div class="ww-footer-grid">
        <div>
          <div class="ww-wm" style="font-size:18px;margin-bottom:12px">WAGGON<span class="a">WERK</span></div>
          <p>${esc(t('foot_blurb'))}</p>
        </div>
        <div><h4>${esc(t('foot_h_shop'))}</h4><ul>${li('config', 'foot_li_set')}${li('config', 'foot_li_bundle')}${li('custom', 'foot_li_custom')}</ul></div>
        <div><h4>${esc(t('foot_h_workshop'))}</h4><ul>${li('about', 'foot_li_how')}${li('about', 'foot_li_about')}${li('contact', 'foot_li_contact')}</ul></div>
        <div><h4>${esc(t('foot_h_legal'))}</h4><ul>${li('legal', 'foot_li_privacy')}${li('legal', 'foot_li_terms')}${li('legal', 'foot_li_shipping')}</ul></div>
      </div>
      <div class="ww-footer-base">
        <div>${esc(t('foot_copy'))}</div>
        <div>${esc(t('foot_disclaimer'))}</div>
      </div>
    </div>
  </footer>`;
}

// ===== Homepage =====
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
          ${esc(t('hero_h1_c'))} <span class="accent">${esc(t('hero_h1_accent'))}</span>.
        </h1>
        <p class="ww-hero-lede">${esc(t('hero_lede'))}</p>
        <div class="ww-hero-cta">
          ${navBtn('primary', t('hero_cta_shop'), 'config')}
          ${navBtn('ghost', t('hero_cta_custom'), 'custom')}
        </div>
        <div style="margin-top:18px;font-family:var(--ww-font-mono);font-size:11px;color:var(--ww-steel-700);letter-spacing:0.04em;max-width:460px">
          ${esc(t('hero_disclaimer'))}
        </div>
      </div>
      <div class="ww-hero-specimen">
        <img class="ww-render ww-hero-render" src="/img/steam-loco.png" alt="${esc(t('hero_img_alt'))}">
        <div class="tag">${esc(t('hero_tag'))}</div>
      </div>
    </div>
  </section>`;
}

function linesShowcase() {
  const lines = [
    { id: 'classic',   code: 'STE', pn: 'Line I',   live: true,  titleKey: 'line_steampunk_title', descKey: 'line_steampunk_desc' },
    { id: 'modernist', code: 'MOD', pn: 'Line II',  live: false, titleKey: 'line_modernist_title', descKey: 'line_modernist_desc' },
    { id: 'voyager',   code: 'VOY', pn: 'Line III', live: false, titleKey: 'line_voyager_title',   descKey: 'line_voyager_desc' },
  ];
  return `
  <section class="ww-section">
    <div class="container">
      <div class="ww-section-header">
        <div>${eyebrow(t('lines_eyebrow'))}<h2>${esc(t('lines_title'))}</h2></div>
        ${spec(t('lines_subline'))}
      </div>
      <div class="ww-lines">
        ${lines.map(l => `
          <div class="ww-line ${l.id} ${l.live ? '' : 'ww-line-dev'}" ${l.live ? 'data-action="nav" data-view="config"' : ''}>
            <div>
              <div class="pn">${esc(l.pn)} · WW-${l.code}</div>
              <h3>${esc(t(l.titleKey))}</h3>
              <p class="desc">${esc(t(l.descKey))}</p>
            </div>
            <div style="margin-top:24px">
              <div class="ww-line-img">${img(RENDERS[l.id], t(l.titleKey))}</div>
              <div class="meta" style="margin-top:16px">
                ${l.live
                  ? `<span>· ${esc(t('line_steampunk_meta'))}</span><span>· $${PRODUCTS.single.price} / set</span><span style="color:var(--ww-copper)">· ${esc(t('line_shop'))}</span>`
                  : badge('brass', t('line_dev'))}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function howIcon(kind) {
  const s = 'width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"';
  if (kind === 'design') return `<svg ${s}><path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z"/><path d="M4 8 L12 12 L20 8"/><line x1="12" y1="12" x2="12" y2="20"/></svg>`;
  if (kind === 'print')  return `<svg ${s}><rect x="4" y="4" width="16" height="11"/><rect x="7" y="15" width="10" height="6"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="17" cy="7" r="0.8" fill="currentColor"/></svg>`;
  return `<svg ${s}><rect x="3" y="7" width="18" height="13"/><line x1="3" y1="11" x2="21" y2="11"/><path d="M9 7 L9 4 L15 4 L15 7"/></svg>`;
}

function howItWorks() {
  const steps = [
    { pn: '§ 01', kind: 'design', titleKey: 'hw1_title', descKey: 'hw1_desc' },
    { pn: '§ 02', kind: 'print',  titleKey: 'hw2_title', descKey: 'hw2_desc' },
    { pn: '§ 03', kind: 'ship',   titleKey: 'hw3_title', descKey: 'hw3_desc' },
  ];
  return `
  <section class="ww-section" style="padding-top:0">
    <div class="container">
      <div class="ww-section-header">
        <div>${eyebrow(t('hw_eyebrow'))}<h2>${esc(t('hw_title'))}</h2></div>
      </div>
      <div class="ww-services" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        ${steps.map(s => `
          <div class="ww-service">
            <div class="ww-service-icon">${howIcon(s.kind)}</div>
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

function customTeaser() {
  return `
  <section class="ww-band">
    <div class="container">
      <div class="ww-band-inner">
        <div>
          ${eyebrow(t('cust_eyebrow'))}
          <h2>${esc(t('cust_h2_a'))} <span class="red">${esc(t('cust_h2_b'))}</span></h2>
        </div>
        <div>
          <p>${esc(t('cust_body'))}</p>
          <div style="margin-top:24px;display:flex;gap:12px">${navBtn('primary', t('cust_cta'), 'custom')}</div>
        </div>
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
          <h2>${esc(t('notify_h2_a'))}<span class="accent">${esc(t('notify_h2_accent'))}</span></h2>
          <p>${esc(t('notify_body'))}</p>
          <div class="ww-notify-meta">
            <span>${esc(t('notify_meta1'))}</span><span>${esc(t('notify_meta2'))}</span><span>${esc(t('notify_meta3'))}</span>
          </div>
          <div class="ww-notify-preview">
            ${img('voyager-side', t('line_voyager_title'))}
            <span>${esc(t('notify_preview_cap'))}</span>
          </div>
        </div>
        <div>
          ${n.submitted ? `
            <div class="ww-notify-thanks">
              <div class="ww-notify-thanks-glyph">WW</div>
              <div><h3>${esc(t('notify_thanks_h'))}</h3><p>${esc(t('notify_thanks_b'))}</p></div>
            </div>` : `
            <form class="ww-notify-form" data-action="notify-submit">
              <div class="stamp">New Lines</div>
              <div class="ww-notify-form-pn"><span>FORM · WW-Q · NOTIFY</span></div>
              ${label(t('contact_email'))}
              <div class="ww-notify-row">
                <input type="email" class="ww-input" name="notifyEmail" placeholder="${esc(t('notify_placeholder'))}"
                       value="${esc(n.email)}" ${errStyle(n.error)} required>
                <button class="ww-btn ww-btn-primary" type="submit">${esc(t('notify_cta'))} →</button>
              </div>
              <div class="ww-notify-tiny">
                ${n.error
                  ? `<span style="color:var(--ww-signal)">· ${esc(n.error)} ·</span>`
                  : `<span>· ${esc(t('notify_meta2').toLowerCase())} · ${esc(t('notify_meta3').toLowerCase())} ·</span>`}
              </div>
            </form>`}
        </div>
      </div>
    </div>
  </section>`;
}

function catalog() {
  const items = [
    { ...PRODUCTS.single, qty: 'single', tag: '45 pcs',  img: 'steam-loco' },
    { ...PRODUCTS.bundle, qty: 'bundle', tag: '225 pcs', img: 'steam-chibi' },
  ];
  return `
  <section class="ww-section">
    <div class="container">
      <div class="ww-section-header">
        <div>${eyebrow(t('cat_eyebrow'))}<h2>${esc(t('cat_title'))}</h2></div>
        ${spec(t('cat_showing'))}
      </div>
      <div class="ww-catalog">
        ${items.map(it => `
          <div class="ww-cat-card" data-action="pick" data-qty="${it.qty}">
            <div class="ww-cat-img">${img(it.img, it.title)}</div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span class="ww-cat-pn">№ ${esc(it.pn)}</span>${badge('brass', it.tag)}
            </div>
            <div class="ww-cat-title">${esc(it.title)}</div>
            <div class="ww-cat-desc">${esc(t('cat_desc'))}</div>
            <div class="ww-cat-foot">
              <span class="ww-cat-price">$&nbsp;${it.price.toFixed(2)}</span>
              ${spec(t('cat_ships'))}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

// ===== Configurator =====
function configuratorView() {
  const isBundle = state.qty === 'bundle';
  const p = PRODUCTS[state.qty];
  const checkoutUrl = (window.WW_CHECKOUT && window.WW_CHECKOUT[state.qty]) || '#';
  const opt = (q, txt) => `<button class="ww-option ${state.qty === q ? 'selected' : ''}" data-action="qty" data-qty="${q}">${txt}</button>`;
  const row = (k, v) => `<div class="ww-spec-row"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  return `
  <section class="ww-section">
    <div class="container">
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:24px">
        <a data-action="nav" data-view="home" style="cursor:pointer;font-family:var(--ww-font-display);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ww-copper)">← Back to shop</a>
        ${spec(`№ ${p.pn}`)}
      </div>
      <div class="ww-config">
        <div class="ww-config-canvas">
          <div class="ww-config-corner tl">№ ${esc(p.pn)}</div>
          <div class="ww-config-corner tr">SHEET 01 / 01</div>
          <div class="ww-config-corner bl">${esc(p.pieces)}</div>
          <div class="ww-config-corner br">UNPAINTED PLA</div>
          <div class="ww-config-renders">
            ${['steam-loco', 'steam-tank', 'steam-chibi'].map(n => img(n, p.title)).join('')}
          </div>
        </div>
        <div class="ww-spec-sheet">
          ${eyebrow(`The Steampunk Set · ${p.pn}`)}
          <h2>${esc(p.title)}</h2>
          <div class="subtitle">compatible with Ticket to Ride · printed to order · unpainted</div>

          ${label('Quantity')}
          <div class="ww-options">
            ${opt('single', `1 set · 45 pcs · $${PRODUCTS.single.price}`)}
            ${opt('bundle', `5-set bundle · 225 pcs · $${PRODUCTS.bundle.price}`)}
          </div>

          ${label('Finish')}
          <div class="ww-options"><button class="ww-option selected" style="cursor:default">Unpainted — your brush</button></div>

          ${row('Pieces per set', '45 (fits standard train slots)')}
          ${row('Material', 'PLA')}
          ${row('Handling', '1–2 weeks')}
          ${row('Shipping', 'Tracked USPS · U.S. only')}

          <div class="ww-price">
            <div>
              <div class="ww-label" style="margin-bottom:4px">Total</div>
              ${spec('shipping calculated at checkout')}
            </div>
            <div class="val">$&nbsp;${p.price.toFixed(2)}</div>
          </div>

          <div style="display:flex;gap:12px;align-items:center">
            <a class="ww-btn ww-btn-primary" href="${esc(checkoutUrl)}" data-action="checkout" data-pn="${p.pn}" data-value="${p.price}">Checkout →</a>
            ${spec('Secure checkout via Stripe')}
          </div>
        </div>
      </div>
    </section>`;
}

// ===== Custom-piece inquiry =====
function customView() {
  const c = state.custom, f = c.f;
  const bad = (k) => errStyle(c.showErr && !f[k]);
  const field = (k, labelKey, type, ph, extra) => `
    <div class="ww-field">
      <label>${esc(t(labelKey))}</label>
      <input type="${type || 'text'}" class="ww-input" name="${k}" value="${esc(f[k])}" placeholder="${esc(ph || '')}" ${extra || ''} ${bad(k)}>
    </div>`;
  const form = `
    <form class="ww-contact-form" data-action="custom-submit">
      <div class="ww-contact-form-head"><span>${esc(t('custom_form_pn'))}</span><span>SHEET 01 / 01</span></div>
      ${field('game', 'custom_game', 'text', t('custom_game_ph'))}
      <div class="ww-field">
        <label>${esc(t('custom_desc'))}</label>
        <textarea class="ww-textarea" name="desc" placeholder="${esc(t('custom_desc_ph'))}" ${bad('desc')}>${esc(f.desc)}</textarea>
      </div>
      ${field('link', 'custom_link', 'url', t('custom_link_ph'))}
      <div class="ww-field-row">
        ${field('dims', 'custom_dims', 'text', t('custom_dims_ph'))}
        ${field('qty', 'custom_qty', 'text', 'e.g. 12')}
      </div>
      <div class="ww-field-row">
        ${field('budget', 'custom_budget', 'text', t('custom_budget_ph'))}
        ${field('deadline', 'custom_deadline', 'text', t('custom_deadline_ph'))}
      </div>
      <div class="ww-field-row">
        ${field('email', 'custom_email', 'email')}
        ${field('zip', 'custom_zip', 'text', 'e.g. 30301', 'inputmode="numeric"')}
      </div>
      ${errLine(c.error)}
      <div class="ww-contact-actions">
        <button class="ww-btn ww-btn-primary" type="submit">${esc(t('custom_send'))} →</button>
        <span class="ww-spec" style="font-size:12px">${esc(t('custom_reply'))}</span>
      </div>
    </form>`;
  const sent = `
    <div class="ww-contact-sent">
      <h3>${esc(t('custom_sent_h'))}</h3>
      <p>${esc(t('custom_sent_b'))}</p>
      ${btn('primary', esc(t('custom_sent_cta')), 'custom-reset')}
    </div>`;
  const card = (h, b, cls) => `<div class="ww-contact-card"><h4>${esc(t(h))}</h4><div class="${cls}">${esc(t(b))}</div></div>`;
  return `
  <section class="ww-contact-hero">
    <div class="container">
      ${back()}
      ${eyebrow(t('custom_eyebrow'))}
      <h1>${esc(t('custom_title'))}</h1>
      <p>${esc(t('custom_lede'))}</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="ww-contact-grid">
        ${c.sent ? sent : form}
        <div class="ww-contact-aside">
          ${card('custom_aside_price_h', 'custom_aside_price_b', 'hours')}
          ${card('custom_aside_review_h', 'custom_aside_review_b', 'note')}
          ${card('custom_aside_finish_h', 'custom_aside_finish_b', 'note')}
        </div>
      </div>
    </div>
  </section>`;
}

// ===== Contact =====
function contactView() {
  const c = state.contact;
  const topics = ['topic_order', 'topic_custom', 'topic_other'];
  const form = `
    <form class="ww-contact-form" data-action="contact-submit">
      <div class="ww-contact-form-head"><span>${esc(t('contact_form_pn'))}</span><span>SHEET 01 / 01</span></div>
      <div class="ww-field">
        <label>${esc(t('contact_topic'))}</label>
        <div class="ww-topic-grid">
          ${topics.map(k => `<button type="button" class="ww-option ${c.topic === k ? 'selected' : ''}" data-action="contact-topic" data-topic="${k}">${esc(t(k))}</button>`).join('')}
        </div>
        ${c.topic === 'topic_custom' ? `
          <div style="margin-top:10px;font-family:var(--ww-font-mono);font-size:12px;color:var(--ww-copper)">
            ${esc(t('contact_custom_hint'))}&nbsp;
            <a style="cursor:pointer;text-decoration:underline" data-action="nav" data-view="custom">${esc(t('contact_custom_link'))}</a>
          </div>` : ''}
      </div>
      <div class="ww-field">
        <label>${esc(t('contact_email'))}</label>
        <input type="email" class="ww-input" name="email" value="${esc(c.email)}" ${errStyle(c.showErr && !EMAIL_RE.test(c.email))}>
      </div>
      <div class="ww-field">
        <label>${esc(t('contact_message'))}</label>
        <textarea class="ww-textarea" name="message" placeholder="${esc(t('contact_message_ph'))}" ${errStyle(c.showErr && !c.message)}>${esc(c.message)}</textarea>
      </div>
      ${errLine(c.error)}
      <div class="ww-contact-actions">
        <button class="ww-btn ww-btn-primary" type="submit">${esc(t('contact_send'))} →</button>
        <span class="ww-spec" style="font-size:12px">${esc(t('contact_reply'))}</span>
      </div>
    </form>`;
  const sent = `
    <div class="ww-contact-sent">
      <h3>${esc(t('contact_sent_h'))}</h3>
      <p>${esc(t('contact_sent_b'))}</p>
      ${btn('primary', esc(t('contact_sent_cta')), 'contact-reset')}
    </div>`;
  return `
  <section class="ww-contact-hero">
    <div class="container">
      ${back()}
      ${eyebrow(t('contact_eyebrow'))}
      <h1>${esc(t('contact_title'))}</h1>
      <p>${esc(t('contact_lede'))}</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="ww-contact-grid">
        ${c.sent ? sent : form}
        <div class="ww-contact-aside">
          <div class="ww-contact-card">
            <h4>${esc(t('contact_aside_h'))}</h4>
            <a class="em" href="mailto:${esc(t('contact_aside_email'))}">${esc(t('contact_aside_email'))}</a>
            <div class="hours" style="margin-top:12px">${esc(t('contact_aside_hours'))}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ===== About =====
function aboutView() {
  const detail = [
    ['about_h_who', 'about_b_who'],
    ['about_h_how', 'about_b_how'],
    ['about_h_why_unpainted', 'about_b_why_unpainted'],
    ['about_h_why_slow', 'about_b_why_slow'],
  ];
  return `
  <section class="ww-about-hero">
    <div class="container">
      ${back()}
      ${eyebrow(t('about_eyebrow'))}
      <h1>${esc(t('about_title_a'))} <span class="accent">${esc(t('about_title_b'))}</span> ${esc(t('about_title_c'))}</h1>
      <p>${esc(t('about_lede'))}</p>
    </div>
  </section>
  <section class="container" style="padding-top:48px">
    <div class="ww-about-maker">
      <div class="ww-about-photo">
        ${photo(t('about_photo_ph'))}
        <div class="cap">${esc(t('about_photo_cap'))}</div>
      </div>
      <div class="ww-about-detail-grid" style="grid-template-columns:1fr">
        ${detail.map(([h, b]) => `<div class="ww-about-block"><h3>${esc(t(h))}</h3><p>${esc(t(b))}</p></div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:12px;margin:56px 0 80px">
      ${navBtn('primary', t('about_cta_custom'), 'custom')}
      ${navBtn('ghost', t('about_cta_shop'), 'config')}
    </div>
  </section>`;
}

// ===== Legal =====
function legalView() {
  const sections = [
    ['privacy', 'legal_privacy_h', 'legal_privacy_b'],
    ['terms', 'legal_terms_h', 'legal_terms_b'],
    ['shipping', 'legal_ship_h', 'legal_ship_b'],
    ['parts', 'legal_parts_h', 'legal_parts_b'],
    ['tm', 'legal_tm_h', 'legal_tm_b'],
  ];
  return `
  <section class="ww-contact-hero">
    <div class="container">
      ${back()}
      ${eyebrow(t('legal_eyebrow'))}
      <h1>${esc(t('legal_title'))}</h1>
    </div>
  </section>
  <section class="container ww-legal">
    ${sections.map(([id, h, b]) => `<div id="legal-${id}" class="ww-legal-block"><h3>${esc(t(h))}</h3><p>${esc(t(b))}</p></div>`).join('')}
  </section>`;
}

// ===== Render / routing =====
const VIEWS = {
  home: () => hero() + linesShowcase() + howItWorks() + customTeaser() + notifyBand() + catalog(),
  config: configuratorView,
  custom: customView,
  about: aboutView,
  contact: contactView,
  legal: legalView,
};

function render() {
  document.getElementById('root').innerHTML = header() + VIEWS[state.view]() + footer();
  bindLiveFields();
}

// Capture keystrokes into state so a re-render (topic click, error) doesn't lose input.
function bindLiveFields() {
  const bind = (formAction, target) => {
    const form = document.querySelector(`form[data-action="${formAction}"]`);
    if (!form) return;
    form.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', (e) => { target[e.target.name === 'notifyEmail' ? 'email' : e.target.name] = e.target.value; });
    });
  };
  bind('notify-submit', state.notify);
  bind('contact-submit', state.contact);
  bind('custom-submit', state.custom.f);
}

function navigate(view) {
  if (!VIEWS[view]) view = 'home';
  state.view = view;
  render();
  try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
  if (view === 'config') window.track('ViewContent', { content: 'steampunk-set' });
}

// ===== Submit handlers =====
async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('http ' + r.status);
  return r.json();
}

async function submitNotify(e) {
  e.preventDefault();
  const n = state.notify;
  if (!EMAIL_RE.test(n.email.trim())) { n.error = t('notify_err'); render(); return; }
  try {
    await post('/api/notify', { email: n.email.trim() });
    n.submitted = true; n.error = '';
    window.track('Lead', { form: 'notify' });
  } catch (err) {
    n.error = t('notify_err_net');
  }
  render();
}

async function submitContact(e) {
  e.preventDefault();
  const c = state.contact;
  if (!EMAIL_RE.test(c.email) || !c.message) { c.showErr = true; render(); return; }
  try {
    await post('/api/contact', { topic: c.topic, email: c.email, message: c.message });
    c.sent = true; c.showErr = false; c.error = '';
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (er) {}
  } catch (err) {
    c.error = t('err_net');
  }
  render();
}

async function submitCustom(e) {
  e.preventDefault();
  const c = state.custom, f = c.f;
  if (!f.game || !f.desc || !f.qty || !EMAIL_RE.test(f.email) || !f.zip) { c.showErr = true; render(); return; }
  try {
    await post('/api/request', f);
    c.sent = true; c.showErr = false; c.error = '';
    window.track('Lead', { form: 'custom_inquiry' });
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (er) {}
  } catch (err) {
    c.error = t('err_net');
  }
  render();
}

// ===== Event delegation =====
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const d = el.dataset;
  switch (d.action) {
    case 'nav': navigate(d.view); break;
    case 'pick': state.qty = d.qty; navigate('config'); break;
    case 'qty': state.qty = d.qty; render(); break;
    case 'checkout': window.track('InitiateCheckout', { pn: d.pn, value: Number(d.value), currency: 'USD' }); break; // link href does the navigation
    case 'contact-topic': state.contact.topic = d.topic; render(); break;
    case 'contact-reset': state.contact = { topic: 'topic_order', email: '', message: '', sent: false, showErr: false, error: '' }; render(); break;
    case 'custom-reset': state.custom = { f: { ...CUSTOM_EMPTY }, sent: false, showErr: false, error: '' }; render(); break;
  }
});

document.addEventListener('submit', (e) => {
  const a = e.target.dataset && e.target.dataset.action;
  if (a === 'notify-submit') submitNotify(e);
  else if (a === 'contact-submit') submitContact(e);
  else if (a === 'custom-submit') submitCustom(e);
});

// ===== Boot =====
render();
