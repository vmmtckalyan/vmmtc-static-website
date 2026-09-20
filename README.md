# Vernon Memorial Methodist Tamil Church, Kalyan — Website

Official website for [Vernon Memorial Methodist Tamil Church](), Kalyan — a community committed to the study, practice and spread of the Word of God. Site URL: ``.

## Tech Stack

- **100% static pages** — hand-written HTML, a single stylesheet (`css/style.css`) and vanilla JavaScript. No frameworks, no package.json, no build step.
- **Fonts** — Google Fonts (Montserrat, Playfair Display, Noto Sans/Serif Tamil).
- **Media** — local images/videos under `assets/`, plus YouTube thumbnails and video embeds.
- Host anywhere static files are served (GitHub Pages, Netlify, any web server) — just push to `main`.

## Pages

| Page | Description |
| --- | --- |
| `index.html` | Home with hero, service info, announcements and upcoming events |
| `about_us.html` | Church history and vision |
| `ministries.html` | Ministry overview |
| `wcss.html` | WCSS — Women's ministry |
| `methodist-men.html` | Methodist Men's ministry |
| `myf.html` | MYF (Youth) ministry |
| `sunday-school.html` | Sunday School ministry |
| `events.html` | Past events timeline (descending) with YouTube recap videos |
| `gallery.html` | Photo gallery (masonry + lightbox) |
| `souvenir.html` | 60th Anniversary commemorative souvenir book |
| `singapore-trip.html` | 2024 Singapore trip page |
| `youth-retreat-2024.html` / `youth-retreat-2024-songs.html` | Youth Retreat 2024 pages (songs page: lyrics + picker) |
| `songs.html` | Song lyrics picker |
| `login.html` | Members portal placeholder; "Login" links to the external VMMTC invoicing tool |
| `cookies.html`, `privacy.html`, `terms.html` | Policy pages |

## JavaScript

All scripts are dependency-free, IIFE-wrapped and `'use strict'`.

- **`js/main.js`** — global interactions: sticky navbar, mobile menu (with scroll lock), footer year, reveal-on-scroll via IntersectionObserver, and pausing autoplay videos for `prefers-reduced-motion`.
- **`js/i18n.js`** — English ⇄ Tamil language switcher:
  - **Google's website-translate widget is the primary translator** — loaded automatically (key-free) and driven from the site's own EN/தமிழ் toggle. Per-page Tamil `<title>`/meta overrides live in `PAGE_TA` and stay hand-written for SEO quality.
  - **The manual `T` dictionary is the offline/blocked fallback**: text nodes are matched against it (keyed by the exact trimmed English string) whenever the Google widget can't load (no network, blocked, script failed). A missing key leaves English as-is; nodes with no letters are skipped.
  - Only one mode runs per toggle (widget, else dictionary) so the two never conflict.
  - The choice is remembered in `localStorage` under `vmmtc.lang`. Google's widget sets its own `googtrans` cookie, which the script reconciles on every boot so our toggle stays authoritative.
  - Brand names, the switcher, and dynamic lyric/gallery zones are marked `notranslate` so Google keeps them untouched.
  - **When you change English text or add new content**, the Google widget picks it up automatically when online; only offline coverage depends on adding (or updating) a `T` key.
- **`js/youtube.js`** — key-free "Videos" grids: thumbnails built from hard-coded video IDs, real titles fetched via YouTube oEmbed (no API key) and cached for 24 hours. Group IDs are declared in `GROUPS`; the two home-page video cards stay fully static.
- **`js/gallery.js`** — masonry gallery with load-more and a lightbox.
- **`js/songs.js`** — song list with lyrics and a title-based picker.

## Adding an Event / Video

1. Add a `.timeline-card` inside the matching `.timeline__group` in `events.html`.
2. For a recap video, keep the `timeline-card__video` anchor with the YouTube ID in both `href` and `src` (`https://i.ytimg.com/vi/<ID>/hqdefault.jpg`).
3. For offline Tamil coverage, add Tamil translations for any new/changed strings to `js/i18n.js` — online, Google's widget handles them automatically.

## Notes

- No advertising/tracking cookies. When a visitor switches to Tamil online, Google's translation widget reads the page text (and sets its `googtrans` cookie) to translate it; the site itself stores only the `vmmtc.lang` preference in `localStorage`.
- The site pulls fonts from Google Fonts and video metadata/thumbnails from YouTube at runtime.