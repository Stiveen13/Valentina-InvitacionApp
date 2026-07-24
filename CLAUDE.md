# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page digital invitation for a quinceañera ("15 Años de Mariana Lozano Santa", Sleeping Beauty / "La Bella Durmiente" theme). It's a static React SPA — no backend, no database. Client hits a Google Apps Script endpoint directly for RSVP storage.

## Commands

```
npm run dev      # vite dev server on port 3000 (host 0.0.0.0)
npm run build    # production build to dist/
npm run preview  # preview a production build
npm run lint     # tsc --noEmit (type-check only, no test suite exists)
npm run clean    # rm -rf dist
```

There are no automated tests in this repo. Verification is manual: run `npm run dev` and click through the invitation (envelope open, countdown, carousel, RSVP form, music toggle).

## Environment

Copy `.env.example` to `.env`. `GEMINI_API_KEY` and `APP_URL` are vestigial from the Google AI Studio template this project was scaffolded from — the app does not currently call Gemini or use `APP_URL` anywhere. Don't assume features around them exist; check `src/App.tsx` before relying on anything env-related.

Likewise, `express`, `better-sqlite3`, `dotenv`, and `@google/genai` in `package.json` are unused leftovers from the same template — there is no server in this repo. Don't build server-side features on top of them without confirming with the user first; they may simply be dead weight to prune.

## Architecture

The entire application lives in **`src/App.tsx`** (~800 lines) as one file with several components defined top-to-bottom and rendered in a single `App` default export:

- Decorative/animation components (`CrownIcon`, `CastleIcon`, `RoseIcon`, `WatercolorBackground`, `SparklingLight`, `MagicDust`) — inline SVGs and `framer-motion` (imported as `motion`) animations for the fairytale visual theme.
- `CountdownTimer` — computes time remaining until `EVENT_DATE` (top-of-file constant) client-side with `setInterval`, no server sync.
- `MusicPlayer` — floating play/pause button controlling a background `<audio>` element sourced from `MUSIC_URL` (a Google Drive direct-media link). Autoplays once the invitation envelope is opened, via a custom `invitationOpened` window event.
- `RSVPForm` — collects name/attendance/party size, POSTs to `SHEETS_URL` (a Google Apps Script Web App, `mode: "no-cors"` so the response is opaque) to append a row to a Google Sheet, then redirects to a `wa.me` WhatsApp deep link pre-filled with the same info as a fallback/notification channel. This dual-write (Sheets + WhatsApp) is the actual "backend."
- `App` — top-level state machine for the envelope-opening intro animation (`isOpening` → `isOpened`, gated by a `setTimeout`), then renders the page sections in order: hero/countdown, photo carousel (`react-bootstrap` `Carousel`), event details cards, embedded Google Maps iframe, dress code, RSVP + WhatsApp contact, footer.

Key top-of-file constants control event content and integrations — update these rather than hunting through JSX when the date, venue, contact number, RSVP endpoint, or music track changes:
```
EVENT_DATE, RSVP_PHONE, RSVP_CONTACT_NAME, SHEETS_URL, MUSIC_URL
```
Photo carousel images and the Google Maps query string are inline in the JSX (search for `lh3.googleusercontent.com` and `maps.google.com/maps?q=`) rather than extracted as constants — check both places when swapping the venue or photos.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` (config lives in `src/index.css` `@theme` block, not a `tailwind.config.js`). Custom theme colors are prefixed `quince-*` (`quince-rose`, `quince-blush`, `quince-gold`, etc.) — reuse these tokens instead of introducing new hex values inline. `react-bootstrap` is used only for `Carousel`/`Container`/`Row`/`Col`/`Button` layout primitives, not its default visual styling (Bootstrap's CSS is linked in `index.html` mainly for the carousel/grid mechanics, with Tailwind classes overriding appearance).

Path alias `@/*` → project root (configured in both `tsconfig.json` and `vite.config.ts`).
