# Aurora Redesign — Personal Portfolio

**Date:** 2026-05-29
**Status:** Design approved, ready for implementation planning
**Owner:** Xusniddin Qalandarov

## 1. Goal

Rebuild the personal portfolio into a single coherent cinematic world: dark, minimal, modern, with cursor-aware micro-interactions and a sparse "aurora" backdrop that runs across every route. The user-facing promise is a "wow" first impression that holds up across all seven pages — each page is a different room in the same world, not a different website.

## 2. Non-Goals

- Not changing site content (copy, project list, blogs, fitness records remain).
- Not changing the routing structure (the existing seven public routes + admin remain).
- Not migrating off Nuxt 4 / Vue 3 / Tailwind / Supabase / i18n.
- Not adding new content management features.
- Not introducing a React island, MDX, or a second framework. All ported components are written as Vue 3 SFCs.
- Light mode is retained as a derived counterpart but is not the primary canvas; design decisions are made dark-first.

## 3. Visual Identity

### 3.1 Palette (Cosmic Hybrid, locked)

```
--void:           #08080d   /* base background, near-black with cool tint */
--void-soft:      #0c0c14   /* elevated surfaces */
--line:           rgba(255,255,255,0.055)   /* grid lines */
--line-strong:    rgba(255,255,255,0.12)    /* card borders */

--indigo:         #818cf8   /* primary aurora */
--amber:          #d4a574   /* brand bridge — keeps existing DNA */
--cyan:           #67e8f9   /* secondary aurora */
--magenta:        #f472b6   /* accent flare, sparing */

--text:           #e8e6ef
--muted:          rgba(232,230,239,0.55)

--glass-bg:       rgba(255,255,255,0.035)
--glass-border:   rgba(255,255,255,0.08)
```

Per-route accent shift (same world, slight rebalance — the "well connected" feel):

| Route        | Dominant       | Secondary      |
|--------------|----------------|----------------|
| `/`          | indigo + cyan  | amber          |
| `/about`     | indigo         | cyan           |
| `/experience`| amber          | indigo         |
| `/projects`  | magenta        | indigo         |
| `/blogs`     | cyan           | amber          |
| `/fitness`   | amber          | magenta        |
| `/contact`   | cyan           | amber          |

Implementation: a CSS variable `--accent-primary` / `--accent-secondary` set on `<body>` per route via a composable that watches `route.path`. Aurora bloom positions and intensities use these tokens.

### 3.2 Typography (locked: Geist + Instrument Serif + Geist Mono)

| Role            | Family                 | Weights used    | Where                                                                       |
|-----------------|------------------------|-----------------|-----------------------------------------------------------------------------|
| Sans / body     | **Geist**              | 300, 500, 700, 800, 900 | All body text, large display sans ("XUSNIDDIN"), section titles      |
| Display italic  | **Instrument Serif**   | 400 italic      | Surname, brand mark, section punchlines (e.g. `<em>that mattered.</em>`), project descriptors |
| Mono            | **Geist Mono**         | 400, 500        | Eyebrows, dock items, buttons, tags, time/meta, scroll markers, code        |

Loaded via Google Fonts (`Geist`, `Geist Mono`, `Instrument Serif`). Removes `Sora` and `DM Mono` from the previous trio. Preconnect + display=swap retained from current `nuxt.config.ts` head config.

Letter-spacing defaults: sans display `-0.04em` to `-0.06em`; serif italic `-0.02em`; mono `0.16em` to `0.36em` (always uppercase when mono).

### 3.3 Motion Language

Shared easing token: `--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)`.

Standard durations:

- `instant` — 150ms (color shifts, tag highlights)
- `default` — 400ms (button states, dock hovers, card lifts)
- `cinematic` — 800ms (text fills, gradient sweeps, page entrance)
- `grand` — 1400ms (hero entrance staggers)

Two global rules:

1. Hover transforms are ≤ 250ms (responsiveness).
2. Scroll-driven and entrance reveals are ≥ 600ms (cinematic).

GSAP is the primary animation engine for entrance / scroll. CSS transitions handle hover state. `requestAnimationFrame` loops handle: smooth cursor physics, flickering grid canvas, magnetic card spotlights.

