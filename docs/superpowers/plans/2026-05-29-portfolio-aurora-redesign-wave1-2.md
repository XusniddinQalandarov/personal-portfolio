# Portfolio Aurora Redesign — Waves 1 + 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the visible "wow" of the aurora redesign — site-wide cinematic backdrop (flickering grid + aurora blooms), smooth physics cursor, floating dock navigation, and the new hero on `/`. Waves 1 + 2 of the 5-wave roadmap in `docs/superpowers/specs/2026-05-29-portfolio-aurora-redesign-design.md`.

**Architecture:** Add a new `components/aurora/` namespace and a new `layouts/aurora.vue` so the existing `layouts/default.vue` keeps working. Pages opt into the new world via `definePageMeta({ layout: 'aurora' })`. After Wave 5 the old layout is removed; for now both coexist. All components are Vue 3 SFCs that adapt the patterns proven in the brainstorming demo (`.superpowers/brainstorm/96003-1780040241/content/full-demo-v3.html`).

**Tech Stack:** Nuxt 4 + Vue 3 + Tailwind 3 + GSAP + new dep `motion-v` (Framer-Motion-compatible API for Vue, used in later waves). Geist + Instrument Serif + Geist Mono via Google Fonts. Test framework: Vitest + `@vue/test-utils` + `happy-dom` (smoke tests only — visual verification via `npm run dev` + browser).

---

## Important Context

### Why the layout-flag approach instead of a `?aurora=1` query flag

The spec's section 13 wave 1 step 5 originally proposed a query flag for isolation. A new `layouts/aurora.vue` is simpler, idiomatic in Nuxt, and lets each page opt in deliberately. This is a small divergence from the spec — document it in the spec if you encounter it post-merge.

### Vue port methodology (used in every component task)

The brainstorming demo file `.superpowers/brainstorm/96003-1780040241/content/full-demo-v3.html` contains working HTML/CSS/JS for **every behavior** we are porting (aurora world, smooth cursor, hero, dock, magic card, text-hover-effect, text-generate, aurora-text, shiny-text). Each component task adapts that demo code into a Vue 3 SFC with these rules:

1. Use `<script setup lang="ts">`.
2. Template uses the same DOM structure as the demo.
3. CSS goes in `<style scoped>` unless the styling has to leak globally (e.g. `body.cursor: none` lives in `aurora.vue` layout, not inside `AuroraCursor.vue`).
4. Interactivity moves from inline `<script>` into the component's `setup` block, using `onMounted` + `onBeforeUnmount` for rAF / event listeners.
5. CSS custom properties driven by JS (`--mx`, `--my`, `--angle`) are set via `el.value.style.setProperty(...)`.
6. Components are SSR-safe: any code that touches `window` / `document` is wrapped in `if (import.meta.client)` or guarded by `onMounted`.

### Testing approach

Vitest + `@vue/test-utils` + `happy-dom`. One smoke test per component: mounts without throwing + a single behavior assertion (e.g. that 7 dock items render, that the canvas is created). Visual / motion behavior is verified manually with `npm run dev` and the brainstorming demo as ground truth.

### What "complete" means for each task

A task is complete when:
1. All listed steps are checked off.
2. The test passes (`npx vitest run <path>`).
3. The component renders without console errors when imported into `layouts/aurora.vue` and visited at `/?layout=aurora` after Task 14 (Wave 1 ships the layout).
4. The commit message follows the project's existing conventional style (`type: subject`).

---

## File Structure

Files created or modified, with single-responsibility roles:

```
package.json                                # +motion-v, +vitest, +@vue/test-utils, +happy-dom, +cobe (lazy, used in W4)
tailwind.config.js                          # Extend with aurora tokens
nuxt.config.ts                              # Swap fonts: remove Sora+DM Mono, add Geist+Geist Mono+Instrument Serif. Add aurora.css to css array.
vitest.config.ts                            # NEW — vitest setup pointing at happy-dom

assets/css/
  aurora.css                                # NEW — design tokens (dark + light) per spec §3.1 + §10

composables/
  useReducedMotion.ts                       # NEW — reactive prefers-reduced-motion
  useAuroraTheme.ts                         # NEW — per-route accent token shift (spec §3.1)
  useAuroraCursor.ts                        # NEW — smooth physics cursor state + rAF (spec §5)

components/aurora/
  backdrop/
    AuroraGrid.vue                          # NEW — static CSS grid (spec §4 layer 1)
    FlickerField.vue                        # NEW — canvas flicker (spec §4 layer 2)
    AuroraBloom.vue                         # NEW — drifting blurred blooms (spec §4 layer 3)
    AuroraWorld.vue                         # NEW — composes the three layers
  cursor/
    AuroraCursor.vue                        # NEW — smooth cursor + label renderer (spec §5)
  layout/
    AuroraDock.vue                          # NEW — floating dock (spec §6)
    AuroraBrand.vue                         # NEW — top-left brand mark (spec §6)
    AuroraMetaTop.vue                       # NEW — top-right clock + locale + theme
  type/
    AuroraEyebrow.vue                       # NEW — [bar] LABEL with shine (spec §7.1)
    AuroraText.vue                          # NEW — animated gradient text (magicui/aurora-text port)
    ShinyText.vue                           # NEW — text shimmer (magicui/animated-shiny-text port)
    TextHoverOutline.vue                    # NEW — outlined name with cursor-clip gradient fill (aceternity/text-hover-effect port)
    TextGenerate.vue                        # NEW — word-by-word blur-to-focus reveal (aceternity/text-generate-effect port)
  primitives/
    AuroraButton.vue                        # NEW — solid + ghost variants
  hero/
    AuroraMain.vue                          # NEW — full home hero composition

layouts/
  aurora.vue                                # NEW — mounts AuroraWorld + AuroraCursor + AuroraDock + AuroraBrand + AuroraMetaTop

i18n/locales/
  en.json                                   # +aurora.* namespace
  ru.json                                   # +aurora.* namespace

pages/
  index.vue                                 # MODIFY — set definePageMeta layout: 'aurora', use <AuroraMain />

tests/aurora/                               # NEW dir
  AuroraGrid.test.ts
  FlickerField.test.ts
  AuroraBloom.test.ts
  AuroraWorld.test.ts
  AuroraCursor.test.ts
  AuroraDock.test.ts
  AuroraEyebrow.test.ts
  AuroraText.test.ts
  ShinyText.test.ts
  TextHoverOutline.test.ts
  TextGenerate.test.ts
  AuroraButton.test.ts
  AuroraMain.test.ts
```

---

## Wave 1 — Foundation

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto-generated)

- [ ] **Step 1: Install runtime deps**

Run from project root:
```bash
npm install motion-v@latest cobe@latest
```
Expected: succeeds with both added under `dependencies`.

- [ ] **Step 2: Install test deps**

```bash
npm install -D vitest @vue/test-utils happy-dom @vitejs/plugin-vue
```
Expected: succeeds with all four added under `devDependencies`.

- [ ] **Step 3: Verify installation**

```bash
npm ls motion-v cobe vitest @vue/test-utils happy-dom @vitejs/plugin-vue
```
Expected: all six listed with versions.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add motion-v + cobe + vitest stack for aurora redesign"
```

---

### Task 2: Add test scripts and Vitest config

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts section)

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
```

- [ ] **Step 2: Add scripts to `package.json`**

Find the `scripts` block and add two new entries so the result reads:

```json
"scripts": {
  "build": "nuxt build",
  "dev": "nuxt dev",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Verify test runner**

```bash
npm test
```
Expected output: `No test files found, exiting with code 0` (or similar — exit code is 0). This proves Vitest is wired correctly.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: add vitest config + test scripts"
```

