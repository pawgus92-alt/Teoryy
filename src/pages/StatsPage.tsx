import { useEffect } from 'react'
import { StatsPanel } from '../components/StatsPanel'
import { useI18n } from '../i18n/useI18n'

export function StatsPage() {
  const { t } = useI18n()
  useEffect(() => {
    document.title = t('docStats', { brand: t('brand') })
    return () => {
      document.title = t('brand')
    }
  }, [t])

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">{t('summaryKicker')}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{t('statsTitle')}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mute">{t('statsLead')}</p>
      <div className="mt-6">
        <StatsPanel />
      </div>
    </div>
  )
}
