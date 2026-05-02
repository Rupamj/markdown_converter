import type { Editor } from '@tiptap/react'
import { useAppStore } from '../../store/useAppStore'
import { FileImportButton } from './FileImport'
import PasteHtmlModal from '../UI/PasteHtmlModal'

interface EditorStatusBarProps {
  editor: Editor | null
}

export default function EditorStatusBar({ editor }: EditorStatusBarProps) {
  const { theme, currentMarkdown, currentHtml } = useAppStore()

  const handleImport = (html: string) => {
    if (!editor) return
    editor.commands.setContent(html)
  }

  const words = currentMarkdown
    ? currentMarkdown.replace(/[#*_`~[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length
    : 0

  return (
    <div
      className={`flex items-center justify-between px-4 py-1.5 border-t text-[11px] ${
        theme === 'dark'
          ? 'bg-[#0a0a0a] border-[#1a1a1a] text-zinc-600'
          : 'bg-zinc-50 border-zinc-100 text-zinc-400'
      }`}
    >
      <div className="flex items-center gap-4">
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {words.toLocaleString()} words
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {currentHtml.length.toLocaleString()} chars (HTML)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <PasteHtmlModal onImport={handleImport} />
        <FileImportButton onImport={handleImport} />
      </div>
    </div>
  )
}