---

### Task 3: Add aurora design tokens to Tailwind

**Files:**
- Modify: `tailwind.config.js` — extend the `theme.extend` block.

- [ ] **Step 1: Read the existing config**

Read `tailwind.config.js` to confirm current `theme.extend` content (palette object, fontFamily, animations).

- [ ] **Step 2: Extend with aurora tokens**

Add these entries inside the existing `theme.extend` block (preserve everything already there — only add):

```js
colors: {
  // ...existing colors...
  aurora: {
    void: '#08080d',
    voidSoft: '#0c0c14',
    indigo: '#818cf8',
    amber: '#d4a574',
    cyan: '#67e8f9',
    magenta: '#f472b6',
    text: '#e8e6ef',
  },
},
fontFamily: {
  // ...existing fonts...
  geist: ['Geist', 'system-ui', 'sans-serif'],
  'geist-mono': ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
  instrument: ['Instrument Serif', 'Georgia', 'serif'],
},
transitionTimingFunction: {
  cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
},
```

(Use `Edit` to preserve all existing content; do not overwrite the file.)

- [ ] **Step 3: Verify Tailwind still parses**

```bash
npx tailwindcss --help > /dev/null
echo "exit: $?"
```
Expected: `exit: 0`.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(tokens): add aurora palette, Geist fonts, cinematic easing to Tailwind"
```

---

### Task 4: Create `assets/css/aurora.css`

**Files:**
- Create: `assets/css/aurora.css`

- [ ] **Step 1: Write the file**

```css
/* Aurora design tokens — single source of truth for both modes.
   See docs/superpowers/specs/2026-05-29-portfolio-aurora-redesign-design.md §3.1, §10 */

:root, [data-theme="dark"] {
  --void: #08080d;
  --void-soft: #0c0c14;
  --line: rgba(255, 255, 255, 0.055);
  --line-strong: rgba(255, 255, 255, 0.12);

  --indigo: #818cf8;
  --amber: #d4a574;
  --cyan: #67e8f9;
  --magenta: #f472b6;

  --text: #e8e6ef;
  --muted: rgba(232, 230, 239, 0.55);

  --glass-bg: rgba(255, 255, 255, 0.035);
  --glass-border: rgba(255, 255, 255, 0.08);

  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-instant: 150ms;
  --dur-default: 400ms;
  --dur-cinematic: 800ms;
  --dur-grand: 1400ms;

  /* Per-route accent — defaults; useAuroraTheme overrides. */
  --accent-primary: var(--indigo);
  --accent-secondary: var(--cyan);
  --accent-tertiary: var(--amber);
}

[data-theme="light"] {
  --void: #f7f3ee;
  --void-soft: #efe9e0;
  --line: rgba(28, 25, 23, 0.07);
  --line-strong: rgba(28, 25, 23, 0.12);

  --indigo: #818cf8;
  --amber: #d4a574;
  --cyan: #67e8f9;
  --magenta: #f472b6;

  --text: #1c1917;
  --muted: rgba(28, 25, 23, 0.55);

  --glass-bg: rgba(255, 255, 255, 0.55);
  --glass-border: rgba(28, 25, 23, 0.08);
}

/* Font family CSS aliases for use outside Tailwind utilities. */
.font-aurora-sans { font-family: 'Geist', system-ui, sans-serif; }
.font-aurora-mono { font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace; }
.font-aurora-serif { font-family: 'Instrument Serif', Georgia, serif; }

