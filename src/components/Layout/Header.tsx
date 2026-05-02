import { Sun, Moon, Columns2, FileText, Code2, History, Settings2, BarChart3 } from 'lucide-react'
import { type ViewMode, useAppStore } from '../../store/useAppStore'
import { motion } from 'framer-motion'
import ShortcutsModal from '../UI/ShortcutsModal'

export default function Header() {
  const { theme, toggleTheme, viewMode, setViewMode, showHistory, setShowHistory, showOptions, setShowOptions, showStats, setShowStats } = useAppStore()

  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'editor',   icon: <FileText size={15} />, label: 'Editor'   },
    { mode: 'split',    icon: <Columns2 size={15} />, label: 'Split'    },
    { mode: 'markdown', icon: <Code2    size={15} />, label: 'Markdown' },
  ]

  return (
    <header className={`flex items-center justify-between px-5 py-3 border-b relative z-30 ${
      theme === 'dark' ? 'bg-[#0d0d0d] border-[#1f1f1f]' : 'bg-white border-[#ebebeb]'
    }`}>

      {/* ── Logo ── */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
        <div className="relative w-8 h-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h7M2 7h5M2 11h9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M11 6l3 2-3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse-amber" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
            <span className="gradient-text">RichToMD</span>
          </h1>
          <p className={`text-[10px] leading-tight mt-0.5 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Rich Text → Markdown
          </p>
        </div>
      </motion.div>

      {/* ── View switcher ── */}
      <div className={`flex items-center gap-0.5 p-1 rounded-lg ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-zinc-100'}`}>
        {views.map(({ mode, icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              viewMode === mode
                ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/30'
                : theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#252525]'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
            title={`${label} (Ctrl+${views.indexOf({ mode, icon, label }) + 1})`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1">
        <HeaderIconBtn active={showStats}   onClick={() => setShowStats(!showStats)}     label="Toggle Stats (Ctrl+Shift+S)" theme={theme}><BarChart3 size={16} /></HeaderIconBtn>
        <HeaderIconBtn active={showHistory} onClick={() => setShowHistory(!showHistory)} label="History (Ctrl+H)"             theme={theme}><History   size={16} /></HeaderIconBtn>
        <HeaderIconBtn active={showOptions} onClick={() => setShowOptions(!showOptions)} label="Options (Ctrl+,)"             theme={theme}><Settings2 size={16} /></HeaderIconBtn>
        <ShortcutsModal />
        <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-zinc-200'}`} />
        <button
          onClick={toggleTheme}
          title="Toggle theme (Ctrl+D)"
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-300 ${
            theme === 'dark' ? 'text-amber-400 hover:bg-[#1a1a1a]' : 'text-amber-500 hover:bg-zinc-100'
          }`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}

function HeaderIconBtn({ children, active, onClick, label, theme }: {
  children: React.ReactNode; active: boolean; onClick: () => void; label: string; theme: string
}) {
  return (
    <button onClick={onClick} title={label} className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 ${
      active ? 'bg-amber-500/15 text-amber-400'
             : theme === 'dark' ? 'text-zinc-500 hover:text-zinc-200 hover:bg-[#1a1a1a]'
                                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
    }`}>
      {children}
    </button>
  )
}
