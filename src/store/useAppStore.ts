import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'split' | 'editor' | 'markdown'
export type MarkdownFlavor = 'github' | 'commonmark' | 'ghost'
export type BulletStyle = 'dash' | 'asterisk' | 'plus'
export type HeadingStyle = 'atx' | 'setext'

export interface ConversionOptions {
  bulletStyle: BulletStyle
  headingStyle: HeadingStyle
  fence: string
  hr: string
  strongDelimiter: string
  emDelimiter: string
  linkStyle: 'inlined' | 'referenced'
  preserveEmptyLines: boolean
  tableSupport: boolean
}

export interface HistoryEntry {
  html: string
  markdown: string
  timestamp: number
  label: string
}

interface AppState {
  theme: 'dark' | 'light'
  viewMode: ViewMode
  markdownFlavor: MarkdownFlavor
  options: ConversionOptions
  history: HistoryEntry[]
  currentHtml: string
  currentMarkdown: string
  wordCount: number
  charCount: number
  lineCount: number
  isCopied: boolean
  isConverting: boolean
  showOptions: boolean
  showHistory: boolean
  showStats: boolean

  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  setViewMode: (mode: ViewMode) => void
  setMarkdownFlavor: (flavor: MarkdownFlavor) => void
  updateOptions: (opts: Partial<ConversionOptions>) => void
  setCurrentHtml: (html: string) => void
  setCurrentMarkdown: (md: string) => void
  updateStats: (html: string, md: string) => void
  addToHistory: (entry: HistoryEntry) => void
  clearHistory: () => void
  setIsCopied: (v: boolean) => void
  setIsConverting: (v: boolean) => void
  setShowOptions: (v: boolean) => void
  setShowHistory: (v: boolean) => void
  setShowStats: (v: boolean) => void
}

const defaultOptions: ConversionOptions = {
  bulletStyle: 'dash',
  headingStyle: 'atx',
  fence: '```',
  hr: '---',
  strongDelimiter: '**',
  emDelimiter: '_',
  linkStyle: 'inlined',
  preserveEmptyLines: false,
  tableSupport: true,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      viewMode: 'split',
      markdownFlavor: 'github',
      options: defaultOptions,
      history: [],
      currentHtml: '',
      currentMarkdown: '',
      wordCount: 0,
      charCount: 0,
      lineCount: 0,
      isCopied: false,
      isConverting: false,
      showOptions: false,
      showHistory: false,
      showStats: true,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setViewMode: (viewMode) => set({ viewMode }),
      setMarkdownFlavor: (markdownFlavor) => set({ markdownFlavor }),
      updateOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),
      setCurrentHtml: (html) => set({ currentHtml: html }),
      setCurrentMarkdown: (md) => set({ currentMarkdown: md }),
      updateStats: (_html, md) => {
        const text = md.replace(/[#*_`~[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim()
        const words = text ? text.split(/\s+/).length : 0
        const chars = md.length
        const lines = md ? md.split('\n').length : 0
        set({ wordCount: words, charCount: chars, lineCount: lines })
      },
      addToHistory: (entry) =>
        set((s) => ({ history: [entry, ...s.history].slice(0, 30) })),
      clearHistory: () => set({ history: [] }),
      setIsCopied: (isCopied) => set({ isCopied }),
      setIsConverting: (isConverting) => set({ isConverting }),
      setShowOptions: (showOptions) => set({ showOptions }),
      setShowHistory: (showHistory) => set({ showHistory }),
      setShowStats: (showStats) => set({ showStats }),
    }),
    {
      name: 'richtomd-storage',
      partialize: (state) => ({
        theme: state.theme,
        options: state.options,
        markdownFlavor: state.markdownFlavor,
        history: state.history,
        viewMode: state.viewMode,
      }),
    }
  )
)