## 4. The Aurora World — site-wide backdrop

A persistent three-layer world mounted in the default layout, fixed-positioned behind all content.

**Layer 1 — Static grid (`AuroraGrid.vue`)** — CSS linear-gradient grid at 56px, masked with a top radial fade so the grid recedes into the void. No animation. Pure CSS, zero cost. Ported from `magicui/grid-pattern`.

**Layer 2 — Flickering canvas (`FlickerField.vue`)** — A `<canvas>` overlay that lights up grid cells. Each cell breathes independently between 4% and 15% white opacity, with cursor proximity (within 200px) boosting brightness and tinting amber. Driven by `requestAnimationFrame`. Ported from `magicui/flickering-grid` + `magicui/dot-pattern-with-glow-effect`. Capped to 60fps; pauses when document is hidden.

**Layer 3 — Aurora blooms (`AuroraBloom.vue`)** — Two large blurred radial gradients (top-right and bottom-left), slowly drifting. Colors driven by the per-route `--accent-primary` and `--accent-secondary` tokens so the bloom shifts as routes change. Each bloom: `~60vw` diameter, 60px blur, 18% peak opacity.

The three layers compose into `AuroraWorld.vue`, mounted once in `layouts/default.vue`. Total cost target: < 1ms CPU per frame on a 2020 MacBook Air, < 5% GPU.

## 5. Smooth Cursor System

A custom cursor replacing the native one on `(hover: hover)` devices. Hidden on touch.

`AuroraCursor.vue` (singleton in default layout) renders:

- An **8px white dot** with `mix-blend-mode: difference` so it inverts on any backdrop.
- A **soft amber radial glow** halo behind it (12px blur).
- A **contextual label** that follows offset from the cursor and shows text from a `data-cursor-label` attribute on any hovered element.

Spring physics (ported from `magicui/smooth-cursor`):

- Stiffness 0.18, damping 0.72 (tunable in the composable).
- Position is integrated each frame; the cursor visibly lags behind real pointer.
- Velocity drives a per-axis stretch + rotation: `scaleX(1 + min(speed * 0.04, 0.6))` paired with `scaleY(1 - stretch * 0.5)` and `rotate(atan2(vy, vx))`. Result: fast motion stretches the dot into an oriented oval; slow motion returns it to a circle.

Contextual morphing (driven by `data-cursor-state` on the hovered element):

| State              | Visual                                                          |
|--------------------|-----------------------------------------------------------------|
| (none)             | 8px white dot + amber halo                                      |
| `link`             | 56px transparent disc, 1px amber border, halo off               |
| `card`             | 72px translucent-amber disc, 1px amber border, halo off         |

The label shows / hides based on `data-cursor-label`. Disabled when `prefers-reduced-motion: reduce` is set — falls back to native cursor.

Implementation: a single composable `useAuroraCursor()` registers the rAF loop and pointer listeners; the `<AuroraCursor />` component renders the DOM. Interactive elements opt in by adding `data-cursor-label="View →"` etc. A simple `v-cursor` directive sugar may be provided for convenience.

## 6. Navigation — Floating Dock

Replaces `AppNavbar.vue`. Bottom-center fixed glass pill containing the seven route shortcuts as two-letter mono labels.

`AuroraDock.vue` (ported from `aceternity/floating-dock` + `magicui/dock`):

- Bottom-center, `28px` from edge, `glass-bg` background with `blur(28px) saturate(180%)`.
- Items are 42px circles, `font-mono 11px 500`, labelled with 2-character route abbreviations (`HM AB EX PR BL FT CT`) for V1. Switching to icons (e.g. `primeicons`) is a V2 candidate. Active route gets amber color + tiny amber dot indicator below.
- Hover lifts item by 6px and scales 1.12. macOS-dock-style proximity scaling is **out of scope** for V1 (heavy and not necessary at 7 items).
- Each item has `data-cursor-label="<full route name>"` so the smooth cursor reveals the readable label on hover.

Brand mark and meta surface persist as fixed top-left / top-right elements:

- **Brand top-left**: `x·q` in Instrument Serif italic 22px, amber middle dot. Links to `/`.
- **Meta top-right**: live Tashkent clock + locale toggle + theme toggle. Mono, muted color.

