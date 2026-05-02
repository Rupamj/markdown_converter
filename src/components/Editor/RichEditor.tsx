import { useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import { Table as TableExt } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import HighlightExt from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import SubscriptExt from '@tiptap/extension-subscript'
import SuperscriptExt from '@tiptap/extension-superscript'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Placeholder } from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar'
import EditorStatusBar from './EditorStatusBar'
import { useAppStore } from '../../store/useAppStore'
import { convertHtmlToMarkdown } from '../../lib/converter'
import { useDebounce } from '../../hooks/useDebounce'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { toast } from 'sonner'

const lowlight = createLowlight(common)

const PlaceholderExt = Placeholder.configure({
  placeholder: 'Start typing… paste rich text, HTML, or drop a file here.',
})

const STARTER_CONTENT = `<h1>Welcome to RichToMD ✦</h1>
<p>This is a <strong>professional</strong> rich text to Markdown converter. Type or paste content here and watch it convert in real time on the right.</p>
<h2>What you can do</h2>
<ul>
  <li><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s> and more</li>
  <li>Headings, bullet &amp; ordered lists, blockquotes</li>
  <li>Inline <code>code</code> and fenced code blocks</li>
  <li>Tables, links, images, horizontal rules</li>
  <li>Highlight, superscript<sup>2</sup> and subscript<sub>x</sub></li>
</ul>
<h2>Configurable output</h2>
<p>Open <strong>Options</strong> (top right) to pick your Markdown flavour, bullet style, heading style, link format, and more. All settings are persisted automatically.</p>
<blockquote><p>Great writing is clear thinking made visible.</p></blockquote>
<pre><code class="language-typescript">// Everything converts in real-time
const md = turndown.turndown(editor.getHTML())
console.log(md)</code></pre>`

// Expose editor instance so PasteHtmlModal / FileImport can call it
export type EditorHandle = {
  setContent: (html: string) => void
  clearContent: () => void
}

interface RichEditorProps {
  editorRef?: React.MutableRefObject<EditorHandle | null>
}

export default function RichEditor({ editorRef }: RichEditorProps) {
  const { theme, options, setCurrentHtml, setCurrentMarkdown, updateStats, currentMarkdown } = useAppStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  /* ── Clipboard copy for keyboard shortcut ── */
  const copyMd = useCallback(async () => {
    if (!currentMarkdown) return
    await navigator.clipboard.writeText(currentMarkdown)
    toast.success('Copied to clipboard!')
  }, [currentMarkdown])

  useKeyboardShortcuts(copyMd)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      ImageExt.configure({ allowBase64: true }),
      TableExt.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      HighlightExt.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      SubscriptExt,
      SuperscriptExt,
      CodeBlockLowlight.configure({ lowlight }),
      PlaceholderExt,
    ],
    content: STARTER_CONTENT,
    editorProps: {
      attributes: { class: 'tiptap h-full', spellcheck: 'true' },
    },
  })

  /* ── Expose handle ── */
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = {
        setContent: (html: string) => { editor.commands.setContent(html); sync() },
        clearContent: () => { editor.commands.clearContent(); sync() },
      }
    }
  }, [editor, editorRef])

  const sync = useCallback(() => {
    if (!editor) return
    const html = editor.getHTML()
    const md = convertHtmlToMarkdown(html, options)
    setCurrentHtml(html)
    setCurrentMarkdown(md)
    updateStats(html, md)
  }, [editor, options, setCurrentHtml, setCurrentMarkdown, updateStats])

  const debouncedSync = useDebounce(sync, 120)

  useEffect(() => {
    if (!editor) return
    editor.on('update', debouncedSync)
    return () => { editor.off('update', debouncedSync) }
  }, [editor, debouncedSync])

  // re-convert when options change
  useEffect(() => { if (editor) sync() }, [options]) // eslint-disable-line

  // initial sync
  useEffect(() => { if (editor) sync() }, [editor]) // eslint-disable-line

  /* ── Drag-and-drop file onto editor ── */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !editor) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['html', 'htm', 'txt', 'md'].includes(ext || '')) {
      toast.error('Unsupported file. Use .html, .htm, .txt or .md')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      let html: string
      if (ext === 'html' || ext === 'htm') {
        html = content
      } else {
        html = content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
      }
      editor.commands.setContent(html)
      sync()
      toast.success(`Imported ${file.name}`)
    }
    reader.readAsText(file)
  }, [editor, sync])

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col h-full"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <EditorToolbar editor={editor} />
      <div
        className={`flex-1 overflow-y-auto px-8 py-6 ${
          theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
        }`}
      >
        <div className="max-w-3xl mx-auto min-h-full">
          <EditorContent editor={editor} className="min-h-full" />
        </div>
      </div>
      <EditorStatusBar editor={editor} />
    </div>
  )
}
