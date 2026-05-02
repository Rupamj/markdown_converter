import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type BulletStyle, type HeadingStyle, useAppStore } from '../../store/useAppStore'

export default function OptionsPanel() {
  const { theme, showOptions, setShowOptions, options, updateOptions, markdownFlavor, setMarkdownFlavor } = useAppStore()

  return (
    <AnimatePresence>
      {showOptions && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOptions(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col border-l shadow-2xl ${
              theme === 'dark' ? 'bg-[#0f0f0f] border-[#1f1f1f]' : 'bg-white border-zinc-200'
            }`}
          >
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-[#1f1f1f]' : 'border-zinc-100'}`}>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'Syne, sans-serif' }}>
                Conversion Options
              </h2>
              <button
                onClick={() => setShowOptions(false)}
                className={`w-7 h-7 flex items-center justify-center rounded-md ${theme === 'dark' ? 'hover:bg-[#1f1f1f] text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              <Section label="Markdown Flavor" theme={theme}>
                <SelectGroup
                  value={markdownFlavor}
                  onChange={(v) => setMarkdownFlavor(v as 'github' | 'commonmark' | 'ghost')}
                  options={[
                    { value: 'github', label: 'GitHub Flavored' },
                    { value: 'commonmark', label: 'CommonMark' },
                    { value: 'ghost', label: 'Ghost / Standard' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Heading Style" theme={theme}>
                <RadioGroup
                  value={options.headingStyle}
                  onChange={(v) => updateOptions({ headingStyle: v as HeadingStyle })}
                  options={[
                    { value: 'atx', label: '# ATX style' },
                    { value: 'setext', label: '=== Setext style' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Bullet List Marker" theme={theme}>
                <RadioGroup
                  value={options.bulletStyle}
                  onChange={(v) => updateOptions({ bulletStyle: v as BulletStyle })}
                  options={[
                    { value: 'dash', label: '- Dash' },
                    { value: 'asterisk', label: '* Asterisk' },
                    { value: 'plus', label: '+ Plus' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Code Fence Style" theme={theme}>
                <RadioGroup
                  value={options.fence}
                  onChange={(v) => updateOptions({ fence: v })}
                  options={[
                    { value: '```', label: '``` Backticks' },
                    { value: '~~~', label: '~~~ Tildes' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Bold Delimiter" theme={theme}>
                <RadioGroup
                  value={options.strongDelimiter}
                  onChange={(v) => updateOptions({ strongDelimiter: v })}
                  options={[
                    { value: '**', label: '** Asterisks' },
                    { value: '__', label: '__ Underscores' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Italic Delimiter" theme={theme}>
                <RadioGroup
                  value={options.emDelimiter}
                  onChange={(v) => updateOptions({ emDelimiter: v })}
                  options={[
                    { value: '_', label: '_ Underscore' },
                    { value: '*', label: '* Asterisk' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Horizontal Rule" theme={theme}>
                <RadioGroup
                  value={options.hr}
                  onChange={(v) => updateOptions({ hr: v })}
                  options={[
                    { value: '---', label: '--- Dashes' },
                    { value: '***', label: '*** Asterisks' },
                    { value: '___', label: '___ Underscores' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Link Style" theme={theme}>
                <RadioGroup
                  value={options.linkStyle}
                  onChange={(v) => updateOptions({ linkStyle: v as 'inlined' | 'referenced' })}
                  options={[
                    { value: 'inlined', label: '[text](url) Inline' },
                    { value: 'referenced', label: '[text][ref] Referenced' },
                  ]}
                  theme={theme}
                />
              </Section>

              <Section label="Extras" theme={theme}>
                <Toggle label="Table Support (GFM)" value={options.tableSupport} onChange={(v) => updateOptions({ tableSupport: v })} theme={theme} />
                <Toggle label="Preserve Empty Lines" value={options.preserveEmptyLines} onChange={(v) => updateOptions({ preserveEmptyLines: v })} theme={theme} />
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Section({ label, children, theme }: { label: string; children: React.ReactNode; theme: string }) {
  return (
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}
         style={{ fontFamily: 'Syne, sans-serif' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function RadioGroup({ value, onChange, options, theme }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; theme: string
}) {
  return (
    <div className="space-y-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono transition-all ${
            value === opt.value
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : theme === 'dark'
              ? 'text-zinc-400 hover:bg-[#1a1a1a] border border-transparent'
              : 'text-zinc-600 hover:bg-zinc-50 border border-transparent'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function SelectGroup({ value, onChange, options, theme }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; theme: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-lg text-sm border outline-none cursor-pointer ${
        theme === 'dark' ? 'bg-[#1a1a1a] text-zinc-300 border-[#2a2a2a]' : 'bg-white text-zinc-700 border-zinc-200'
      }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

function Toggle({ label, value, onChange, theme }: { label: string; value: boolean; onChange: (v: boolean) => void; theme: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-amber-500' : theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-zinc-200'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
