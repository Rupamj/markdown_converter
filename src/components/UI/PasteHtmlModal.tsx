import { useState, useCallback } from 'react'
import { ClipboardPaste, X, Check, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'

interface PasteHtmlModalProps {
  onImport: (html: string) => void
}

export default function PasteHtmlModal({ onImport }: PasteHtmlModalProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { theme } = useAppStore()

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch {
      toast.error('Could not read clipboard')
    }
  }, [])

  const handleApply = useCallback(() => {
    if (!input.trim()) { toast.error('Nothing to import'); return }
    onImport(input.trim())
    setInput('')
    setOpen(false)
    toast.success('HTML imported!')
  }, [input, onImport])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
          theme === 'dark'
            ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a] border-[#2a2a2a]'
            : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 border-zinc-200'
        }`}
        style={{ fontFamily: 'Syne, sans-serif' }}
        title="Paste raw HTML"
      >
        <Code2 size={13} />
        Paste HTML
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
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[580px] max-w-[95vw] rounded-2xl border shadow-2xl flex flex-col ${
                theme === 'dark' ? 'bg-[#111] border-[#2a2a2a]' : 'bg-white border-zinc-200'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-2">
                  <Code2 size={15} className="text-amber-400" />
                  <h2 className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Paste HTML</h2>
                </div>
                <button onClick={() => setOpen(false)} className={`w-7 h-7 flex items-center justify-center rounded-md ${theme === 'dark' ? 'hover:bg-[#1f1f1f] text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}>
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Paste raw HTML markup below — it will be loaded into the editor and converted to Markdown.
                </p>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="<h1>Hello World</h1><p>Paste your HTML here…</p>"
                  rows={10}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-mono leading-relaxed outline-none resize-none border ${
                    theme === 'dark'
                      ? 'bg-[#0d0d0d] text-zinc-300 border-[#2a2a2a] placeholder:text-zinc-700'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200 placeholder:text-zinc-400'
                  } focus:border-amber-500/40`}
                />
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-between px-5 py-3 border-t gap-3 ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-zinc-100'}`}>
                <button
                  onClick={handlePasteFromClipboard}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    theme === 'dark'
                      ? 'border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]'
                      : 'border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                  }`}
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  <ClipboardPaste size={13} />
                  Paste from Clipboard
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      theme === 'dark' ? 'text-zinc-400 hover:bg-[#1a1a1a]' : 'text-zinc-500 hover:bg-zinc-100'
                    }`}
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!input.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    <Check size={13} />
                    Import HTML
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
