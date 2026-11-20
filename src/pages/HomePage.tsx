import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AddTheoryModal } from '../components/AddTheoryModal'
import { FilterBar } from '../components/FilterBar'
import { TheoryCard } from '../components/TheoryCard'
import { useTheoryStore } from '../store/useTheoryStore'
import type { Category, TheoryStatus } from '../types/theory'
import { isCategory } from '../types/theory'
import { buildStats } from '../utils/stats'
import { filterTheories } from '../utils/theory'
import type { TheoryQuery } from '../utils/theory'

const sorts = new Set(['new', 'popular', 'discussed'])
const statuses = new Set(['pending', 'fulfilled', 'refuted'])

export function HomePage() {
  const theories = useTheoryStore((state) => state.theories)
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const stats = buildStats(theories)

  const query: TheoryQuery = {
    q: params.get('q') ?? '',
    category: readCategory(params.get('category')),
    status: readStatus(params.get('status')),
    sort: readSort(params.get('sort')),
  }

  const visible = useMemo(() => filterTheories(theories, query), [theories, query])

  const update = (patch: Partial<TheoryQuery>) => {
    const next = { ...query, ...patch }
    const search = new URLSearchParams()
    if (next.q.trim()) search.set('q', next.q)
    if (next.category !== 'all') search.set('category', next.category)
    if (next.status !== 'all') search.set('status', next.status)
    if (next.sort !== 'new') search.set('sort', next.sort)
    setParams(search, { replace: true })
  }

  return (
    <div>
      <section className="grid items-end gap-6 pb-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Журнал гипотез</p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">Теории, которые можно проверить временем</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-mute">
            Публикуйте формулировку, спорьте в ветке комментариев и отмечайте, что сбылось, а что рассыпалось о факты.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Добавить теорию
          </button>
        </div>
        <div className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Счётчик сбытия</p>
          <p className="mt-2 font-serif text-6xl leading-none">{stats.total === 0 ? '—' : `${stats.rate}%`}</p>
          <p className="mt-3 text-sm text-mute">
            {stats.fulfilled} сбылось · {stats.refuted} опровергнуто · {stats.pending} на рассмотрении
          </p>
        </div>
      </section>

      <FilterBar query={query} total={visible.length} onChange={update} />

      {visible.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
          <p className="text-5xl" aria-hidden>
            {theories.length === 0 ? '📭' : '🔭'}
          </p>
          <h2 className="mt-4 font-serif text-3xl">{theories.length === 0 ? 'Журнал пока пуст' : 'Ничего не нашлось'}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">
            {theories.length === 0
              ? 'Добавьте первую теорию — карточка появится в ленте.'
              : 'Смените категорию, статус или запрос. Демо-набор можно вернуть в меню профиля.'}
          </p>
          {theories.length > 0 && (
            <button type="button" onClick={() => setParams({})} className="mt-4 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {visible.map((theory, index) => (
            <TheoryCard key={theory.id} theory={theory} index={index} />
          ))}
        </div>
      )}
      <AddTheoryModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function readCategory(value: string | null): Category | 'all' {
  return value && isCategory(value) ? value : 'all'
}

function readStatus(value: string | null): TheoryStatus | 'all' {
  return value && statuses.has(value) ? (value as TheoryStatus) : 'all'
}

function readSort(value: string | null): TheoryQuery['sort'] {
  return value && sorts.has(value) ? (value as TheoryQuery['sort']) : 'new'
}
