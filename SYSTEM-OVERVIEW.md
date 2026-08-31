# Indigo Tech Solutions — System Overview

## 1. Purpose

This repository is a **single-page marketing website** for **Indigo Tech Solutions (ITS)**, a BPO and business services company based in Lahore, Pakistan. The site presents the company's positioning, service offerings, leadership team, client feedback, and contact information to prospective clients.

There is **no backend, database, or authentication**. All content is static, defined in source code and served as a client-side React application.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  index.html  →  main.jsx (React App)  →  styles.css   │  │
│  │       ↑              ↑                                  │  │
│  │       │         Static data arrays                      │  │
│  │       │         (company, team, services, etc.)         │  │
│  └───────┼─────────────────────────────────────────────────┘  │
│          │                                                    │
│  public/ assets (logo, banner, team photos, video)           │
└─────────────────────────────────────────────────────────────┘
                              │
                    npm run build (Vite)
                              │
                              ▼
                         dist/ (static files)
                              │
                    Netlify (or any static host)
```

| Layer | Technology | Role |
|-------|-----------|------|
| UI framework | React 19 | Component rendering |
| Build tool | Vite 7 | Dev server, bundling, asset handling |
| Animation | Framer Motion 12 | Scroll progress, reveal animations, parallax |
| Icons | Lucide React | Service, nav, and contact icons |
| Styling | Plain CSS (`styles.css`) | Layout, theming, responsive breakpoints |
| Hosting | Netlify (configured) | Static deploy from `dist/` |

---

## 3. Repository Structure

```
indigo-tech-solutions/
├── index.html                 # HTML shell, SEO meta tags, root mount point
├── package.json               # Dependencies and npm scripts
├── netlify.toml               # Netlify build & publish configuration
├── README.md                  # Quick-start and asset notes
├── TEAM-PHOTOS-AND-VIDEO.md   # Asset naming and content edit guide
├── public-domain-notes.txt    # Domain/deployment checklist (generic)
├── public/
│   ├── assets/
│   │   ├── indigo-logo.jpg        # Company logo (nav, hero, footer, video)
│   │   ├── company-banner.png     # Hero background poster + video poster
│   │   └── team/
│   │       ├── abd.jpg            # Team photo (Hafiz Abdullah Ather)
│   │       ├── Alman.jpeg         # Team photo (Alman Ahmad)
│   │       └── umair.jpeg         # Team photo (Umair Gondal)
│   └── videos/
│       └── tech-showreel.mp4      # Optional looped background video
└── src/
    ├── main.jsx               # Entire application (single file)
    └── styles.css             # Global styles and responsive rules
```

There is **no** `vite.config.js` — the project uses Vite defaults with the React plugin implied via `@vitejs/plugin-react` in devDependencies (typically auto-detected by Vite when using JSX).

---

## 4. Application Structure (`src/main.jsx`)

The entire React application lives in one file. It is organized as:

### 4.1 Static Content Data

All site copy and configuration are plain JavaScript objects/arrays at the top of the file:

| Variable | Purpose |
|----------|---------|
| `company` | Name, tagline, location, phone, email, LinkedIn |
| `team` | Leadership names, fallback initials, bios |
| `services` | Six service cards (title, description, icon, number) |
| `capabilities` | Tag cloud / ticker items (15 operational areas) |
| `feedback` | Sample client testimonials (marked as placeholders) |

**Primary edit point:** The `company` block near the top of `main.jsx` is the main place to update contact details.

### 4.2 Components

| Component | Responsibility |
|-----------|----------------|
| `Reveal` | Wrapper using Framer Motion for scroll-into-view fade/slide animations |
| `App` | Root layout: navigation, all page sections, footer |

### 4.3 Page Sections (in scroll order)

| # | Section ID | Label | Content |
|---|-----------|-------|---------|
| — | `top` | — | Fixed nav + scroll progress bar |
| 1 | — | Hero | Logo, tagline, CTAs, parallax scroll effect, banner poster |
| 2 | — | Ticker | Infinite horizontal scroll of capability tags |
| 3 | `about` | 01 — THE COMPANY | Company overview and stat row (BPO, 360°, Remote) |
| 4 | `services` | 02 — SERVICES | Six animated service cards + capability cloud |
| 5 | — | 03 — TECHNOLOGY IN MOTION | Video showreel with animated fallback layer |
| 6 | `team` | 04 — LEADERSHIP | Three leadership cards with photos |
| 7 | `feedback` | 05 — CLIENT FEEDBACK | Three testimonial cards (sample placeholders) |
| 8 | `contact` | 06 — LET'S WORK | Email/phone CTAs, location, meta badges |
| — | — | Footer | Brand, tagline, back-to-top |

### 4.4 Navigation & Interaction

- **Fixed top nav** with smooth-scroll links to `#about`, `#services`, `#team`, `#feedback`, `#contact`
- **Mobile hamburger menu** toggles `.nav-links.open` below 900px
- **Scroll progress bar** at top of viewport (`scaleX` tied to `scrollYProgress`)
- **Hero parallax** — subtle Y translation and scale on scroll (first 18% of page)
- Contact actions use native `mailto:` and `tel:` links (no form submission)

