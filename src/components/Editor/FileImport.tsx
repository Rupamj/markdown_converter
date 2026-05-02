import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'

interface FileImportProps {
  onImport: (html: string) => void
}

export default function FileImport({ onImport }: FileImportProps) {
  const { theme } = useAppStore()
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['html', 'htm', 'txt', 'md'].includes(ext || '')) {
      toast.error('Unsupported file type. Use .html, .htm, .txt, or .md')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (ext === 'html' || ext === 'htm') {
        onImport(content)
      } else {
        const html = content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
        onImport(html)
      }
      toast.success(`Imported ${file.name}`)
    }
    reader.readAsText(file)
  }, [onImport])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`absolute inset-0 z-10 flex items-center justify-center transition-all pointer-events-none ${
        isDragging ? 'opacity-100 pointer-events-auto' : 'opacity-0'
      }`}
    >
      <div
        className={`border-2 border-dashed border-amber-400 rounded-2xl p-12 flex flex-col items-center gap-3 ${
          theme === 'dark' ? 'bg-[#0d0d0d]/90' : 'bg-white/90'
        } backdrop-blur-sm`}
      >
        <Upload size={32} className="text-amber-400" />
        <p className="text-amber-400 font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Drop your file here</p>
        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>.html, .htm, .txt, .md</p>
      </div>
    </div>
  )
}

export function FileImportButton({ onImport }: FileImportProps) {
  const { theme } = useAppStore()

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      if (ext === 'html' || ext === 'htm') {
        onImport(content)
      } else {
        const html = content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
        onImport(html)
      }
      toast.success(`Imported ${file.name}`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [onImport])

  return (
    <label
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
        theme === 'dark'
          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a] border border-[#2a2a2a]'
          : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
      }`}
      style={{ fontFamily: 'Syne, sans-serif' }}
    >
      <Upload size={13} />
      Import
      <input type="file" accept=".html,.htm,.txt,.md" onChange={handleInputChange} className="sr-only" />
    </label>
  )
}