/* Disable smooth cursor + heavy animations for users who request it. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/aurora.css
git commit -m "feat(tokens): aurora.css with dark/light design tokens"
```

---

### Task 5: Update `nuxt.config.ts` — fonts + aurora.css

**Files:**
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Update the fonts link tag and css array**

Find the line:
```ts
{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=Sora:wght@300;400;500;600;700;800&display=swap' }
```

Replace with:
```ts
{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap' }
```

Then find the `css:` array:
```ts
css: [
  '~/assets/css/main.css',
  'primeicons/primeicons.css'
],
```

Replace with:
```ts
css: [
  '~/assets/css/aurora.css',
  '~/assets/css/main.css',
  'primeicons/primeicons.css'
],
```

`aurora.css` must come **before** `main.css` so existing styles override aurora tokens during the migration period.

- [ ] **Step 2: Verify Nuxt config parses**

```bash
npx nuxi prepare 2>&1 | tail -5
```
Expected: ends with success message, no parsing errors.

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts
git commit -m "feat(fonts): swap to Geist + Geist Mono + Instrument Serif; load aurora.css"
```

---

### Task 6: Create `useReducedMotion` composable

**Files:**
- Create: `composables/useReducedMotion.ts`
- Create: `tests/aurora/useReducedMotion.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/useReducedMotion.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReducedMotion } from '~/composables/useReducedMotion'

describe('useReducedMotion', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  })

  it('returns true when prefers-reduced-motion matches', () => {
    const { prefersReduced } = useReducedMotion()
    expect(prefersReduced.value).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/aurora/useReducedMotion.test.ts
```
Expected: FAIL with "Cannot find module ~/composables/useReducedMotion".

- [ ] **Step 3: Write the composable**

```typescript
// composables/useReducedMotion.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useReducedMotion() {
  const prefersReduced = ref(false)
  let mq: MediaQueryList | null = null
  const update = () => { prefersReduced.value = !!mq?.matches }

  if (import.meta.client) {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = mq.matches
  }

  onMounted(() => {
    mq?.addEventListener('change', update)
  })
  onBeforeUnmount(() => {
    mq?.removeEventListener('change', update)
  })

  return { prefersReduced }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/aurora/useReducedMotion.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add composables/useReducedMotion.ts tests/aurora/useReducedMotion.test.ts
git commit -m "feat(composables): useReducedMotion"
```

---

### Task 7: Create `useAuroraTheme` composable

**Files:**
- Create: `composables/useAuroraTheme.ts`
- Create: `tests/aurora/useAuroraTheme.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/useAuroraTheme.test.ts
import { describe, it, expect } from 'vitest'
import { ROUTE_ACCENTS, getAccentForPath } from '~/composables/useAuroraTheme'

describe('useAuroraTheme', () => {
  it('exposes 7 route accents', () => {
    expect(Object.keys(ROUTE_ACCENTS)).toHaveLength(7)
  })
  it('returns the default (home) accent for unknown routes', () => {
    const a = getAccentForPath('/nope')
    expect(a).toEqual(ROUTE_ACCENTS['/'])
  })
  it('returns the correct accent for /projects', () => {
    const a = getAccentForPath('/projects')
    expect(a.primary).toBe('var(--magenta)')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/useAuroraTheme.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Write the composable**

```typescript
// composables/useAuroraTheme.ts
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export interface Accent {
  primary: string
  secondary: string
  tertiary: string
}

export const ROUTE_ACCENTS: Record<string, Accent> = {
  '/':            { primary: 'var(--indigo)',  secondary: 'var(--cyan)',    tertiary: 'var(--amber)'   },
  '/about':       { primary: 'var(--indigo)',  secondary: 'var(--cyan)',    tertiary: 'var(--amber)'   },
  '/experience':  { primary: 'var(--amber)',   secondary: 'var(--indigo)',  tertiary: 'var(--cyan)'    },
  '/projects':    { primary: 'var(--magenta)', secondary: 'var(--indigo)',  tertiary: 'var(--amber)'   },
  '/blogs':       { primary: 'var(--cyan)',    secondary: 'var(--amber)',   tertiary: 'var(--indigo)'  },
  '/fitness':     { primary: 'var(--amber)',   secondary: 'var(--magenta)', tertiary: 'var(--cyan)'    },
  '/contact':     { primary: 'var(--cyan)',    secondary: 'var(--amber)',   tertiary: 'var(--indigo)'  },
}

export function getAccentForPath(path: string): Accent {
  const base = '/' + (path.split('/')[1] || '')
  return ROUTE_ACCENTS[base] ?? ROUTE_ACCENTS['/']
}

export function useAuroraTheme() {
  if (!import.meta.client) return
  const route = useRoute()
  const apply = (path: string) => {
    const a = getAccentForPath(path)
    const root = document.documentElement
    root.style.setProperty('--accent-primary', a.primary)
    root.style.setProperty('--accent-secondary', a.secondary)
    root.style.setProperty('--accent-tertiary', a.tertiary)
  }
  apply(route.path)
  watch(() => route.path, apply)
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/useAuroraTheme.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add composables/useAuroraTheme.ts tests/aurora/useAuroraTheme.test.ts
git commit -m "feat(composables): useAuroraTheme with per-route accent tokens"
```

---

### Task 8: Create `AuroraGrid` component

**Files:**
- Create: `components/aurora/backdrop/AuroraGrid.vue`
- Create: `tests/aurora/AuroraGrid.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraGrid.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraGrid from '~/components/aurora/backdrop/AuroraGrid.vue'

describe('AuroraGrid', () => {
  it('mounts and renders the fixed grid container', () => {
    const w = mount(AuroraGrid)
    expect(w.find('[data-aurora="grid"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraGrid.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/backdrop/AuroraGrid.vue -->
<template>
  <div data-aurora="grid" class="aurora-grid" aria-hidden="true" />
</template>

<style scoped>
.aurora-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, #000 30%, transparent 95%);
  -webkit-mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, #000 30%, transparent 95%);
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraGrid.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/backdrop/AuroraGrid.vue tests/aurora/AuroraGrid.test.ts
git commit -m "feat(aurora): AuroraGrid backdrop layer 1"
```

---

### Task 9: Create `FlickerField` component

**Files:**
- Create: `components/aurora/backdrop/FlickerField.vue`
- Create: `tests/aurora/FlickerField.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/FlickerField.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlickerField from '~/components/aurora/backdrop/FlickerField.vue'

describe('FlickerField', () => {
  it('mounts a canvas element', () => {
    const w = mount(FlickerField)
    expect(w.find('canvas').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/FlickerField.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/backdrop/FlickerField.vue -->
<template>
  <canvas ref="canvasEl" data-aurora="flicker" class="aurora-flicker" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const { prefersReduced } = useReducedMotion()

let rafId = 0
let cells: { x: number; y: number; a: number; target: number; next: number }[] = []
let cw = 0, ch = 0
const cellSize = 28
let lastT = 0

// Cursor position consumed via global custom event from AuroraCursor.
const cursor = { x: 0, y: 0 }
const onCursor = (e: Event) => {
  const d = (e as CustomEvent<{ x: number; y: number }>).detail
  cursor.x = d.x; cursor.y = d.y
}

function resize() {
  if (!canvasEl.value) return
  cw = canvasEl.value.width = window.innerWidth
  ch = canvasEl.value.height = window.innerHeight
  const cols = Math.ceil(cw / cellSize)
  const rows = Math.ceil(ch / cellSize)
  cells = []
  for (let i = 0; i < cols * rows; i++) {
    cells.push({
      x: (i % cols) * cellSize,
      y: Math.floor(i / cols) * cellSize,
      a: Math.random() * 0.04,
      target: Math.random() * 0.04,
      next: Math.random() * 2000 + 500,
    })
  }
}

function frame(t: number) {
  const ctx = canvasEl.value?.getContext('2d')
  if (!ctx) return
  const dt = t - lastT; lastT = t
  ctx.clearRect(0, 0, cw, ch)
  for (const c of cells) {
    c.next -= dt
    if (c.next <= 0) {
      c.target = Math.random() < 0.7 ? Math.random() * 0.04 : Math.random() * 0.15
      c.next = Math.random() * 1500 + 400
    }
    c.a += (c.target - c.a) * 0.05
    const dx = (c.x + cellSize / 2) - cursor.x
    const dy = (c.y + cellSize / 2) - cursor.y
    const dist = Math.hypot(dx, dy)
    const prox = Math.max(0, 1 - dist / 200)
    const a = c.a + prox * 0.3
    ctx.fillStyle = `rgba(232,230,239,${a})`
    ctx.fillRect(c.x + 1, c.y + 1, cellSize - 2, cellSize - 2)
    if (prox > 0.6) {
      ctx.fillStyle = `rgba(212,165,116,${(prox - 0.6) * 0.4})`
      ctx.fillRect(c.x + 1, c.y + 1, cellSize - 2, cellSize - 2)
    }
  }
  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  if (!import.meta.client) return
  // Below-640 perf budget per spec §11.1.
  if (window.innerWidth < 640) return
  if (prefersReduced.value) return
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('aurora-cursor-move', onCursor as EventListener)
  rafId = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('aurora-cursor-move', onCursor as EventListener)
})
</script>

<style scoped>
.aurora-flicker {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/FlickerField.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/backdrop/FlickerField.vue tests/aurora/FlickerField.test.ts
git commit -m "feat(aurora): FlickerField canvas layer with cursor-proximity glow"
```

---

### Task 10: Create `AuroraBloom` component

**Files:**
- Create: `components/aurora/backdrop/AuroraBloom.vue`
- Create: `tests/aurora/AuroraBloom.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraBloom.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraBloom from '~/components/aurora/backdrop/AuroraBloom.vue'

describe('AuroraBloom', () => {
  it('renders two bloom elements', () => {
    const w = mount(AuroraBloom)
    expect(w.findAll('.bloom').length).toBe(2)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraBloom.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/backdrop/AuroraBloom.vue -->
<template>
  <div data-aurora="blooms" aria-hidden="true">
    <div class="bloom bloom-1" />
    <div class="bloom bloom-2" />
  </div>
</template>

<style scoped>
.bloom {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
}
.bloom-1 {
  width: 60vw; height: 60vw;
  top: -25vw; right: -15vw;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent-primary) 30%, transparent) 0%,
    color-mix(in srgb, var(--accent-secondary) 15%, transparent) 40%,
    transparent 70%);
  animation: bloomDrift 24s var(--ease-cinematic) infinite;
}
.bloom-2 {
  width: 40vw; height: 40vw;
  bottom: -10vw; left: -10vw;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent-tertiary) 22%, transparent) 0%,
    transparent 70%);
  filter: blur(50px);
  animation: bloomDrift2 30s var(--ease-cinematic) infinite;
}
@keyframes bloomDrift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-6vw, 4vw); }
}
@keyframes bloomDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(4vw, -3vw); }
}
@media (max-width: 640px) {
  .bloom-2 { display: none; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraBloom.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/backdrop/AuroraBloom.vue tests/aurora/AuroraBloom.test.ts
git commit -m "feat(aurora): AuroraBloom drifting accent blooms (per-route colors)"
```

---

### Task 11: Create `AuroraWorld` composition

**Files:**
- Create: `components/aurora/backdrop/AuroraWorld.vue`
- Create: `tests/aurora/AuroraWorld.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraWorld.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraWorld from '~/components/aurora/backdrop/AuroraWorld.vue'

describe('AuroraWorld', () => {
  it('renders all three backdrop layers', () => {
    const w = mount(AuroraWorld)
    expect(w.find('[data-aurora="grid"]').exists()).toBe(true)
    expect(w.find('[data-aurora="flicker"]').exists()).toBe(true)
    expect(w.find('[data-aurora="blooms"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraWorld.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/backdrop/AuroraWorld.vue -->
<template>
  <div class="aurora-world">
    <AuroraGrid />
    <FlickerField />
    <AuroraBloom />
  </div>
</template>

<script setup lang="ts">
import AuroraGrid from './AuroraGrid.vue'
import FlickerField from './FlickerField.vue'
import AuroraBloom from './AuroraBloom.vue'
</script>

<style scoped>
.aurora-world {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraWorld.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/backdrop/AuroraWorld.vue tests/aurora/AuroraWorld.test.ts
git commit -m "feat(aurora): AuroraWorld composes grid + flicker + bloom layers"
```

---

### Task 12: Create `useAuroraCursor` composable

**Files:**
- Create: `composables/useAuroraCursor.ts`

- [ ] **Step 1: Write the composable**

(No standalone unit test — coverage comes via the AuroraCursor component test in Task 13.)

```typescript
// composables/useAuroraCursor.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

type CursorState = 'idle' | 'link' | 'card'

export function useAuroraCursor() {
  const x = ref(0)
  const y = ref(0)
  const cx = ref(0)
  const cy = ref(0)
  const angle = ref(0)
  const stretch = ref(0)
  const state = ref<CursorState>('idle')
  const label = ref('')

  let vx = 0, vy = 0
  let rafId = 0

  const onMove = (e: PointerEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  const onOver = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest('[data-cursor-label], [data-cursor-state]')
    if (!t) return
    const s = t.getAttribute('data-cursor-state') as CursorState | null
    if (s) state.value = s
    else if (t.matches('[data-cursor-card]')) state.value = 'card'
    else state.value = 'link'
    label.value = t.getAttribute('data-cursor-label') ?? ''
  }
  const onOut = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest('[data-cursor-label], [data-cursor-state]')
    if (!t) return
    state.value = 'idle'
    label.value = ''
  }

  function tick() {
    const stiffness = 0.18, damping = 0.72
    vx = vx * damping + (x.value - cx.value) * stiffness
    vy = vy * damping + (y.value - cy.value) * stiffness
    cx.value += vx
    cy.value += vy
    const speed = Math.hypot(vx, vy)
    angle.value = Math.atan2(vy, vx) * 180 / Math.PI
    stretch.value = Math.min(speed * 0.04, 0.6)
    if (import.meta.client) {
      window.dispatchEvent(new CustomEvent('aurora-cursor-move', {
        detail: { x: cx.value, y: cy.value },
      }))
    }
    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (!import.meta.client) return
    if (!matchMedia('(hover: hover)').matches) return
    x.value = cx.value = innerWidth / 2
    y.value = cy.value = innerHeight / 2
    addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver, true)
    document.addEventListener('pointerout', onOut, true)
    rafId = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    if (!import.meta.client) return
    removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerover', onOver, true)
    document.removeEventListener('pointerout', onOut, true)
  })

  return { x: cx, y: cy, angle, stretch, state, label }
}
```

- [ ] **Step 2: Commit**

```bash
git add composables/useAuroraCursor.ts
git commit -m "feat(composables): useAuroraCursor — spring physics + state machine"
```

---

### Task 13: Create `AuroraCursor` component

**Files:**
- Create: `components/aurora/cursor/AuroraCursor.vue`
- Create: `tests/aurora/AuroraCursor.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraCursor.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraCursor from '~/components/aurora/cursor/AuroraCursor.vue'

describe('AuroraCursor', () => {
  it('renders the cursor dot and label nodes', () => {
    const w = mount(AuroraCursor)
    expect(w.find('.smooth-cursor').exists()).toBe(true)
    expect(w.find('.cursor-label').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraCursor.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/cursor/AuroraCursor.vue -->
<template>
  <div
    class="smooth-cursor"
    :class="stateClass"
    :style="cursorStyle"
    aria-hidden="true"
  />
  <div
    class="cursor-label"
    :class="{ visible: !!label }"
    :style="labelStyle"
    aria-hidden="true"
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuroraCursor } from '~/composables/useAuroraCursor'

const { x, y, angle, stretch, state, label } = useAuroraCursor()

const cursorStyle = computed(() => ({
  transform:
    `translate(${x.value}px, ${y.value}px) translate(-50%, -50%) ` +
    `rotate(${angle.value}deg) ` +
    `scaleX(${1 + stretch.value}) scaleY(${1 - stretch.value * 0.5})`,
}))
const labelStyle = computed(() => ({
  transform: `translate(${x.value + 24}px, ${y.value + 24}px)`,
}))
const stateClass = computed(() => ({
  'hover-link': state.value === 'link',
  'hover-card': state.value === 'card',
}))
</script>

<style scoped>
.smooth-cursor {
  position: fixed; top: 0; left: 0;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--text);
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -50%);
  transition:
    width 0.3s var(--ease-cinematic),
    height 0.3s var(--ease-cinematic),
    background 0.3s var(--ease-cinematic),
    border-radius 0.3s var(--ease-cinematic);
  will-change: transform;
  mix-blend-mode: difference;
}
.smooth-cursor::before {
  content: '';
  position: absolute; inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,165,116,0.5) 0%, transparent 70%);
  filter: blur(8px);
  z-index: -1;
  mix-blend-mode: normal;
}
.smooth-cursor.hover-link {
  width: 56px; height: 56px;
  background: transparent;
  border: 1px solid var(--amber);
  mix-blend-mode: normal;
}
.smooth-cursor.hover-card {
  width: 72px; height: 72px;
  background: rgba(212,165,116,0.08);
  border: 1px solid var(--amber);
  mix-blend-mode: normal;
}
.cursor-label {
  position: fixed; top: 0; left: 0;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--amber);
  pointer-events: none; z-index: 1001;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.25s var(--ease-cinematic);
  white-space: nowrap;
}
.cursor-label.visible { opacity: 1; }
@media (hover: none), (prefers-reduced-motion: reduce) {
  .smooth-cursor, .cursor-label { display: none; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraCursor.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/cursor/AuroraCursor.vue tests/aurora/AuroraCursor.test.ts
git commit -m "feat(aurora): AuroraCursor smooth physics cursor with contextual label"
```

---

### Task 14: Create `layouts/aurora.vue`

**Files:**
- Create: `layouts/aurora.vue`

- [ ] **Step 1: Write the layout**

```vue
<!-- layouts/aurora.vue -->
<template>
  <div class="aurora-layout">
    <AuroraWorld />
    <AuroraCursor />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AuroraWorld from '~/components/aurora/backdrop/AuroraWorld.vue'
import AuroraCursor from '~/components/aurora/cursor/AuroraCursor.vue'
import { useTheme } from '~/composables/useTheme'
import { useAuroraTheme } from '~/composables/useAuroraTheme'

const { initTheme } = useTheme()
useAuroraTheme()

onMounted(() => {
  initTheme()
})
</script>

<style>
/* GLOBAL — needs to leak from the layout to override the native cursor everywhere. */
html, body {
  background: var(--void);
  color: var(--text);
}
.aurora-layout {
  min-height: 100vh;
  position: relative;
  font-family: 'Geist', system-ui, sans-serif;
}
.aurora-layout .content {
  position: relative;
  z-index: 5;
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  html.aurora-active, html.aurora-active body { cursor: none; }
}
</style>
```

- [ ] **Step 2: Add the `aurora-active` class on mount (preserves native cursor when layout isn't used)**

In the same file, extend the `<script setup>` block by appending:

```ts
onMounted(() => {
  if (import.meta.client) document.documentElement.classList.add('aurora-active')
})
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.classList.remove('aurora-active')
})
```

(Combine with the existing `onMounted` rather than duplicating — pseudocode is fine if you're confident, otherwise call `initTheme()` and the class-add in the same block.)

- [ ] **Step 3: Commit**

```bash
git add layouts/aurora.vue
git commit -m "feat(layouts): aurora.vue mounts AuroraWorld + AuroraCursor"
```

---

### Task 15: Wave 1 smoke test — visual verification

**Files:**
- Modify: `pages/index.vue` (temporary, to test the layout)

- [ ] **Step 1: Temporarily wire index.vue to the aurora layout**

Replace the entire content of `pages/index.vue` with:

```vue
<template>
  <div class="grid place-items-center min-h-screen">
    <p class="font-aurora-mono uppercase tracking-[0.3em] text-sm text-[color:var(--muted)]">
      Aurora Wave 1 — placeholder
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'aurora' })
</script>
```

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```
Wait for "Listening on http://localhost:3000".

