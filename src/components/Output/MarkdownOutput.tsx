import { useState, useCallback } from 'react'
import { Copy, Check, Download, FileDown, RefreshCw, Eye, EyeOff, Search, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function MarkdownOutput() {
  const { theme, currentMarkdown, isCopied, setIsCopied, addToHistory, currentHtml } = useAppStore()
  const [showPreview, setShowPreview] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const copyToClipboard = useCallback(async () => {
    if (!currentMarkdown) return
    try {
      await navigator.clipboard.writeText(currentMarkdown)
      setIsCopied(true)
      toast.success('Copied to clipboard!', { duration: 2000 })
      setTimeout(() => setIsCopied(false), 2000)
    } catch { toast.error('Failed to copy') }
  }, [currentMarkdown, setIsCopied])

  const downloadMarkdown = useCallback(() => {
    if (!currentMarkdown) { toast.error('Nothing to download'); return }
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `converted-${Date.now()}.md`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded .md!')
  }, [currentMarkdown])

  const downloadHtml = useCallback(() => {
    if (!currentHtml) { toast.error('Nothing to download'); return }
    const blob = new Blob([currentHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `source-${Date.now()}.html`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded .html!')
  }, [currentHtml])

  const saveToHistory = useCallback(() => {
    if (!currentMarkdown) { toast.error('Nothing to save'); return }
    addToHistory({
      html: currentHtml,
      markdown: currentMarkdown,
      timestamp: Date.now(),
      label: currentMarkdown.split('\n')[0].replace(/^#+\s*/, '').slice(0, 48) || 'Untitled',
    })
    toast.success('Saved to history!')
  }, [currentMarkdown, currentHtml, addToHistory])

  /* Search highlight */
  const safeSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const highlighted = searchTerm && currentMarkdown
    ? currentMarkdown.replace(
        new RegExp(`(${safeSearch})`, 'gi'),
        '<mark style="background:rgba(245,158,11,0.4);border-radius:2px;padding:0 2px">$1</mark>'
      )
    : ''

  const matchCount = searchTerm && currentMarkdown
    ? (currentMarkdown.match(new RegExp(safeSearch, 'gi')) || []).length
    : 0

  return (
    <div className="flex flex-col h-full">

      {/* ── Toolbar ── */}
      <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${
        theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-zinc-50 border-[#ebebeb]'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}
            style={{ fontFamily: 'Syne, sans-serif' }}>Output</span>
          {currentMarkdown && (
            <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-mono">
              {currentMarkdown.split('\n').length} lines
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ActionBtn theme={theme} onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm('') }} label="Search (Ctrl+F)">
            <Search size={14} />
          </ActionBtn>
          <ActionBtn theme={theme} onClick={() => setShowPreview(!showPreview)} label={showPreview ? 'Raw view' : 'Rendered preview'}>
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          </ActionBtn>
          <ActionBtn theme={theme} onClick={saveToHistory} label="Save to history">
            <RefreshCw size={14} />
          </ActionBtn>
          <ActionBtn theme={theme} onClick={downloadHtml} label="Download source HTML">
            <FileDown size={14} />
          </ActionBtn>
          <ActionBtn theme={theme} onClick={downloadMarkdown} label="Download .md">
            <Download size={14} />
          </ActionBtn>
          <button onClick={copyToClipboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ml-1 ${
              isCopied ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                       : 'bg-amber-500 text-black hover:bg-amber-400 shadow-sm shadow-amber-500/20'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`overflow-hidden border-b shrink-0 ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-[#ebebeb]'}`}
          >
            <div className="px-4 py-2 flex items-center gap-2">
              <Search size={13} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Find in markdown…"
                className={`flex-1 text-sm py-1 bg-transparent outline-none font-mono ${
                  theme === 'dark' ? 'text-zinc-200 placeholder:text-zinc-600' : 'text-zinc-800 placeholder:text-zinc-400'
                }`}
              />
              {searchTerm && (
                <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {matchCount} match{matchCount !== 1 ? 'es' : ''}
                </span>
              )}
              <button onClick={() => { setSearchTerm(''); setShowSearch(false) }}
                className={`p-0.5 rounded ${theme === 'dark' ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}>
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-hidden relative">
        {!currentMarkdown
          ? <EmptyState theme={theme} />
          : showPreview
          ? <MarkdownPreviewPane theme={theme} markdown={currentMarkdown} />
          : (
            <div className="h-full overflow-y-auto p-6">
              {searchTerm
                ? <pre className={`md-output whitespace-pre-wrap break-words ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}
                       dangerouslySetInnerHTML={{ __html: highlighted }} />
                : <MarkdownColored markdown={currentMarkdown} theme={theme} />
              }
            </div>
          )
        }
      </div>

      {/* ── Bottom status ── */}
      <div className={`flex items-center justify-between px-4 py-1.5 border-t text-[11px] shrink-0 ${
        theme === 'dark' ? 'bg-[#080808] border-[#1a1a1a] text-zinc-600' : 'bg-zinc-50 border-zinc-100 text-zinc-400'
      }`}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {currentMarkdown.length.toLocaleString()} chars
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          theme === 'dark' ? 'bg-[#1a1a1a] text-zinc-500' : 'bg-zinc-100 text-zinc-400'
        }`} style={{ fontFamily: 'Syne, sans-serif' }}>
          {showPreview ? 'PREVIEW' : 'RAW'}
        </span>
      </div>
    </div>
  )
}

/* ── Syntax-coloured raw view ── */
function MarkdownColored({ markdown, theme }: { markdown: string; theme: string }) {
  return (
    <pre className={`md-output whitespace-pre-wrap break-words ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
      {markdown.split('\n').map((line, i) => {
        let cls = ''
        if      (/^# /.test(line))       cls = 'text-amber-400 font-bold'
        else if (/^## /.test(line))      cls = 'text-amber-300 font-semibold'
        else if (/^### /.test(line))     cls = 'text-amber-200'
        else if (/^####/.test(line))     cls = theme === 'dark' ? 'text-amber-100' : 'text-amber-700'
        else if (/^>/.test(line))        cls = theme === 'dark' ? 'text-zinc-500 italic' : 'text-zinc-400 italic'
        else if (/^```/.test(line))      cls = 'text-emerald-400'
        else if (/^\|/.test(line))       cls = theme === 'dark' ? 'text-sky-300' : 'text-sky-600'
        else if (/^---/.test(line) && line.trim() === '---') cls = 'text-zinc-600'
        else if (/^(\s*[-*+]|\s*\d+\.) /.test(line)) cls = theme === 'dark' ? 'text-zinc-200' : 'text-zinc-600'
        return <span key={i} className={cls}>{line}{'\n'}</span>
      })}
    </pre>
  )
}

/* ── Simple rendered preview ── */
function MarkdownPreviewPane({ theme, markdown }: { theme: string; markdown: string }) {
  const html = markdown
    .replace(/^#### (.+)$/gm, '<h4 style="font-family:Syne,sans-serif;font-size:1rem;font-weight:600;margin:0.6rem 0 0.3rem">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 style="font-family:Syne,sans-serif;font-size:1.15rem;font-weight:600;margin:0.75rem 0 0.35rem">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-family:Syne,sans-serif;font-size:1.5rem;font-weight:700;margin:1rem 0 0.5rem">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-family:Syne,sans-serif;font-size:2rem;font-weight:800;margin:1.2rem 0 0.6rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="font-family:JetBrains Mono,monospace;background:rgba(245,158,11,0.15);padding:0.1em 0.4em;border-radius:4px;color:#f59e0b;font-size:0.875em">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #f59e0b;margin:0.75rem 0;padding:0.4rem 1rem;opacity:0.85;font-style:italic;background:rgba(245,158,11,0.05);border-radius:0 6px 6px 0">$1</blockquote>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #2a2a2a;margin:1.25rem 0">')
    .replace(/^\s*[-*+] (.+)$/gm, '<li style="margin:0.2rem 0;padding-left:0.25rem">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, m => `<ul style="padding-left:1.5rem;margin:0.5rem 0;list-style:disc">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:0.5rem 0">')
    .replace(/\n/g, '<br>')

  return (
    <div
      className={`h-full overflow-y-auto px-8 py-6 leading-relaxed ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}
      style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' }}
      dangerouslySetInnerHTML={{ __html: `<p style="margin:0.5rem 0">${html}</p>` }}
    />
  )
}

/* ── Empty state ── */
function EmptyState({ theme }: { theme: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500/20 flex items-center justify-center opacity-40">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#f59e0b" strokeWidth="1.5"/>
          <polyline points="14 2 14 8 20 8" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="#f59e0b" strokeWidth="1.5"/>
        </svg>
      </div>
      <p className={`text-sm font-medium opacity-40 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}
         style={{ fontFamily: 'Syne, sans-serif' }}>Markdown output will appear here</p>
      <p className={`text-xs opacity-30 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
        Start typing in the editor on the left
      </p>
    </div>
  )
}

function ActionBtn({ children, onClick, label, theme }: {
  children: React.ReactNode; onClick: () => void; label: string; theme: string
}) {
  return (
    <button onClick={onClick} title={label}
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
        theme === 'dark' ? 'text-zinc-500 hover:text-zinc-200 hover:bg-[#1f1f1f]'
                         : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
      }`}>
      {children}
    </button>
  )
}
