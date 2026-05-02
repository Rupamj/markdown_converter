import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { estimateReadingTime } from '../../lib/converter'

export default function StatsBar() {
  const { theme, showStats, wordCount, charCount, lineCount } = useAppStore()
  const readTime = estimateReadingTime(wordCount)

  return (
    <AnimatePresence>
      {showStats && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className={`border-t overflow-hidden shrink-0 ${
            theme === 'dark' ? 'border-[#1f1f1f] bg-[#080808]' : 'border-[#ebebeb] bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-6 px-5 py-2">
            <Stat label="Words"      value={wordCount}  theme={theme} />
            <Stat label="Characters" value={charCount}  theme={theme} />
            <Stat label="Lines"      value={lineCount}  theme={theme} />
            <Stat label="Read time"  value={readTime}   theme={theme} accent />
            <div className="ml-auto flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse`} />
              <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Live
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value, theme, accent }: {
  label: string; value: string | number; theme: string; accent?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}
            style={{ fontFamily: 'Syne, sans-serif' }}>
        {label}
      </span>
      <span className={`text-xs font-bold font-mono ${
        accent ? 'text-amber-400' : theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
      }`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}
