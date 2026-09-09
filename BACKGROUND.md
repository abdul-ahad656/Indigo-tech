# Background colors

This note explains the background colors used on the Indigo site, especially the dark hero.

## Hero (dark)

The hero canvas is a near-black purple, not pure black.

| Token | Hex | Where |
| --- | --- | --- |
| `--hero-obsidian` / `--bg-deep` | `#2E2660` | Base fill of `.hero-3d-frame` |
| `--hero-violet` | `#5A3DB0` | Brand purple glow over the base |
| `--hero-lavender` | `#B38CFF` | Grid lines, borders, highlights |
| `--hero-mint` | `#00F5D4` | Small mint glow (bottom right) |

The painted stack in `src/styles.css` on `.hero-3d-frame` is:

1. A centered violet radial glow (`rgba(90, 61, 176, 0.62)`)
2. A softer lavender glow at the bottom (`rgba(179, 140, 255, 0.22)`)
3. Solid `#2E2660` underneath

That is why the hero reads as dark purple rather than flat black. The 3D canvas is transparent, so this CSS background shows through. Thin guide lines in `.hero-guides` sit around the mark.

Defined in:

- `src/tokens.css` — `--hero-obsidian: #2e2660`
- `src/styles.css` — `.hero-3d-frame` background

To change the hero look, edit `#2e2660` (base) or the two radial glows.

## Rest of the site (light)

After the hero, the page uses a light lavender surface.

| Token | Hex | Where |
| --- | --- | --- |
| `--bg-surface` | `#EDE8F6` | Page body, about section, loading screen |
| `--bg-surface-muted` | `#EAE4F5` | Panels / loader track |

Do not paint the live page with pure `#FFFFFF`. The light canvas is `#EDE8F6` so brand purple text stays readable (about 6.4:1 on that surface).
