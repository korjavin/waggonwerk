# WaggonWerk

Custom 3D-printed pieces for the games you already love. A steampunk train
set compatible with Ticket to Ride, plus custom pieces for any board game.
Printed and shipped from the U.S.

This repository contains the WaggonWerk storefront — a self-sufficient,
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
├── main.go              # static server + /api/notify, /api/contact, /api/request
├── go.mod
├── Dockerfile           # multi-stage, distroless runtime
└── web/
    ├── index.html
    ├── css/             # colors_and_type, styles, extras, pivot (from design)
    ├── img/             # 3D renders of the pieces (from models/renders, 900px)
    └── js/
        ├── i18n.js      # all site copy (EN only)
        └── app.js       # routing + views + event handling
```

## Routes

Single-page app with six views, switched in JS without a backend round-trip:

- `home` — Hero · Lines · How it works · Custom teaser · Notify · Catalog
- `config` — The steampunk set: 1 set / 5-set bundle → checkout link (`window.WW_CHECKOUT` in `index.html`)
- `custom` — Custom-piece inquiry form → `POST /api/request`
- `about` — The workshop: who, how, why unpainted, why 1–2 weeks
- `contact` — Topic picker + short form → `POST /api/contact`
- `legal` — Privacy, terms, shipping & returns, small-parts notice, trademarks

## API

- `POST /api/notify` — `{ "email": "you@host" }` → `{ ok, count }`. Stores the
  address in `${DATA_DIR}/notify.json`.
- `POST /api/contact` — `{ topic, email, message }`. Stores entries in
  `${DATA_DIR}/contact.json`.
- `POST /api/request` — custom-piece inquiry `{ game, desc, link, dims, qty,
  budget, deadline, email, zip }`. Stores entries in `${DATA_DIR}/requests.json`.
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
- `DATA_DIR` — where notify, contact and request submissions are persisted
  (default `/data`; falls back to in-memory if not writable)

## Tracking

`index.html` defines `window.track(event, data)`, which forwards to Meta Pixel
(`fbq`), Reddit Pixel (`rdt`) and GA4 (`gtag`) when their base codes are
present — paste them into `index.html` before ad spend. Events fired:

- `ViewContent` — config view opened
- `Lead` — notify signup or custom inquiry succeeded
- `InitiateCheckout` — checkout link clicked

UTM scheme for ad links: `utm_source` = reddit|meta|tiktok|organic,
`utm_medium` = paid|post|profile, `utm_campaign` = free text.