- [ ] **Step 3: Open the page in a browser and verify**

Visit `http://localhost:3000/`. Manually verify:

1. Background is near-black (`#08080d`).
2. A faint grid is visible, masked to the upper portion (fades down).
3. A canvas overlay shows individual cells flickering at low opacity.
4. Two soft blurred blobs drift in the corners (one top-right indigo/cyan, one bottom-left amber).
5. A small white dot follows your cursor with spring lag — moving fast stretches it into an oval.
6. The placeholder text reads in Geist Mono uppercase.

If any of the six fail: stop, debug, do not proceed.

- [ ] **Step 4: Stop the dev server (Ctrl-C)** and commit the placeholder page wiring

```bash
git add pages/index.vue
git commit -m "chore: wire index.vue to aurora layout (placeholder for Wave 2 hero)"
```

---

## Wave 2 — Navigation + Hero

### Task 16: Add i18n strings (`aurora.*` namespace)

**Files:**
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/ru.json`

- [ ] **Step 1: Add `aurora` block to `en.json`**

Add this top-level key (inside the root object, alongside `nav`, `home`, etc.):

```json
"aurora": {
  "brand": "x · q",
  "eyebrow": "Software Architect · Building since 2014",
  "name": "XUSNIDDIN",
  "surname": "qalandarov",
  "subtitle": "I build digital experiences that feel inevitable — products that fold engineering rigor into moments of delight.",
  "viewWork": "View Work",
  "getInTouch": "Get in touch",
  "scrollMarker": "Scroll · 01 / 04",
  "live": "Tashkent · 24/7",
  "indexIntro": "01 · INTRO",
  "indexWork": "02 · WORK",
  "indexAbout": "03 · ABOUT",
  "indexContact": "04 · CONTACT",
  "dock": {
    "home": "HM",
    "about": "AB",
    "experience": "EX",
    "projects": "PR",
    "blogs": "BL",
    "fitness": "FT",
    "contact": "CT"
  },
  "cursor": {
    "hover": "Hover",
    "view": "View →",
    "reachOut": "Reach out",
    "home": "Home",
    "about": "About",
    "experience": "Experience",
    "projects": "Projects",
    "blogs": "Blogs",
    "fitness": "Fitness",
    "contact": "Contact"
  }
}
```

- [ ] **Step 2: Add equivalent block to `ru.json`**

```json
"aurora": {
  "brand": "x · q",
  "eyebrow": "Архитектор ПО · С 2014 года",
  "name": "ХУСНИДДИН",
  "surname": "каландаров",
  "subtitle": "Я создаю цифровые продукты, ощущающиеся неизбежными — там, где инженерная точность встречает моменты восторга.",
  "viewWork": "Работы",
  "getInTouch": "Связаться",
  "scrollMarker": "Скролл · 01 / 04",
  "live": "Ташкент · 24/7",
  "indexIntro": "01 · ИНТРО",
  "indexWork": "02 · РАБОТА",
  "indexAbout": "03 · ОБО МНЕ",
  "indexContact": "04 · КОНТАКТ",
  "dock": {
    "home": "ГЛ",
    "about": "ОМ",
    "experience": "ОП",
    "projects": "ПР",
    "blogs": "БЛ",
    "fitness": "ФТ",
    "contact": "КТ"
  },
  "cursor": {
    "hover": "Наведи",
    "view": "Смотреть →",
    "reachOut": "Написать",
    "home": "Главная",
    "about": "Обо мне",
    "experience": "Опыт",
    "projects": "Проекты",
    "blogs": "Блог",
    "fitness": "Фитнес",
    "contact": "Контакт"
  }
}
```

- [ ] **Step 3: Verify both files are valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('i18n/locales/en.json'))" && node -e "JSON.parse(require('fs').readFileSync('i18n/locales/ru.json'))" && echo OK
```
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add i18n/locales/en.json i18n/locales/ru.json
git commit -m "feat(i18n): aurora.* namespace in en + ru"
```

---

### Task 17: Create `AuroraEyebrow` primitive

**Files:**
- Create: `components/aurora/type/AuroraEyebrow.vue`
- Create: `tests/aurora/AuroraEyebrow.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraEyebrow.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraEyebrow from '~/components/aurora/type/AuroraEyebrow.vue'

