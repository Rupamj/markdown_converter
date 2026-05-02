import { Keyboard, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const shortcuts = [
  { keys: ['Ctrl', 'Shift', 'C'], desc: 'Copy Markdown' },
  { keys: ['Ctrl', '1'], desc: 'Editor only view' },
  { keys: ['Ctrl', '2'], desc: 'Split view' },
  { keys: ['Ctrl', '3'], desc: 'Markdown only view' },
  { keys: ['Ctrl', ','], desc: 'Open Options' },
  { keys: ['Ctrl', 'H'], desc: 'Open History' },
  { keys: ['Ctrl', 'D'], desc: 'Toggle Dark/Light' },
  { keys: ['Ctrl', 'Z'], desc: 'Undo' },
  { keys: ['Ctrl', 'Y'], desc: 'Redo' },
  { keys: ['Ctrl', 'B'], desc: 'Bold' },
  { keys: ['Ctrl', 'I'], desc: 'Italic' },
  { keys: ['Ctrl', 'U'], desc: 'Underline' },
  { keys: ['Ctrl', 'K'], desc: 'Insert Link' },
]

export default function ShortcutsModal() {
  const [open, setOpen] = useState(false)
  const { theme } = useAppStore()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
          theme === 'dark' ? 'text-zinc-600 hover:text-zinc-300 hover:bg-[#1f1f1f]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
        }`}
        title="Keyboard shortcuts"
      >
        <Keyboard size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 rounded-2xl border shadow-2xl ${
                theme === 'dark' ? 'bg-[#111] border-[#2a2a2a]' : 'bg-white border-zinc-200'
              }`}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-2">
                  <Keyboard size={15} className="text-amber-400" />
                  <h2 className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md ${theme === 'dark' ? 'hover:bg-[#1f1f1f] text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="px-5 py-4 space-y-1.5 max-h-80 overflow-y-auto">
                {shortcuts.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{s.desc}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {s.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                            theme === 'dark' ? 'bg-[#1a1a1a] border-[#2a2a2a] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                          }`}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
