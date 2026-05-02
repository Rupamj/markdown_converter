import type { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Strikethrough, Code, Link2, Unlink,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Image, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Subscript, Superscript, Table, Undo2, Redo2,
  RemoveFormatting, CodeSquare
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

interface ToolbarProps {
  editor: Editor | null
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  const { theme } = useAppStore()

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('URL:', editor.getAttributes('link').href)
    if (!url) { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
  }

  const addImage = () => {
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const groups = [
    {
      label: 'History',
      btns: [
        { icon: <Undo2 size={14} />, action: () => editor.chain().focus().undo().run(), label: 'Undo', disabled: !editor.can().undo() },
        { icon: <Redo2 size={14} />, action: () => editor.chain().focus().redo().run(), label: 'Redo', disabled: !editor.can().redo() },
      ]
    },
    {
      label: 'Headings',
      btns: [
        { icon: <Heading1 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), label: 'H1', active: editor.isActive('heading', { level: 1 }) },
        { icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), label: 'H2', active: editor.isActive('heading', { level: 2 }) },
        { icon: <Heading3 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), label: 'H3', active: editor.isActive('heading', { level: 3 }) },
      ]
    },
    {
      label: 'Inline',
      btns: [
        { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), label: 'Bold', active: editor.isActive('bold') },
        { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), label: 'Italic', active: editor.isActive('italic') },
        { icon: <Underline size={14} />, action: () => editor.chain().focus().toggleUnderline().run(), label: 'Underline', active: editor.isActive('underline') },
        { icon: <Strikethrough size={14} />, action: () => editor.chain().focus().toggleStrike().run(), label: 'Strike', active: editor.isActive('strike') },
        { icon: <Code size={14} />, action: () => editor.chain().focus().toggleCode().run(), label: 'Inline code', active: editor.isActive('code') },
        { icon: <Highlighter size={14} />, action: () => editor.chain().focus().toggleHighlight().run(), label: 'Highlight', active: editor.isActive('highlight') },
        { icon: <Subscript size={14} />, action: () => editor.chain().focus().toggleSubscript().run(), label: 'Subscript', active: editor.isActive('subscript') },
        { icon: <Superscript size={14} />, action: () => editor.chain().focus().toggleSuperscript().run(), label: 'Superscript', active: editor.isActive('superscript') },
      ]
    },
    {
      label: 'Lists',
      btns: [
        { icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), label: 'Bullet list', active: editor.isActive('bulletList') },
        { icon: <ListOrdered size={14} />, action: () => editor.chain().focus().toggleOrderedList().run(), label: 'Ordered list', active: editor.isActive('orderedList') },
        { icon: <Quote size={14} />, action: () => editor.chain().focus().toggleBlockquote().run(), label: 'Quote', active: editor.isActive('blockquote') },
        { icon: <CodeSquare size={14} />, action: () => editor.chain().focus().toggleCodeBlock().run(), label: 'Code block', active: editor.isActive('codeBlock') },
      ]
    },
    {
      label: 'Align',
      btns: [
        { icon: <AlignLeft size={14} />, action: () => editor.chain().focus().setTextAlign('left').run(), label: 'Left', active: editor.isActive({ textAlign: 'left' }) },
        { icon: <AlignCenter size={14} />, action: () => editor.chain().focus().setTextAlign('center').run(), label: 'Center', active: editor.isActive({ textAlign: 'center' }) },
        { icon: <AlignRight size={14} />, action: () => editor.chain().focus().setTextAlign('right').run(), label: 'Right', active: editor.isActive({ textAlign: 'right' }) },
        { icon: <AlignJustify size={14} />, action: () => editor.chain().focus().setTextAlign('justify').run(), label: 'Justify', active: editor.isActive({ textAlign: 'justify' }) },
      ]
    },
    {
      label: 'Insert',
      btns: [
        { icon: <Link2 size={14} />, action: setLink, label: 'Link', active: editor.isActive('link') },
        { icon: <Unlink size={14} />, action: () => editor.chain().focus().unsetLink().run(), label: 'Unlink', disabled: !editor.isActive('link') },
        { icon: <Image size={14} />, action: addImage, label: 'Image' },
        { icon: <Table size={14} />, action: addTable, label: 'Table' },
        { icon: <Minus size={14} />, action: () => editor.chain().focus().setHorizontalRule().run(), label: 'Divider' },
      ]
    },
    {
      label: 'Clear',
      btns: [
        { icon: <RemoveFormatting size={14} />, action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), label: 'Clear formatting' },
      ]
    }
  ]

  return (
    <div
      className={`flex flex-wrap items-center gap-0 px-3 py-2 border-b overflow-x-auto ${
        theme === 'dark' ? 'bg-[#111] border-[#1f1f1f]' : 'bg-zinc-50 border-[#ebebeb]'
      }`}
    >
      {groups.map((group, gi) => (
        <div key={group.label} className="flex items-center">
          {gi > 0 && (
            <div className={`w-px h-5 mx-1.5 ${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-zinc-200'}`} />
          )}
          {group.btns.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              disabled={btn.disabled}
              title={btn.label}
              className={`toolbar-btn ${(btn as any).active ? 'is-active' : ''} ${
                btn.disabled ? 'opacity-30 cursor-not-allowed' : ''
              } ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
