import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useKeyboardShortcuts(copyFn: () => void) {
  const { toggleTheme, setViewMode, setShowOptions, setShowHistory } = useAppStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return

      if (e.key === 'c' && e.shiftKey) {
        e.preventDefault()
        copyFn()
      } else if (e.key === '1') {
        e.preventDefault()
        setViewMode('editor')
      } else if (e.key === '2') {
        e.preventDefault()
        setViewMode('split')
      } else if (e.key === '3') {
        e.preventDefault()
        setViewMode('markdown')
      } else if (e.key === ',') {
        e.preventDefault()
        setShowOptions(true)
      } else if (e.key === 'h') {
        e.preventDefault()
        setShowHistory(true)
      } else if (e.key === 'd') {
        e.preventDefault()
        toggleTheme()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [copyFn, toggleTheme, setViewMode, setShowOptions, setShowHistory])
}
