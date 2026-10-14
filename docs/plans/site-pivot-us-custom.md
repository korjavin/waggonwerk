# Site pivot: U.S. production, customization-first

Status: plan, 2026-09-08. Source of truth for the business side is the KB report
"WaggonWerk Market Research Report" v4 and the page "Why not Germany/EU".

## Goal

Turn the current draft landing site (fictional 14-year-old maker in Berlin,
EUR prices, German shipping, care-home charity, invented blog) into an honest
U.S. storefront with two conversion events:

1. Buy the steampunk Ticket to Ride-compatible set (single color, 5-color bundle).
2. Submit a custom-piece inquiry for any board game (feasibility-reviewed, paid design).

No Felix. No Berlin. No German anything. Production and shipping in the U.S.

## Non-goals

- No cart or payment integration in this pass; checkout goes to Shopify Starter /
  Stripe Payment Link. The site stays a static Go-served SPA.
- No German language. Remove the DE toggle and the `de` string block entirely.
- No STL-upload service, no bulk/club tier, no care-home program, no blog fiction.

## Brand and voice

- Name stays WaggonWerk. Tagline: "Custom 3D-printed pieces for the games you already love."
- Maker: the real owner, first name only, real photo. Origin line: "Designed by
  Ivan. Printed and shipped from [U.S. state]." Fill the state once the print
  partner is fixed.
- Trademark rule on every page: plain text "compatible with Ticket to Ride",
  never the logo or its typeface, never as the biggest words on the page.
  Footer disclaimer stays.
- No invented numbers. Every count on the site (queue size, sets shipped,
  catalog size) is either real or removed.
- Currency USD. Prices per report: single set $25-30, bundle $100-120, custom
  design fee from $40, printed custom pieces $4-6 each.

## Information architecture (after)

| View | Keep / change | Notes |
|---|---|---|
| home | rewrite | Hero: steampunk set on a real board. CTA 1 "Shop the steampunk set", CTA 2 "Request a custom piece". Sections: Lines (steampunk only, "more lines in the works"), How it works (design → U.S. print → USPS), Custom pieces teaser, Notify (real list), Catalog (real items only). Remove Maker/Felix, Care, Werkblog sections. |
| config | rewrite | USD; options: color (5), quantity (1 set / 5-set bundle), finish (unpainted only). Remove scale, material, filament, STL row. Total links to the checkout URL. |
| custom (new) | add | Replaces `contact` as the main form. Fields: game, piece description, photo upload (optional, or link), dimensions, quantity, budget, deadline, email, shipping ZIP. Copy discloses paid design ($40+), feasibility and IP review, 24 h reply. Decline list is internal, not shown. |
| about | rewrite | Real maker, real process (Blender, partner printer in the U.S., USPS), why unpainted, why slow. Remove timeline fiction and pillars about care work and STL. |
| contact | shrink | Simple email + short message; topics: order question, custom piece (links to `custom`), something else. |
| blog | remove | Delete view, nav item, strings. Re-add later with real posts. |
| legal (new, static) | add | Privacy (what the pixels collect), terms, shipping and returns (U.S. only, handling time 1-2 weeks), small-parts notice, disclaimer. |

## Work items

### 1. Strip fiction and German roots
- [ ] `web/js/i18n.js`: delete the `de` block; delete keys `maker_*`, `care_*`,
      `blog_*`, `blogpage_*`, `portrait_*`, `about_t*`, `about_pillar*`,
      `topic_stl`, `topic_bulk`, `topic_care`, `svc_stl_*`, `foot_li_care`,
      `foot_li_bulk`, `foot_li_imprint`, `notify_count`.
- [ ] `web/js/app.js`: remove Maker, Care, Werkblog sections from home; remove
      `blog` view and route; remove language toggle; remove the DSGVO/laptop line
      (line ~297); remove "printed in Berlin" subtitle (~491) and the STL spec row (~511).
- [ ] `web/index.html`: title "WaggonWerk — custom 3D-printed game pieces";
      meta description without Berlin.
- [ ] `web/css/colors_and_type.css` header comment: drop "German engineering".
- [ ] `web/js/locos.js`: rename `berlinerLoco` to `modernLoco` (no user-visible change).
- [ ] README: rewrite the first paragraph and the Routes section.

### 2. Rewrite copy (EN only)
- [ ] Hero, lines, services, notify, about, contact, footer per the voice rules above.
- [ ] Lines: keep `classic` renamed to Steampunk as the only live line;
      `modernist` and `voyager` shown as "in development" cards or removed.
      Line descriptions must not mention Berlin S-Bahn or ICE.
- [ ] Footer blurb and copyright: "© WaggonWerk · [year]" plus disclaimer.
- [ ] Contact aside: U.S. reply hours, email only.

### 3. Currency and shipping
- [ ] Replace `€` with `$` in `app.js` (cart chip, catalog price, configurator
      total); `toFixed(2)` without the comma swap.
- [ ] Shipping copy: "Ships from the U.S. via USPS · 1-2 week handling"; U.S.
      addresses only for now.
- [ ] Country field: replace free text with a U.S. ZIP field.

### 4. Custom-piece inquiry
- [ ] New view `custom` with the form above; nav item "Custom pieces".
- [ ] `main.go`: add `POST /api/request` storing `${DATA_DIR}/requests.json`
      with the structured fields (reuse the contact handler pattern; one
      function, no new package). Validate email and required fields; cap
      message length; reject uploads (accept a URL field instead).
- [ ] Success state: "Reply within 24 hours with a quote or a no."
- [ ] Internal decline list lives in this doc, not in code: Games Workshop,
      Hasbro, Wizards of the Coast IP.

### 5. Tracking (the reason the site exists)
- [ ] Add to `index.html`: Meta Pixel base code, Reddit Pixel base code, GA4 tag.
      Fire `Lead` (Meta) / `Lead` (Reddit) on `/api/request` success;
      `ViewContent` on config view; `InitiateCheckout` on the checkout link click.
- [ ] Conversions API: not in this pass; Shopify handles purchase events on its
      side. Note the gap in the review sheet.
- [ ] UTM scheme documented in README: `utm_source` = reddit|meta|tiktok|organic,
      `utm_medium` = paid|post|profile, `utm_campaign` = free text.
- [ ] Coupon code per channel on the checkout side.

### 6. Legal pages
- [ ] Static `legal` view with privacy, terms, shipping/returns, small-parts
      notice ("Contains small parts. Not intended for children under 14."),
      trademark disclaimer.

### 7. Launch checklist
- [ ] Real photos of the partner-printed sample batch replace every SVG hero
      where a photo belongs.
- [ ] Test purchase and test inquiry fire in Meta Events Manager, Reddit
      Events Manager and GA4 before any ad spend.
- [ ] Deploy via the existing Portainer pipeline.

## Order of work

1 → 3 → 2 → 4 → 5 → 6 → 7. Stripping first keeps the diff reviewable; copy
before the custom view so the new view reuses the final voice.

## Open inputs needed from the owner

- Print partner's state (for the origin line and shipping copy).
- Real first name and photo for About.
- Checkout URL (Shopify Starter or Stripe Payment Link) per product.
- Pixel IDs: Meta, Reddit, GA4.