---

## 5. Styling System (`src/styles.css`)

### Design Tokens (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f7f7fa` | Page background |
| `--ink` | `#0b0b16` | Primary text |
| `--purple` / `--purple2` | `#351a92` / `#6040d8` | Brand accent |
| `--deep` | `#0b0820` | Dark sections (services, ticker) |
| `--acid` | `#9bff44` | Accent highlight |

### Typography

- **Inter** — body and headings
- **DM Mono** — labels, eyebrows, ticker, footer (uppercase, letter-spaced)

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `≤ 900px` | Single-column grids, hamburger nav, hidden hero poster |
| `≤ 560px` | Compact hero type, hidden brand text in nav |
| `prefers-reduced-motion` | Disables animations and smooth scroll |

---

## 6. Static Assets

| Asset | Path | Used In |
|-------|------|---------|
| Logo | `/assets/indigo-logo.jpg` | Nav, hero, video center, footer |
| Banner | `/assets/company-banner.png` | Hero poster (decorative), video poster |
| Team photos | `/assets/team/*` | Leadership section |
| Showreel | `/videos/tech-showreel.mp4` | Technology section (muted, loop, playsInline) |

### Team Photo Behavior

Team cards render an `<img>` with an `onError` handler. If the image fails to load, the image is hidden and initials (`fallback`) are shown instead via the `.no-photo` CSS class.

### Video Fallback

If the MP4 is missing or fails, an animated purple "circuit" fallback layer remains visible beneath the video element (scanline + gradient background + centered logo).

---

## 7. Build, Run & Deploy

### Local Development

```bash
npm install
npm run dev      # Vite dev server (default http://localhost:5173)
```

### Production Build

```bash
npm run build    # Output → dist/
npm run preview  # Preview production build locally
```

### Netlify Configuration (`netlify.toml`)

| Setting | Value |
|---------|-------|
| Build command | `node ./node_modules/vite/bin/vite.js build` |
| Publish directory | `dist` |
| Node version | 20 |

The build command invokes Vite directly via Node to avoid shell permission issues on some CI environments.

---

## 8. SEO & Metadata (`index.html`)

- Page title: *Indigo Tech Solutions | BPO · Logistics · Business Services*
- Meta description and keywords targeting BPO, logistics, dispatch, customer support
- Open Graph tags for social sharing
- Theme color: `#351a92` (brand purple)

---

## 9. Business Context (Content Summary)

**Indigo Tech Solutions** positions itself as a provider of:

1. Client acquisition & support
2. Business process outsourcing (BPO)
3. Logistics / truck dispatch & freight brokerage
4. Customer support & dispatch operations
5. Appointment scheduling
6. Talent hiring & recruitment

**Leadership team:**

| Name | Focus |
|------|-------|
| Hafiz Abdullah Ather | Strategy, client ops, logistics, dispatch, BPO, BD |
| Alman Ahmad | Financial planning, reporting, commercial discipline |
| Umair Gondal | Day-to-day ops, teams, service quality |

**Delivery model:** Remote operations from Lahore, Pakistan.

---

## 10. Known Gaps & Pre-Publish Checklist

| Item | Status | Action Required |
|------|--------|-----------------|
| Client feedback cards | Sample placeholders | Replace with verified testimonials before publishing |
| Team `photo` paths | Not defined in `team` array | Add `photo` field per member (e.g. `/assets/team/abd.jpg`) |
| Team `role` field | Referenced in JSX but missing from data | Add role titles to each team member object |
| `TEAM-PHOTOS-AND-VIDEO.md` filenames | Docs suggest kebab-case names | Actual files use `abd.jpg`, `Alman.jpeg`, `umair.jpeg` — align docs or filenames |
| `public-domain-notes.txt` | Generic personal-domain checklist | Update for indigotech.com or company domain when ready |
| Contact form | Not implemented | Uses `mailto:` / `tel:` only |
| Analytics | Not configured | Add if needed (GA, Plausible, etc.) |
| `vite.config.js` | Absent | Add only if custom aliases, base path, or plugins are needed |

---

## 11. Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| `react` / `react-dom` | ^19.1.1 | UI rendering |
| `framer-motion` | ^12.23.12 | Animations and scroll effects |
| `lucide-react` | ^0.468.0 | Icon set |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.1.2 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.0.2 | JSX/React support in Vite |

---

## 12. Extension Points

Common future enhancements and where to implement them:

| Enhancement | Where |
|-------------|-------|
| Update contact info | `company` object in `main.jsx` |
| Add/edit services | `services` array in `main.jsx` |
| Add team members | `team` array + photo in `public/assets/team/` |
| Real testimonials | `feedback` array in `main.jsx` |
| Custom domain / base URL | Hosting dashboard + optional `vite.config.js` `base` |
| Contact form | New section in `main.jsx` + backend or form service (Netlify Forms, Formspree) |
| Split into components | Extract sections from `main.jsx` into `src/components/` |
| i18n | Wrap content strings; no i18n library present today |

---

*Generated from repository analysis. Last reviewed against source as of project version 1.0.0.*
