import TurndownService from 'turndown'
import type { ConversionOptions } from '../store/useAppStore'

let cachedService: TurndownService | null = null
let cachedOptions: string = ''

export function createConverter(options: ConversionOptions): TurndownService {
  const key = JSON.stringify(options)
  if (cachedService && cachedOptions === key) return cachedService

  const bulletMap: Record<string, '-' | '*' | '+'> = { dash: '-', asterisk: '*', plus: '+' }
  const td = new TurndownService({
    headingStyle: options.headingStyle,
    hr: options.hr,
    bulletListMarker: bulletMap[options.bulletStyle] ?? '-',
    codeBlockStyle: 'fenced',
    fence: options.fence as '```' | '~~~',
    emDelimiter: options.emDelimiter as '_' | '*',
    strongDelimiter: options.strongDelimiter as '**' | '__',
    linkStyle: options.linkStyle,
    linkReferenceStyle: 'full',
  })

  // Table support
  if (options.tableSupport) {
    td.addRule('tableCell', {
      filter: ['th', 'td'],
      replacement: (content) => ` ${content.trim()} |`
    })
    td.addRule('tableRow', {
      filter: 'tr',
      replacement: (content, node) => {
        const isHeader = (node as Element).parentElement?.nodeName === 'THEAD'
        const cells = content.replace(/^\s*\|/, '').split('|').slice(0, -1)
        const row = '| ' + cells.map(c => c.trim()).join(' | ') + ' |'
        if (isHeader) {
          const sep = '| ' + cells.map(() => '---').join(' | ') + ' |'
          return row + '\n' + sep + '\n'
        }
        return row + '\n'
      }
    })
    td.addRule('table', {
      filter: ['table'],
      replacement: (content) => '\n\n' + content + '\n\n'
    })
    td.addRule('tableSect', {
      filter: ['thead', 'tbody', 'tfoot'],
      replacement: (content) => content
    })
  }

  // Strikethrough
  td.addRule('strikethrough', {
    filter: (node) => node.nodeName === 'DEL' || node.nodeName === 'S',
    replacement: (content) => `~~${content}~~`,
  })

  // Highlight
  td.addRule('highlight', {
    filter: ['mark'],
    replacement: (content) => `==${content}==`,
  })

  // Subscript
  td.addRule('subscript', {
    filter: ['sub'],
    replacement: (content) => `~${content}~`,
  })

  // Superscript
  td.addRule('superscript', {
    filter: ['sup'],
    replacement: (content) => `^${content}^`,
  })

  cachedService = td
  cachedOptions = key
  return td
}

export function convertHtmlToMarkdown(html: string, options: ConversionOptions): string {
  if (!html || html === '<p></p>' || html === '<p><br></p>') return ''
  try {
    const td = createConverter(options)
    let markdown = td.turndown(html)
    if (!options.preserveEmptyLines) {
      markdown = markdown.replace(/\n{3,}/g, '\n\n')
    }
    return markdown.trim()
  } catch (err) {
    console.error('Conversion error:', err)
    return ''
  }
}

export function countWords(text: string): number {
  const clean = text.replace(/[#*_`~[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim()
  return clean ? clean.split(/\s+/).length : 0
}

export function estimateReadingTime(wordCount: number): string {
  const mins = Math.ceil(wordCount / 200)
  if (mins < 1) return '< 1 min'
  return `${mins} min${mins > 1 ? 's' : ''}`
}

export function htmlToPlainText(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
