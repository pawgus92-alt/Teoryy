import { useEffect } from 'react'
import { StatsPanel } from '../components/StatsPanel'

export function StatsPage() {
  useEffect(() => {
    document.title = 'Статистика — Теории'
    return () => {
      document.title = 'Теории'
    }
  }, [])

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">Сводка</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Как часто теории сбываются</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mute">
        Счётчики считаются по записям в этом браузере: официальный статус, рейтинг и авторы. Голос «за» и «против» уже входит в рейтинг.
      </p>
      <div className="mt-6">
        <StatsPanel />
      </div>
    </div>
  )
}
