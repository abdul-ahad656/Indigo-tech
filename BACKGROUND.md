# Background colors

This note explains the background colors used on the Indigo site, especially the dark hero.

## Hero (dark)

The hero canvas is a near-black purple, not pure black.

| Token | Hex | Where |
| --- | --- | --- |
| `--hero-obsidian` / `--bg-deep` | `#0F0B1E` | Base fill of `.hero-3d-frame` |
| `--hero-violet` | `#5A3DB0` | Brand purple glow over the base |
| `--hero-lavender` | `#B38CFF` | Grid lines, borders, highlights |
| `--hero-mint` | `#00F5D4` | Small mint glow (bottom right) |

The painted stack in `src/styles.css` on `.hero-3d-frame` is:

1. A large violet radial glow on the right (`rgba(90, 61, 176, 0.55)`)
2. A softer violet glow at the bottom left (`rgba(90, 61, 176, 0.22)`)
3. Solid `#0F0B1E` underneath

That is why the hero reads as dark purple rather than flat black. Extra orbs (`.hero-orb-violet`, `.hero-orb-core`, `.hero-orb-mint`) and a faint grid sit on top of this stack. The 3D canvas is transparent, so this CSS background shows through.

Defined in:

- `src/tokens.css` — `--hero-obsidian: #0f0b1e`
- `src/styles.css` — `.hero-3d-frame` background

To change the hero look, edit `#0f0b1e` (base) or the two `rgba(90, 61, 176, …)` glows.

## Rest of the site (light)

After the hero, the page uses a light lavender surface.

| Token | Hex | Where |
| --- | --- | --- |
| `--bg-surface` | `#EDE8F6` | Page body, about section, loading screen |
| `--bg-surface-muted` | `#EAE4F5` | Panels / loader track |

Do not paint the live page with pure `#FFFFFF`. The light canvas is `#EDE8F6` so brand purple text stays readable (about 6.4:1 on that surface).