Mobile: dock shrinks to 5 items + an "MORE" overflow that opens a glass sheet from bottom on tap. Brand and meta surface collapse into a single hamburger control on `< 640px`.

## 7. Hero — Home (`/`)

The signature opening shot, structured as a single 100vh canvas:

1. **Eyebrow** — `[bar] Software Architect · Building since 2014`. Mono 11px, shimmer animation on the text (`animated-shiny-text`).
2. **Name (`XUSNIDDIN`)** — Geist 900 sans, outlined (1px `rgba(255,255,255,0.7)` stroke). On hover, an indigo→cyan→amber gradient **fills from cursor position**, expanding as a circular clip-path (`text-hover-effect` from Aceternity, ported).
3. **Surname (`qalandarov`)** — Instrument Serif italic 400, sized one notch below the name, filled with an animated aurora gradient (`aurora-text` from MagicUI, ported).
4. **Subtitle** — Geist 300, max-width 540px. Each word reveals with a blur-to-focus stagger (`text-generate-effect` from Aceternity, ported).
5. **CTAs** — Primary (solid white-on-void, flips amber on hover) + Ghost (glass border, amber on hover). Both `data-cursor-label` enabled.
6. **Scroll marker bottom-left** — `[line] Scroll · 01 / 04`.
7. **Right-edge index** — fixed vertical list `01 · INTRO / 02 · WORK / 03 · ABOUT / 04 · CONTACT` with an amber dash for the active section. ScrollTrigger updates `active` as the user scrolls.

Entrance timeline (GSAP, ~3s total):

```
0.3s   eyebrow fades up
0.5s   name outline fades up
0.8s   surname fades up
1.0s   subtitle words begin staggering (0.045s per word)
2.0s   CTAs fade up
2.6s   scroll marker fades in
```

## 8. Per-Route Signatures

Each of the seven routes anchors on a single signature component, recycled from the shortlist:

| Route        | Signature                                                                | Source                                      |
|--------------|--------------------------------------------------------------------------|---------------------------------------------|
| `/`          | Hero (above)                                                              | Composed                                    |
| `/about`     | `AnimatedBeam.vue` connecting skill nodes + `Marquee.vue` tech strip + `BentoGrid.vue` for skills | `magicui/animated-beam`, `marquee`, `aceternity/bento-grid` |
| `/experience`| `Timeline.vue` with sticky header and scroll-beam follow                  | `aceternity/timeline`                       |
| `/projects`  | `FocusCards.vue` grid wrapping `MagicCard.vue` items; featured cards wear `BorderBeam.vue` | `aceternity/focus-cards`, `magicui/magic-card`, `magicui/border-beam` |
| `/blogs`     | `HeroHighlight.vue` intro + grid of `MagicCard.vue` post cards            | `aceternity/hero-highlight`                 |
| `/fitness`   | `Ripple.vue` behind a CTA + `BentoGrid.vue` for stats                     | `magicui/ripple`, `aceternity/bento-grid`   |
| `/contact`   | `Globe.vue` (cobe) pinned to Tashkent, glass form alongside               | `magicui/globe`                             |

`ProjectModal.vue` is replaced by `ExpandableCard.vue` (ported from `aceternity/expandable-cards`) with shared-element layout transitions when a card is clicked.

## 9. Component Inventory & Vue Port Plan

All listed components are React + Framer Motion in their MCP source. Each is ported to Vue 3 SFC + Tailwind + GSAP (or `motion-v` for components heavy on declarative motion). New files all live under `components/aurora/`.

