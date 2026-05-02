# WaggonWerk

A one-boy manufaktur for custom 3D-printed Ticket to Ride wagons. Berlin · 2026.

This repository contains the WaggonWerk landing site — a self-sufficient,
single-binary web application built from a Claude Design handoff.

## Stack

- **Frontend**: HTML, CSS, vanilla JavaScript. No bundler, no Node, no React.
- **Backend**: Go (standard library only, zero third-party dependencies).
- **Container**: distroless image, single static binary, ~10 MB.

The Go binary embeds all static assets via `embed.FS`, so the runtime
container has no filesystem dependencies on the design files.

## Layout

```
.
├── main.go              # static server + /api/notify, /api/contact endpoints
├── go.mod
├── Dockerfile           # multi-stage, distroless runtime
└── web/
    ├── index.html
    ├── css/             # colors_and_type, styles, extras (verbatim from design)
    └── js/
        ├── i18n.js      # EN + DE translations
        ├── locos.js     # SVG locomotive specimens
        └── app.js       # routing + views + event handling
```

## Routes

Single-page app with five views, switched in JS without a backend round-trip:

- `home` — Hero · Lines · Services · Replacements · Notify · Maker · Care · Werkblog · Catalog
- `config` — Configurator (line / scale / material / filament / quantity → live total)
- `about` — About Felix / Manufaktur, pillars, detail blocks, Werkschronik timeline
- `blog` — Werkblog index with category filters and a feature card
- `contact` — Topic picker, contact form, three aside cards

## API

- `POST /api/notify` — `{ "email": "you@host" }` → `{ ok, count }`. Stores the
  address in `${DATA_DIR}/notify.json`.
- `POST /api/contact` — full contact form payload. Stores entries in
  `${DATA_DIR}/contact.json`.
- `GET /api/health` — liveness check.

## Run

```sh
go run .                       # local dev, serves on :8080
docker build -t waggonwerk .
docker run --rm -p 8080:8080 -v waggonwerk_data:/data waggonwerk
```

Open `http://localhost:8080`.

## Environment

- `PORT` — listen port (default `8080`)
- `DATA_DIR` — where notify + contact submissions are persisted
  (default `/data`; falls back to in-memory if not writable)
