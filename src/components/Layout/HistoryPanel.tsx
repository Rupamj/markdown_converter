import { X, Clock, Trash2, ArrowUpRight, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'

export default function HistoryPanel() {
  const { theme, showHistory, setShowHistory, history, clearHistory } = useAppStore()

  const fmt = (ts: number) => new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <AnimatePresence>
      {showHistory && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 left-0 h-full w-80 z-50 flex flex-col border-r shadow-2xl ${
              theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-zinc-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-zinc-100'}`}>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'Syne, sans-serif' }}>History</h2>
                {history.length > 0 && (
                  <span className="text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full font-mono">{history.length}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button onClick={() => { clearHistory(); toast.success('History cleared') }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Clear all history">
                    <Trash2 size={13} />
                  </button>
                )}
                <button onClick={() => setShowHistory(false)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md ${theme === 'dark' ? 'hover:bg-[#1f1f1f] text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
                  <Clock size={28} className="text-amber-400/30" />
                  <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}
                     style={{ fontFamily: 'Syne, sans-serif' }}>No history yet</p>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    Click the <strong className="text-amber-400/70">↺</strong> button in the Markdown panel to save a snapshot here.
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {history.map((entry, i) => (
                    <motion.div
                      key={entry.timestamp}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`group rounded-xl p-3.5 border cursor-pointer transition-all hover:border-amber-500/25 ${
                        theme === 'dark' ? 'bg-[#141414] border-[#1f1f1f] hover:bg-[#1a1a1a]'
                                         : 'bg-zinc-50 border-zinc-100 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}
                             style={{ fontFamily: 'Syne, sans-serif' }}>
                            {entry.label || 'Untitled'}
                          </p>
                          <p className={`text-[10px] mt-0.5 font-mono ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            {fmt(entry.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(entry.markdown); toast.success('Copied from history!') }}
                            className={`p-1 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-[#252525] text-zinc-500 hover:text-amber-400' : 'hover:bg-zinc-100 text-zinc-400 hover:text-amber-500'}`}
                            title="Copy markdown">
                            <RotateCcw size={11} />
                          </button>
                          <ArrowUpRight size={12} className={theme === 'dark' ? 'text-zinc-600 group-hover:text-amber-400' : 'text-zinc-400 group-hover:text-amber-500'} />
                        </div>
                      </div>

                      {/* Preview */}
                      <p className={`text-[11px] mt-2 line-clamp-2 font-mono leading-relaxed ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {entry.markdown.slice(0, 120)}{entry.markdown.length > 120 ? '…' : ''}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'}`}>
                          {entry.markdown.split('\n').length} lines
                        </span>
                        <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'}`}>
                          {entry.markdown.length.toLocaleString()} chars
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className={`px-5 py-3 border-t text-[10px] ${theme === 'dark' ? 'border-[#1f1f1f] text-zinc-700' : 'border-zinc-100 text-zinc-400'}`}>
              Up to 30 snapshots saved. Click any to copy Markdown.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