```
components/
  aurora/
    backdrop/
      AuroraWorld.vue          # Composes the three layers
      AuroraGrid.vue
      FlickerField.vue
      AuroraBloom.vue
    cursor/
      AuroraCursor.vue
    type/
      AuroraText.vue           # magicui/aurora-text
      TextHoverOutline.vue     # aceternity/text-hover-effect
      TextGenerate.vue         # aceternity/text-generate-effect
      ShinyText.vue            # magicui/animated-shiny-text
    surface/
      MagicCard.vue            # magicui/magic-card (cursor spotlight)
      BorderBeam.vue           # magicui/border-beam (conic orbit)
      NeonGradientCard.vue     # magicui/neon-gradient-card
      Backlight.vue            # magicui/backlight (image glow halo)
      ShineBorder.vue          # magicui/shine-border
      ExpandableCard.vue       # aceternity/expandable-cards
      FocusCards.vue           # aceternity/focus-cards (sibling blur)
      BentoGrid.vue            # aceternity/bento-grid
    layout/
      AuroraDock.vue           # aceternity/floating-dock + magicui/dock
      Timeline.vue             # aceternity/timeline
      AnimatedBeam.vue         # magicui/animated-beam (node connectors)
      Marquee.vue              # magicui/marquee
      Globe.vue                # magicui/globe (cobe WebGL)
      Ripple.vue               # magicui/ripple
      HeroHighlight.vue        # aceternity/hero-highlight
    primitives/
      AuroraButton.vue         # solid + ghost variants
      AuroraEyebrow.vue        # `[bar] LABEL` mono with shine option
      AuroraTag.vue            # rounded mono pill
  AppFooter.vue                # kept, restyled with new tokens
composables/
  useAuroraCursor.ts           # spring physics + state machine
  useAuroraTheme.ts            # per-route accent shift
  useReducedMotion.ts          # prefers-reduced-motion gate
  useFlickerField.ts           # canvas grid logic, reusable
  useMagneticCursor.ts         # element-level magnetic attraction (cards/buttons)
layouts/
  default.vue                  # mounts AuroraWorld + AuroraCursor + AuroraDock
  no-footer.vue                # mounts AuroraWorld + AuroraCursor only
assets/css/
  aurora.css                   # design tokens (new, source of truth)
  theme.css                    # retained until full migration done
```

### 9.1 Port methodology (per component)

1. Run `mcp__magicui__getRegistryItem` / `mcp__aceternity__get_component_info` with `includeSource: true` to fetch the React source.
2. Translate JSX → Vue `<template>`, preserving Tailwind classes verbatim (Tailwind config already aligned).
3. Replace Framer Motion → GSAP timelines (or `motion-v` for declarative variants). WebGL components keep their canvas / shader logic untouched; only the wrapper is rewritten.
4. Replace `@tabler/icons-react` → inline SVG or `primeicons` (already a dep).
5. Add a `<ComponentName>.preview.vue` story in `pages/xusniddin/aurora-preview.vue` (admin-only) for visual regression while iterating.
6. Document props + slots + `data-cursor-*` integration in the component header comment (single line, no docstring).

### 9.2 Stack changes

Additions to `package.json`:

- `motion-v` — Framer-Motion-compatible API for Vue, used for components that need declarative variants (`MagicCard`, `BorderBeam`, `Timeline`).
- `cobe` — WebGL globe library, dependency of `Globe.vue`.

Removals:

- `particles.js` — unused after migration; the flickering grid + aurora bloom replaces it.
- `gsap` is retained (already used for hero entrance and route transitions).

`@nuxt/image`, `@nuxtjs/i18n`, `@nuxtjs/supabase`, `tailwindcss`, `three` remain.

## 10. Theme System

The existing dark / light toggle is retained but the **light mode is a derived counterpart, not a parallel design system**. The toggle changes the `data-theme` attribute on `<html>`, which swaps a set of CSS variables.

Dark mode tokens are listed in section 3.1. Light mode counterparts:

```
--void:           #f7f3ee   /* warm off-white */
--void-soft:      #efe9e0
--line:           rgba(28,25,23,0.07)
--text:           #1c1917
--muted:          rgba(28,25,23,0.55)
--glass-bg:       rgba(255,255,255,0.55)
--glass-border:   rgba(28,25,23,0.08)
/* aurora colors stay but soften: */
--indigo:         #818cf8 → opacity capped at 30%
--amber:          #d4a574 → unchanged, primary accent
--cyan:           #67e8f9 → opacity capped at 30%
--magenta:        #f472b6 → reduced use
```

In light mode the aurora world becomes a sparse warm cream with soft amber/peach blooms — the cinematic mode is dark, the daytime mode is editorial. The flickering canvas dims to a `rgba(28,25,23,0.04)` base.

## 11. Performance & Accessibility

### 11.1 Performance budget