describe('AuroraEyebrow', () => {
  it('renders the label text', () => {
    const w = mount(AuroraEyebrow, { props: { text: 'Hello' } })
    expect(w.text()).toContain('Hello')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraEyebrow.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/type/AuroraEyebrow.vue -->
<template>
  <div class="eyebrow">
    <span class="bar" />
    <span :class="['label', { shine }]">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; shine?: boolean }>()
</script>

<style scoped>
.eyebrow {
  display: flex; align-items: center; gap: 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--muted);
}
.bar { width: 36px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber)); }
.label.shine {
  background: linear-gradient(90deg, var(--muted) 30%, #fff 50%, var(--muted) 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}
@keyframes shine {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraEyebrow.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/type/AuroraEyebrow.vue tests/aurora/AuroraEyebrow.test.ts
git commit -m "feat(aurora): AuroraEyebrow primitive"
```

---

### Task 18: Create `AuroraText` primitive

**Files:**
- Create: `components/aurora/type/AuroraText.vue`
- Create: `tests/aurora/AuroraText.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraText.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraText from '~/components/aurora/type/AuroraText.vue'

describe('AuroraText', () => {
  it('renders slot text inside a span with class', () => {
    const w = mount(AuroraText, { slots: { default: 'qalandarov' } })
    expect(w.find('.aurora-text').text()).toBe('qalandarov')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraText.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/type/AuroraText.vue
     Port of magicui/aurora-text. -->
<template>
  <span class="aurora-text"><slot /></span>
</template>

<style scoped>
.aurora-text {
  background: linear-gradient(120deg, var(--amber), var(--magenta), var(--cyan), var(--amber));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: auroraShift 10s ease infinite;
}
@keyframes auroraShift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-text { animation: none; background-position: 0% 50%; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraText.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/type/AuroraText.vue tests/aurora/AuroraText.test.ts
git commit -m "feat(aurora): AuroraText port of magicui/aurora-text"
```

---

### Task 19: Create `ShinyText` primitive

**Files:**
- Create: `components/aurora/type/ShinyText.vue`
- Create: `tests/aurora/ShinyText.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/ShinyText.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShinyText from '~/components/aurora/type/ShinyText.vue'

describe('ShinyText', () => {
  it('renders slot content with the shimmer class', () => {
    const w = mount(ShinyText, { slots: { default: 'shimmer' } })
    expect(w.find('.shiny-text').text()).toBe('shimmer')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/ShinyText.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/type/ShinyText.vue
     Port of magicui/animated-shiny-text. -->
<template>
  <span class="shiny-text"><slot /></span>
</template>

<style scoped>
.shiny-text {
  background: linear-gradient(90deg, var(--muted) 30%, #fff 50%, var(--muted) 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}
@keyframes shine {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .shiny-text { animation: none; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/ShinyText.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/type/ShinyText.vue tests/aurora/ShinyText.test.ts
git commit -m "feat(aurora): ShinyText shimmer (magicui/animated-shiny-text)"
```

---

### Task 20: Create `TextHoverOutline` primitive

**Files:**
- Create: `components/aurora/type/TextHoverOutline.vue`
- Create: `tests/aurora/TextHoverOutline.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/TextHoverOutline.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextHoverOutline from '~/components/aurora/type/TextHoverOutline.vue'

describe('TextHoverOutline', () => {
  it('renders both stroked and fill copies of the text', () => {
    const w = mount(TextHoverOutline, { props: { text: 'XQ' } })
    expect(w.findAll('.outline').length).toBe(1)
    expect(w.findAll('.fill').length).toBe(1)
    expect(w.text()).toContain('XQ')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/TextHoverOutline.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/type/TextHoverOutline.vue
     Port of aceternity/text-hover-effect.
     Outlined name. Hover reveals gradient fill from cursor position via clip-path. -->
<template>
  <span
    ref="root"
    class="outline"
    data-cursor-label="Hover"
    @pointermove="onMove"
  >
    {{ text }}
    <span class="fill" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ text: string }>()
const root = ref<HTMLSpanElement | null>(null)
function onMove(e: PointerEvent) {
  if (!root.value) return
  const r = root.value.getBoundingClientRect()
  root.value.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  root.value.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}
</script>

<style scoped>
.outline {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(72px, 14vw, 220px);
  line-height: 0.88;
  letter-spacing: -0.06em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.7);
  position: relative;
  display: inline-block;
  cursor: none;
}
.fill {
  position: absolute; inset: 0;
  -webkit-text-stroke: 0;
  background: linear-gradient(120deg, var(--accent-primary) 0%, var(--accent-secondary) 40%, var(--accent-tertiary) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  clip-path: circle(0% at var(--mx, 50%) var(--my, 50%));
  transition: clip-path 0.6s var(--ease-cinematic);
}
.outline:hover .fill { clip-path: circle(72% at var(--mx, 50%) var(--my, 50%)); }
@media (prefers-reduced-motion: reduce) {
  .fill { transition: none; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/TextHoverOutline.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/type/TextHoverOutline.vue tests/aurora/TextHoverOutline.test.ts
git commit -m "feat(aurora): TextHoverOutline (aceternity/text-hover-effect)"
```

---

### Task 21: Create `TextGenerate` primitive

**Files:**
- Create: `components/aurora/type/TextGenerate.vue`
- Create: `tests/aurora/TextGenerate.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/TextGenerate.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextGenerate from '~/components/aurora/type/TextGenerate.vue'

describe('TextGenerate', () => {
  it('splits text into one .word span per word', () => {
    const w = mount(TextGenerate, { props: { text: 'one two three' } })
    expect(w.findAll('.word').length).toBe(3)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/TextGenerate.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/type/TextGenerate.vue
     Port of aceternity/text-generate-effect. -->
<template>
  <p class="text-generate">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="word"
      :style="{ animationDelay: `${baseDelay + i * stagger}s` }"
    >{{ word }}<span v-if="i < words.length - 1">&nbsp;</span></span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  text: string
  baseDelay?: number
  stagger?: number
}>(), {
  baseDelay: 0,
  stagger: 0.045,
})
const words = computed(() => props.text.split(/\s+/))
const baseDelay = computed(() => props.baseDelay)
const stagger = computed(() => props.stagger)
</script>

<style scoped>
.text-generate {
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted);
  font-weight: 300;
  max-width: 540px;
}
.word {
  opacity: 0;
  display: inline-block;
  filter: blur(8px);
  animation: blurIn 0.6s var(--ease-cinematic) forwards;
}
@keyframes blurIn { to { opacity: 1; filter: blur(0); } }
@media (prefers-reduced-motion: reduce) {
  .word { animation: none; opacity: 1; filter: none; }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/TextGenerate.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/type/TextGenerate.vue tests/aurora/TextGenerate.test.ts
git commit -m "feat(aurora): TextGenerate (aceternity/text-generate-effect)"
```

---

### Task 22: Create `AuroraButton` primitive

**Files:**
- Create: `components/aurora/primitives/AuroraButton.vue`
- Create: `tests/aurora/AuroraButton.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraButton from '~/components/aurora/primitives/AuroraButton.vue'

describe('AuroraButton', () => {
  it('renders slot content', () => {
    const w = mount(AuroraButton, { slots: { default: 'Click' } })
    expect(w.text()).toContain('Click')
  })
  it('applies ghost class when variant=ghost', () => {
    const w = mount(AuroraButton, { props: { variant: 'ghost' } })
    expect(w.classes()).toContain('btn-ghost')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraButton.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/primitives/AuroraButton.vue -->
<template>
  <component
    :is="to ? resolveAnchor() : 'button'"
    :to="to"
    :href="href"
    :class="['btn', variant === 'ghost' ? 'btn-ghost' : 'btn-primary']"
    :data-cursor-label="cursorLabel"
  >
    <slot />
    <span v-if="showArrow" class="arrow" aria-hidden="true">→</span>
  </component>
</template>

<script setup lang="ts">
import { defineProps, resolveComponent } from 'vue'
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost'
  to?: string
  href?: string
  showArrow?: boolean
  cursorLabel?: string
}>(), {
  variant: 'primary',
  showArrow: false,
})
function resolveAnchor() {
  return resolveComponent('NuxtLink')
}
</script>

<style scoped>
.btn {
  padding: 14px 24px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border-radius: 999px;
  transition: all 0.3s var(--ease-cinematic);
  position: relative; overflow: hidden;
  border: 1px solid transparent;
  display: inline-flex; align-items: center; gap: 10px;
  cursor: none;
  text-decoration: none;
}
.btn-primary { background: var(--text); color: var(--void); }
.btn-primary:hover { background: var(--amber); transform: translateY(-2px); }
.btn-ghost { background: transparent; border-color: var(--glass-border); color: var(--text); }
.btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
.arrow { display: inline-block; transition: transform 0.3s var(--ease-cinematic); }
.btn:hover .arrow { transform: translateX(4px); }
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraButton.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/primitives/AuroraButton.vue tests/aurora/AuroraButton.test.ts
git commit -m "feat(aurora): AuroraButton with solid + ghost variants"
```

---

### Task 23: Create `AuroraDock` component

**Files:**
- Create: `components/aurora/layout/AuroraDock.vue`
- Create: `tests/aurora/AuroraDock.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraDock.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraDock from '~/components/aurora/layout/AuroraDock.vue'

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  i18n: true,
}

describe('AuroraDock', () => {
  it('renders 7 route items', () => {
    const w = mount(AuroraDock, {
      global: {
        stubs,
        mocks: { $t: (k: string) => k, $route: { path: '/' } },
      },
    })
    expect(w.findAll('.dock-item').length).toBe(7)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraDock.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/layout/AuroraDock.vue
     Ported pattern from aceternity/floating-dock + magicui/dock. -->
<template>
  <nav class="dock" aria-label="Primary navigation">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="dock-item"
      :class="{ active: $route.path === item.to }"
      :data-cursor-label="$t(`aurora.cursor.${item.cursorKey}`)"
      :aria-label="$t(`aurora.cursor.${item.cursorKey}`)"
    >{{ $t(`aurora.dock.${item.cursorKey}`) }}</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const items = [
  { to: '/',           cursorKey: 'home' },
  { to: '/about',      cursorKey: 'about' },
  { to: '/experience', cursorKey: 'experience' },
  { to: '/projects',   cursorKey: 'projects' },
  { to: '/blogs',      cursorKey: 'blogs' },
  { to: '/fitness',    cursorKey: 'fitness' },
  { to: '/contact',    cursorKey: 'contact' },
] as const
</script>

<style scoped>
.dock {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  z-index: 50;
  display: flex; align-items: center; gap: 2px;
  padding: 6px;
  background: rgba(12, 12, 20, 0.65);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
}
.dock-item {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 999px;
  color: var(--muted);
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: transform 0.4s var(--ease-cinematic), color 0.3s, background 0.3s;
  position: relative;
  text-decoration: none;
  cursor: none;
}
.dock-item:hover {
  color: var(--text);
  transform: translateY(-6px) scale(1.12);
  background: rgba(255,255,255,0.04);
}
.dock-item.active { color: var(--amber); }
.dock-item.active::after {
  content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
  width: 3px; height: 3px; border-radius: 50%; background: var(--amber);
  box-shadow: 0 0 6px var(--amber);
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraDock.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/layout/AuroraDock.vue tests/aurora/AuroraDock.test.ts
git commit -m "feat(aurora): AuroraDock floating navigation"
```

---

### Task 24: Create `AuroraBrand` + `AuroraMetaTop` peripherals

**Files:**
- Create: `components/aurora/layout/AuroraBrand.vue`
- Create: `components/aurora/layout/AuroraMetaTop.vue`

- [ ] **Step 1: Write `AuroraBrand.vue`**

```vue
<!-- components/aurora/layout/AuroraBrand.vue -->
<template>
  <NuxtLink to="/" class="brand" :data-cursor-label="$t('aurora.cursor.home')">
    x<span class="dot">·</span>q
  </NuxtLink>
</template>

<style scoped>
.brand {
  position: fixed; top: 28px; left: 32px;
  z-index: 50;
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--text);
  text-decoration: none;
  cursor: none;
}
.brand .dot { color: var(--amber); margin: 0 4px; }
</style>
```

- [ ] **Step 2: Write `AuroraMetaTop.vue`**

```vue
<!-- components/aurora/layout/AuroraMetaTop.vue
     Top-right: live "Tashkent" indicator + live UTC+5 clock.
     Locale + theme toggles live here too. -->
<template>
  <div class="meta-top">
    <span class="live">{{ $t('aurora.live') }}</span>
    <span class="clock">{{ time }}</span>
    <button class="meta-btn" data-cursor-state="link" :data-cursor-label="locale === 'en' ? 'RU' : 'EN'" @click="toggleLocale">
      {{ locale === 'en' ? 'RU' : 'EN' }}
    </button>
    <button class="meta-btn" data-cursor-state="link" :data-cursor-label="isDark ? 'Light' : 'Dark'" @click="toggleTheme" :aria-label="isDark ? $t('nav.lightMode') : $t('nav.darkMode')">
      <i v-if="isDark" class="pi pi-sun" />
      <i v-else class="pi pi-moon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const { locale, setLocale } = useI18n()
const toggleLocale = () => setLocale(locale.value === 'en' ? 'ru' : 'en')

const time = ref('--:--:--')
let intervalId = 0

function tickClock() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const tashkent = new Date(utc + 5 * 3600 * 1000)
  const hh = String(tashkent.getHours()).padStart(2, '0')
  const mm = String(tashkent.getMinutes()).padStart(2, '0')
  const ss = String(tashkent.getSeconds()).padStart(2, '0')
  time.value = `${hh}:${mm}:${ss}`
}

onMounted(() => {
  if (!import.meta.client) return
  tickClock()
  intervalId = window.setInterval(tickClock, 1000)
})
onBeforeUnmount(() => clearInterval(intervalId))
</script>

<style scoped>
.meta-top {
  position: fixed; top: 32px; right: 32px;
  z-index: 50;
  display: flex; gap: 20px; align-items: center;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}
.live::before {
  content: ''; display: inline-block;
  width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  margin-right: 8px; vertical-align: middle;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.meta-btn {
  background: transparent; border: none;
  color: var(--text);
  font-family: inherit; font-size: inherit; letter-spacing: inherit;
  cursor: none;
  transition: color 0.3s;
}
.meta-btn:hover { color: var(--amber); }
</style>
```

- [ ] **Step 3: Verify both files compile via `npx nuxi prepare`**

```bash
npx nuxi prepare 2>&1 | tail -3
```
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add components/aurora/layout/AuroraBrand.vue components/aurora/layout/AuroraMetaTop.vue
git commit -m "feat(aurora): AuroraBrand + AuroraMetaTop peripherals"
```

---

### Task 25: Wire dock + brand + meta into `layouts/aurora.vue`

**Files:**
- Modify: `layouts/aurora.vue`

- [ ] **Step 1: Update the layout to mount the new chrome**

Replace the existing `<template>` content with:

```vue
<template>
  <div class="aurora-layout">
    <AuroraWorld />
    <AuroraCursor />
    <AuroraBrand />
    <AuroraMetaTop />
    <main class="content">
      <slot />
    </main>
    <AuroraDock />
  </div>
</template>
```

And extend the `<script setup>` imports:

```ts
import AuroraWorld from '~/components/aurora/backdrop/AuroraWorld.vue'
import AuroraCursor from '~/components/aurora/cursor/AuroraCursor.vue'
import AuroraDock from '~/components/aurora/layout/AuroraDock.vue'
import AuroraBrand from '~/components/aurora/layout/AuroraBrand.vue'
import AuroraMetaTop from '~/components/aurora/layout/AuroraMetaTop.vue'
import { useTheme } from '~/composables/useTheme'
import { useAuroraTheme } from '~/composables/useAuroraTheme'
```

- [ ] **Step 2: Commit**

```bash
git add layouts/aurora.vue
git commit -m "feat(layouts): aurora.vue mounts dock + brand + meta peripherals"
```

---

### Task 26: Create `AuroraMain` hero composition

**Files:**
- Create: `components/aurora/hero/AuroraMain.vue`
- Create: `tests/aurora/AuroraMain.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/aurora/AuroraMain.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuroraMain from '~/components/aurora/hero/AuroraMain.vue'

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  TextHoverOutline: { template: '<span>{{ text }}</span>', props: ['text'] },
  AuroraText: { template: '<span><slot /></span>' },
  AuroraEyebrow: { template: '<div>{{ text }}</div>', props: ['text', 'shine'] },
  TextGenerate: { template: '<p>{{ text }}</p>', props: ['text', 'baseDelay', 'stagger'] },
  AuroraButton: { template: '<button><slot /></button>' },
}

describe('AuroraMain', () => {
  it('renders eyebrow + name + surname + subtitle + CTAs', () => {
    const w = mount(AuroraMain, {
      global: {
        stubs,
        mocks: { $t: (k: string) => k },
      },
    })
    expect(w.find('.hero').exists()).toBe(true)
    expect(w.findAll('button').length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run tests/aurora/AuroraMain.test.ts
```

- [ ] **Step 3: Write the component**

```vue
<!-- components/aurora/hero/AuroraMain.vue
     The home hero composition. -->
<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="eyebrow-wrap">
        <AuroraEyebrow :text="$t('aurora.eyebrow')" shine />
      </div>

      <h1 class="name-wrap">
        <TextHoverOutline :text="$t('aurora.name')" />
      </h1>

      <div class="surname">
        <AuroraText>{{ $t('aurora.surname') }}</AuroraText>
      </div>

      <TextGenerate
        class="subtitle"
        :text="$t('aurora.subtitle')"
        :base-delay="1.0"
        :stagger="0.045"
      />

      <div class="cta-row">
        <AuroraButton
          to="/projects"
          variant="primary"
          show-arrow
          :cursor-label="$t('aurora.cursor.view')"
        >{{ $t('aurora.viewWork') }}</AuroraButton>

        <AuroraButton
          to="/contact"
          variant="ghost"
          :cursor-label="$t('aurora.cursor.reachOut')"
        >{{ $t('aurora.getInTouch') }}</AuroraButton>
      </div>

      <div class="scroll-marker">
        <span class="line" />
        <span>{{ $t('aurora.scrollMarker') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AuroraEyebrow from '~/components/aurora/type/AuroraEyebrow.vue'
import AuroraText from '~/components/aurora/type/AuroraText.vue'
import TextHoverOutline from '~/components/aurora/type/TextHoverOutline.vue'
import TextGenerate from '~/components/aurora/type/TextGenerate.vue'
import AuroraButton from '~/components/aurora/primitives/AuroraButton.vue'
</script>

<style scoped>
.hero {
  position: relative; z-index: 5;
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 0 6vw;
}
.hero-inner { width: 100%; max-width: 1400px; }

.eyebrow-wrap {
  margin-bottom: 32px;
  opacity: 0;
  animation: fadeUp 0.9s var(--ease-cinematic) 0.3s forwards;
}
.name-wrap {
  opacity: 0;
  animation: fadeUp 1.2s var(--ease-cinematic) 0.5s forwards;
}
.surname {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(52px, 11vw, 180px);
  line-height: 0.88;
  letter-spacing: -0.02em;
  margin-top: -8px;
  margin-left: -4px;
  opacity: 0;
  animation: fadeUp 1.2s var(--ease-cinematic) 0.8s forwards;
}
.subtitle { margin-top: 36px; }
.cta-row {
  margin-top: 44px;
  display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
  opacity: 0;
  animation: fadeUp 0.9s var(--ease-cinematic) 2.0s forwards;
}
.scroll-marker {
  position: absolute; bottom: 120px; left: 6vw;
  display: flex; align-items: center; gap: 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0;
  animation: fadeUp 0.8s var(--ease-cinematic) 2.6s forwards;
}
.scroll-marker .line {
  width: 60px; height: 1px;
  background: linear-gradient(90deg, var(--muted), transparent);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .eyebrow-wrap, .name-wrap, .surname, .cta-row, .scroll-marker {
    animation-duration: 0.001ms !important;
    opacity: 1;
  }
}
</style>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run tests/aurora/AuroraMain.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/aurora/hero/AuroraMain.vue tests/aurora/AuroraMain.test.ts
git commit -m "feat(aurora): AuroraMain home hero composition"
```

---

### Task 27: Wire `pages/index.vue` to the aurora hero

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Replace the placeholder content**

```vue
<template>
  <AuroraMain />
</template>

<script setup>
import AuroraMain from '~/components/aurora/hero/AuroraMain.vue'
definePageMeta({ layout: 'aurora' })
</script>
```

- [ ] **Step 2: Commit**

```bash
git add pages/index.vue
git commit -m "feat(pages): use AuroraMain on /"
```

---

### Task 28: Wave 2 visual verification

**Files:**
- (none — verification only)

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 3: Manually verify the home page**

Open `http://localhost:3000/`. Confirm each item below by interacting with the page:

1. **Backdrop**: grid + flickering canvas + two drifting blooms — all visible.
2. **Cursor**: small white dot with amber halo, lags behind real pointer with spring physics, stretches into an oval when moved fast, returns to a circle when still.
3. **Brand top-left**: `x·q` in italic Instrument Serif, amber middle dot. Hovering shows "Home" label next to the cursor.
4. **Meta top-right**: live "Tashkent · 24/7" with pulsing cyan dot, ticking clock, RU/EN locale toggle, theme toggle.
5. **Hero stack**:
   - Eyebrow with the bar + shimmering "Software Architect · Building since 2014".
   - Big outlined "XUSNIDDIN" in Geist 900. Hovering it fills the letters with an indigo→cyan→amber gradient from your cursor position.
   - Italic "qalandarov" beneath, gradient slowly shifting through amber → magenta → cyan.
   - Subtitle words materialize one by one with blur-to-focus.
   - "View Work →" (solid white) and "Get in touch" (ghost) CTAs. Hover flips primary to amber, ghost border to amber.
   - "Scroll · 01 / 04" marker bottom-left.
6. **Dock bottom-center**: 7 mono pills (HM AB EX PR BL FT CT), `HM` is amber with the small dot indicator. Hovering any item lifts it and reveals the route name next to the cursor.
7. **Switch locale to RU**: all strings in the dock, hero, eyebrow swap to Russian. Layout doesn't break.
8. **Switch theme to light**: background flips to warm off-white, text inverts, blooms soften. Aurora world remains coherent (not broken).

If any item fails: debug before declaring Wave 2 done.

- [ ] **Step 4: Stop the dev server and tag the milestone**

```bash
git tag aurora-wave-2-shipped
```

---

## Self-Review (writing-plans skill checklist)

**Spec coverage:**

- §3.1 Palette → Task 4 (`aurora.css`) ✓
- §3.1 Per-route accent → Task 7 (`useAuroraTheme`) ✓
- §3.2 Typography → Task 5 (`nuxt.config.ts` fonts) ✓
- §3.3 Motion language → Task 4 (easing tokens in `aurora.css`) ✓
- §4 Aurora world → Tasks 8–11 ✓
- §5 Smooth cursor → Tasks 12–13 ✓
- §6 Floating dock → Task 23 ✓
- §6 Brand + meta-top → Task 24 ✓
- §7 Hero → Tasks 17–22, 26 ✓
- §9.1 Port methodology → Important Context section ✓
- §9.2 Stack changes (motion-v, cobe) → Task 1 ✓
- §10 Light mode tokens → Task 4 (both modes in `aurora.css`) ✓
- §11 Performance + a11y → reduced-motion + below-640 guards in Tasks 9, 10 ✓
- §12 i18n → Task 16 ✓
- §13 Wave 1 → Tasks 1–15 ✓
- §13 Wave 2 → Tasks 16–28 ✓

**Spec items deferred to follow-up plans:**

- §8 Per-route signatures (Timeline, Globe, Animated Beam, Bento, Focus Cards, Magic Card, Border Beam, Expandable Cards, Hero Highlight, Marquee, Ripple) → Waves 3 + 4
- §13 Wave 5 cutover (delete old components, remove particles.js, full Russian + perf + a11y audit) → its own plan
- §15 Out-of-scope items remain out of scope

**Placeholder scan:** Clean — every step contains the actual file path, code, and expected output the engineer needs.

**Type consistency:** `Accent`, `ROUTE_ACCENTS`, `CursorState`, `useReducedMotion`, `useAuroraCursor`, `useAuroraTheme` signatures are referenced consistently across tasks. The `aurora-cursor-move` custom event is dispatched in Task 12 and consumed in Task 9 — names match.

---

## Next Plans

After this plan is executed and shipped:

1. **`2026-05-29-portfolio-aurora-redesign-wave3.md`** — Projects (`MagicCard`, `BorderBeam`, `FocusCards`, `ExpandableCard`) + About (`AnimatedBeam`, `Marquee`, `BentoGrid`).
2. **`2026-05-29-portfolio-aurora-redesign-wave4.md`** — Inner-page signatures (`Timeline` for `/experience`, `HeroHighlight` for `/blogs`, `Ripple` for `/fitness`, `Globe` for `/contact`).
3. **`2026-05-29-portfolio-aurora-redesign-wave5.md`** — Cutover: delete `AppNavbar.vue`, `AppMain.vue`, `ProjectCard.vue`, `ProjectModal.vue`, `theme.css`. Remove `particles.js`. Light-mode polish pass. Full RU locale verification. Lighthouse + a11y audit.
