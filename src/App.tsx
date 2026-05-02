import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Header from './components/Layout/Header'
import StatsBar from './components/Layout/StatsBar'
import OptionsPanel from './components/Layout/OptionsPanel'
import HistoryPanel from './components/Layout/HistoryPanel'
import RichEditor, { type EditorHandle } from './components/Editor/RichEditor'
import MarkdownOutput from './components/Output/MarkdownOutput'

export default function App() {
  const { theme, viewMode } = useAppStore()
  const editorRef = useRef<EditorHandle | null>(null)

  /* Apply theme class to <html> */
  useEffect(() => {
    document.documentElement.className = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0d0d0d] text-zinc-100' : 'bg-[#fafaf9] text-zinc-900'
    }`}>

      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018]" style={{
        backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px),
                          linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Ambient amber glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-72 opacity-[0.05] blur-[100px] rounded-full"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
      </div>

      <Header />

      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="popLayout">

          {/* Editor panel */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <motion.div
              key="editor-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col overflow-hidden ${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              } ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-white'}`}
            >
              <RichEditor editorRef={editorRef} />
            </motion.div>
          )}

          {/* Divider */}
          {viewMode === 'split' && (
            <div key="divider" className={`w-px flex-shrink-0 relative ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-zinc-200'}`}>
              {/* Amber gradient line */}
              <div className="absolute inset-y-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.25) 30%, rgba(245,158,11,0.45) 50%, rgba(245,158,11,0.25) 70%, transparent)' }} />
              {/* Arrow badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center z-10"
                style={{
                  background: theme === 'dark' ? '#1a1a1a' : '#f5f5f0',
                  border: `1px solid ${theme === 'dark' ? '#2a2a2a' : '#e0e0e0'}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M7.5 1L11 5L7.5 9M1 5h10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Markdown panel */}
          {(viewMode === 'split' || viewMode === 'markdown') && (
            <motion.div
              key="markdown-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col overflow-hidden ${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              } ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fafaf9]'}`}
            >
              <MarkdownOutput />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <StatsBar />
      <OptionsPanel />
      <HistoryPanel />

      <Toaster
        position="bottom-right"
        theme={theme}
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '10px',
            border: theme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e5e5e0',
            background: theme === 'dark' ? '#141414' : '#fff',
            color: theme === 'dark' ? '#e5e5e5' : '#1a1a1a',
          },
        }}
      />
    </div>
  )
}
