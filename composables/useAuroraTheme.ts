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
  if (typeof window === 'undefined') return
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
