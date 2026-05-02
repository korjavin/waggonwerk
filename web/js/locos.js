// locos.js — three locomotive specimen silhouettes as SVG strings

function steamLoco(body, stroke) {
  body = body || '#B87333'; stroke = stroke || '#C9A961';
  return `
  <svg viewBox="0 0 400 160" style="width:100%;max-width:420px" aria-hidden="true">
    <g fill="${body}">
      <rect x="0" y="135" width="400" height="3"/>
      <rect x="80" y="62" width="180" height="48" rx="2"/>
      <rect x="260" y="44" width="70" height="66"/>
      <rect x="266" y="50" width="22" height="22" fill="#fff" opacity="0.15"/>
      <rect x="294" y="50" width="22" height="22" fill="#fff" opacity="0.15"/>
      <path d="M40 110 L80 110 L80 76 Z"/>
      <rect x="106" y="20" width="14" height="42"/>
      <rect x="100" y="14" width="26" height="8"/>
      <rect x="98" y="10" width="30" height="6"/>
      <ellipse cx="170" cy="58" rx="14" ry="8"/>
      <rect x="156" y="58" width="28" height="6"/>
      <ellipse cx="210" cy="60" rx="10" ry="6"/>
      <rect x="80" y="68" width="12" height="14"/>
    </g>
    <g fill="none" stroke="${stroke}" stroke-width="1.2">
      <line x1="120" y1="62" x2="120" y2="110"/>
      <line x1="150" y1="62" x2="150" y2="110"/>
      <line x1="200" y1="62" x2="200" y2="110"/>
      <line x1="230" y1="62" x2="230" y2="110"/>
    </g>
    <g fill="${body}">
      <circle cx="120" cy="120" r="20"/>
      <circle cx="180" cy="120" r="20"/>
      <circle cx="240" cy="120" r="20"/>
      <circle cx="80" cy="124" r="12"/>
    </g>
    <g fill="none" stroke="${stroke}" stroke-width="1.5">
      <circle cx="120" cy="120" r="10"/>
      <circle cx="180" cy="120" r="10"/>
      <circle cx="240" cy="120" r="10"/>
      <circle cx="80" cy="124" r="6"/>
      <line x1="120" y1="120" x2="240" y2="120"/>
      <circle cx="120" cy="120" r="2.5" fill="${stroke}"/>
      <circle cx="180" cy="120" r="2.5" fill="${stroke}"/>
      <circle cx="240" cy="120" r="2.5" fill="${stroke}"/>
    </g>
    <g fill="${stroke}" opacity="0.5">
      <circle cx="118" cy="6" r="6"/>
      <circle cx="130" cy="2" r="4"/>
      <circle cx="142" cy="6" r="5"/>
    </g>
  </svg>`;
}

function berlinerLoco(body, stroke, accent) {
  body = body || '#FAFAF3'; stroke = stroke || '#1A1A1A'; accent = accent || '#C50F1F';
  return `
  <svg viewBox="0 0 400 160" style="width:100%;max-width:420px" aria-hidden="true">
    <rect x="0" y="138" width="400" height="2" fill="${stroke}"/>
    <g fill="${body}"><rect x="20" y="50" width="360" height="78"/></g>
    <rect x="20" y="86" width="360" height="14" fill="${accent}"/>
    <g fill="none" stroke="${stroke}" stroke-width="1.2">
      <rect x="100" y="58" width="36" height="62"/>
      <line x1="118" y1="58" x2="118" y2="120"/>
      <rect x="220" y="58" width="36" height="62"/>
      <line x1="238" y1="58" x2="238" y2="120"/>
    </g>
    <g fill="${accent}" opacity="0.85">
      <rect x="36" y="60" width="56" height="20"/>
      <rect x="146" y="60" width="64" height="20"/>
      <rect x="266" y="60" width="64" height="20"/>
      <rect x="338" y="60" width="36" height="20"/>
    </g>
    <g fill="${body}" stroke="${stroke}" stroke-width="1.2">
      <path d="M20 50 L20 128 L8 128 L8 60 Z"/>
    </g>
    <g fill="${accent}">
      <rect x="10" y="64" width="6" height="6"/>
      <rect x="10" y="78" width="6" height="6"/>
    </g>
    <g fill="none" stroke="${stroke}" stroke-width="1.6">
      <line x1="160" y1="50" x2="160" y2="36"/>
      <line x1="240" y1="50" x2="240" y2="36"/>
      <line x1="160" y1="36" x2="200" y2="22"/>
      <line x1="200" y1="22" x2="240" y2="36"/>
      <line x1="170" y1="20" x2="230" y2="20"/>
    </g>
    <line x1="0" y1="14" x2="400" y2="14" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="2 4"/>
    <rect x="170" y="106" width="60" height="14" fill="${body}" stroke="${stroke}"/>
    <text x="200" y="116" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="9" fill="${stroke}" letter-spacing="2">S-BAHN</text>
    <g fill="${body}" stroke="${stroke}" stroke-width="1.2">
      <rect x="50" y="124" width="68" height="10"/>
      <rect x="282" y="124" width="68" height="10"/>
    </g>
    <g fill="${stroke}">
      <circle cx="68" cy="134" r="8"/>
      <circle cx="100" cy="134" r="8"/>
      <circle cx="300" cy="134" r="8"/>
      <circle cx="332" cy="134" r="8"/>
    </g>
    <g fill="${body}">
      <circle cx="68" cy="134" r="3"/>
      <circle cx="100" cy="134" r="3"/>
      <circle cx="300" cy="134" r="3"/>
      <circle cx="332" cy="134" r="3"/>
    </g>
  </svg>`;
}