- LCP ≤ 2.5s on mid-tier mobile (Pixel 5, 4G).
- Hero contentful paint ≤ 1.2s on desktop broadband.
- CPU per frame for the Aurora World < 4ms on a 2020 MacBook Air at 60fps.
- Canvas pauses (`cancelAnimationFrame`) when document is hidden or off-screen.
- Mobile: flickering canvas disabled below 640px (CSS grid alone runs); aurora blooms drop to 1 instead of 2.
- `Globe.vue` (cobe) is dynamically imported only on `/contact`.
- All ported components are tree-shakable individual SFC imports — no barrel file.

### 11.2 Accessibility

- `prefers-reduced-motion: reduce` disables: smooth cursor (falls back to native), flickering canvas (drops to static grid), aurora bloom drift, surname gradient shift, text-generate stagger (shows instantly), and all entrance animations (still fades in over 200ms).
- Color contrast: body text vs `--void` and vs `--void` in light mode both clear WCAG AA (≥ 4.5:1). Verified during implementation.
- Focus rings: visible amber 2px outline on all interactive elements; never removed for aesthetic.
- Custom cursor never hides text selection ability — pointer events on the cursor div are `none`.
- All `data-cursor-label` text is informational, not load-bearing. The same affordance is communicated by the element's visible text + ARIA.
- Dock and brand mark have proper `aria-label` and route the keyboard tab order in the expected sequence: brand → dock items in order → page content → meta-top controls.

## 12. Internationalization

The site supports `en` and `ru` via `@nuxtjs/i18n`. Port implications:

- All new strings (eyebrows, scroll markers, dock labels, cursor labels, section titles) added to `i18n/locales/en.json` and `i18n/locales/ru.json` under an `aurora.*` namespace.
- Layout assumptions checked against Russian text length: dock labels stay 2 characters (locale-agnostic abbreviations), section titles use flexible width, hero subtitle has no fixed line-count assumption.
- The Tashkent clock and `Tashkent · 24/7` live indicator are static (not localized) per current site convention.
- Font fallback for Russian Cyrillic: Geist supports full Cyrillic; Instrument Serif supports Cyrillic; Geist Mono supports Cyrillic. No fallback stack changes needed.

## 13. Migration Plan (Implementation Waves)

Implementation is staged so the site never breaks. Each wave is a separate vertical slice and ends in a working, deployable state.

**Wave 1 — Foundation (no visible page changes yet)**

1. Add design tokens (`aurora.css`) + extend `tailwind.config.js`.
2. Swap fonts: remove Sora/DM Mono, add Geist/Geist Mono/Instrument Serif in `nuxt.config.ts` head.
3. Add `motion-v` and `cobe` to `package.json`.
4. Build `AuroraWorld.vue` + `AuroraCursor.vue` + `useAuroraCursor` + `useAuroraTheme` + `useReducedMotion`.
5. Mount both in `layouts/default.vue` and `layouts/no-footer.vue` behind a `?aurora=1` query feature flag so the legacy world is unaffected until everything ships.

**Wave 2 — Navigation + Hero**

6. Build `AuroraDock.vue`, replace `AppNavbar.vue` (kept in repo until Wave 5).
7. Build the new Hero in `components/AuroraMain.vue` (parallel to `AppMain.vue`).
8. Build supporting type primitives: `TextHoverOutline.vue`, `AuroraText.vue`, `TextGenerate.vue`, `ShinyText.vue`.
9. Wire `index.vue` to the new hero behind the flag.
10. Snapshot test, manual QA, fix.

**Wave 3 — Projects + About**

11. Build `MagicCard.vue`, `BorderBeam.vue`, `FocusCards.vue`, `ExpandableCard.vue`.
12. Convert `/projects` (replace `ProjectCard.vue` + `ProjectModal.vue`).
13. Build `AnimatedBeam.vue`, `Marquee.vue`, `BentoGrid.vue`.
14. Convert `/about`.

**Wave 4 — Inner pages**

15. Build `Timeline.vue`, convert `/experience`.
16. Build `HeroHighlight.vue`, convert `/blogs`.
17. Build `Ripple.vue`, convert `/fitness`.
18. Build `Globe.vue` (lazy-loaded), convert `/contact`.

**Wave 5 — Polish + cutover**

19. Remove the `?aurora=1` flag — aurora becomes default.
20. Delete `AppNavbar.vue`, `AppMain.vue`, `ProjectCard.vue`, `ProjectModal.vue`. Migrate any still-needed CSS variables from `assets/css/theme.css` into `aurora.css` (which holds both dark and light token sets per section 10), then delete `theme.css`.
21. Remove `particles.js` dep.
22. Light-mode pass (section 10) — verify every component looks correct in the warm-cream world.
23. Russian-locale pass — verify every layout against the longest expected RU strings.
24. Performance audit — Lighthouse on mobile, fix anything regressing LCP, CLS, or TBT.
25. Accessibility audit — keyboard tab through every page, verify `prefers-reduced-motion` fallbacks.

## 14. Acceptance Criteria

The redesign is shippable when:

1. All seven public routes render with the Aurora World mounted, the AuroraDock visible, and the AuroraCursor active on hover-capable devices.
2. The hero entrance plays within 3 seconds and feels smooth (no jank > 8ms frames during entrance) on a 2020 MacBook Air.
3. The smooth cursor stretches and morphs over interactive elements; `prefers-reduced-motion` properly falls back to native cursor.
4. The flickering canvas + aurora blooms keep the page under the performance budget in section 11.1.
5. Light mode is functional (toggle in meta-top works) and meets WCAG AA contrast.
6. Russian locale renders without overflow / clipping on every page.
7. All seven per-route signature components are in place and functional (Timeline scrolls, Globe rotates, Animated Beam connects nodes, etc.).
8. No console errors, no hydration mismatches.
9. Lighthouse mobile performance ≥ 85, accessibility ≥ 95.

## 15. Out of Scope (V2 candidates)

- Real WebGL aurora shader (current CSS bloom is sufficient; a shader-based aurora is a future wow-upgrade).
- macOS-style dock proximity scaling.
- Smooth scrolling library (Lenis) — evaluate after V1 ships if scroll feel needs improvement.
- 3D portrait scene in the hero — kept as a "phase 2" possibility once core system is in place.
- Sound design (cursor click sounds, ambient bed).
- Page-transition camera-move metaphor — the current slide transition stays for V1.
- New CMS surfaces or admin UI updates beyond the aurora preview page added in 9.1.

## 16. Risks & Mitigations

| Risk                                              | Mitigation                                                                                   |
|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| Canvas + cursor rAF on mobile drains battery      | Disable flicker canvas below 640px; cursor disabled on touch via `(hover: none)` MQ.         |
| Hydration mismatches from cursor / clock          | Wrap client-only logic in `<ClientOnly>` or guard with `import.meta.client`.                 |
| Russian text overflow                             | Wave 5 explicitly tests this; flexible widths, no fixed character counts.                    |
| Font flash (FOIT/FOUT)                            | `display=swap` already set; fonts ≤ 100KB combined gzip.                                     |
| GSAP + motion-v duplication                       | Use motion-v only where its declarative model wins; otherwise GSAP. Document the choice per component. |
| WebGL Globe perf on low-end                       | Lazy-load only on `/contact`; provide a static fallback image for `prefers-reduced-motion`.  |
| Aurora world distracting from content             | Keep blooms at ≤ 18% peak opacity; flicker cells ≤ 15% peak white; sparse 56px grid.         |

## 17. Open Questions

None blocking. The following are deferred to implementation:

- Whether `motion-v` covers enough of Framer Motion's API for `Timeline.vue` specifically; fallback is hand-rolled GSAP ScrollTrigger.
- Whether the brand mark `x·q` should link to `/` or scroll-to-top when already on `/`.
- Whether `Globe.vue` shows just Tashkent (41.3111° N, 69.2797° E) or also pins past project locations.

## 18. Reference

- Live design preview: `.superpowers/brainstorm/96003-*/content/full-demo-v3.html`
- MCP component shortlist: `.superpowers/brainstorm/96003-*/content/mcp-shortlist.html`
- Font comparison: `.superpowers/brainstorm/96003-*/content/font-direction.html`
- Existing site: local `master` branch at `/Users/macstore.uz/Documents/projects/personal-portfolio`