function shinkansenLoco(body, stroke, accent) {
  body = body || '#FFFFFF'; stroke = stroke || '#1A365D'; accent = accent || '#5B7B7A';
  return `
  <svg viewBox="0 0 400 160" style="width:100%;max-width:420px" aria-hidden="true">
    <rect x="0" y="138" width="400" height="2" fill="${stroke}"/>
    <g fill="${body}" stroke="${stroke}" stroke-width="1.4">
      <path d="M 6 110 Q 6 92, 30 80 Q 70 60, 130 56 L 380 56 Q 392 56, 392 70 L 392 122 Q 392 130, 384 130 L 14 130 Q 6 130, 6 122 Z"/>
    </g>
    <path d="M 12 96 Q 22 88, 50 84 Q 100 78, 140 78 L 388 78 L 388 92 L 12 92 Z" fill="${accent}" opacity="0.7"/>
    <rect x="40" y="98" width="348" height="3" fill="#C50F1F"/>
    <path d="M 18 86 Q 22 72, 44 66 Q 80 58, 110 58 L 110 86 Z" fill="${stroke}" opacity="0.85"/>
    <g fill="${stroke}" opacity="0.85">
      <rect x="130" y="64" width="22" height="10"/>
      <rect x="158" y="64" width="22" height="10"/>
      <rect x="186" y="64" width="22" height="10"/>
      <rect x="214" y="64" width="22" height="10"/>
      <rect x="242" y="64" width="22" height="10"/>
      <rect x="270" y="64" width="22" height="10"/>
      <rect x="298" y="64" width="22" height="10"/>
      <rect x="326" y="64" width="22" height="10"/>
      <rect x="354" y="64" width="22" height="10"/>
    </g>
    <circle cx="14" cy="106" r="3" fill="#C50F1F"/>
    <g>
      <rect x="335" y="106" width="40" height="16" fill="${stroke}"/>
      <text x="355" y="118" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="11" fill="${accent}">WW</text>
    </g>
    <g fill="none" stroke="${stroke}" stroke-width="1.2">
      <rect x="50" y="126" width="60" height="6"/>
      <rect x="290" y="126" width="60" height="6"/>
    </g>
    <g fill="${stroke}">
      <circle cx="68" cy="132" r="5"/>
      <circle cx="92" cy="132" r="5"/>
      <circle cx="308" cy="132" r="5"/>
      <circle cx="332" cy="132" r="5"/>
    </g>
    <g stroke="${accent}" stroke-width="1" opacity="0.5">
      <line x1="0" y1="38" x2="40" y2="38"/>
      <line x1="0" y1="46" x2="60" y2="46"/>
      <line x1="0" y1="54" x2="20" y2="54"/>
    </g>
  </svg>`;
}

function locoSpecimen(line, scale) {
  scale = scale || 1;
  const palettes = {
    classic:   ['#B87333', '#C9A961'],
    modernist: ['#FAFAF3', '#1A1A1A', '#C50F1F'],
    voyager:   ['#FFFFFF', '#1A365D', '#5B7B7A'],
  };
  const p = palettes[line] || palettes.classic;
  let svg;
  if (line === 'modernist')      svg = berlinerLoco(p[0], p[1], p[2]);
  else if (line === 'voyager')   svg = shinkansenLoco(p[0], p[1], p[2]);
  else                           svg = steamLoco(p[0], p[1]);
  return `<div style="width:100%;max-width:${420 * scale}px;display:block;margin:0 auto">${svg}</div>`;
}
