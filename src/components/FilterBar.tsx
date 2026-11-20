import { Search } from 'lucide-react'
import { CATEGORIES } from '../types/theory'
import type { Category, TheoryStatus } from '../types/theory'
import { cx, plural } from '../utils/format'
import type { TheoryQuery } from '../utils/theory'

const sorts: Array<{ id: TheoryQuery['sort']; label: string }> = [
  { id: 'new', label: 'Новые' },
  { id: 'popular', label: 'Популярные' },
  { id: 'discussed', label: 'Обсуждаемые' },
]

export function FilterBar({
  query,
  total,
  onChange,
}: {
  query: TheoryQuery
  total: number
  onChange: (patch: Partial<TheoryQuery>) => void
}) {
  return (
    <div className="rounded-2xl border border-line bg-card/80 p-3 shadow-card backdrop-blur sm:p-4">
      <label className="relative block">
        <span className="sr-only">Поиск по названию и тексту</span>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" aria-hidden />
        <input
          value={query.q}
          onChange={(event) => onChange({ q: event.target.value })}
          placeholder="Поиск по названию, тексту, автору или тегу"
          className="w-full rounded-xl border border-line bg-bg py-2.5 pl-9 pr-3 text-sm outline-none ring-accent/40 placeholder:text-mute focus:ring-2"
        />
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
        <select
          aria-label="Категория"
          value={query.category}
          onChange={(event) => onChange({ category: event.target.value as Category | 'all' })}
          className="rounded-xl border border-line bg-bg px-3 py-2 text-sm"
        >
          <option value="all">Все категории</option>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Статус"
          value={query.status}
          onChange={(event) => onChange({ status: event.target.value as TheoryStatus | 'all' })}
          className="rounded-xl border border-line bg-bg px-3 py-2 text-sm"
        >
          <option value="all">Любой статус</option>
          <option value="pending">Не подтверждена</option>
          <option value="fulfilled">Сбылась</option>
          <option value="refuted">Опровергнута</option>
        </select>
        <div className="flex rounded-xl border border-line bg-bg p-1" role="group" aria-label="Сортировка">
          {sorts.map((sort) => (
            <button
              key={sort.id}
              type="button"
              aria-pressed={query.sort === sort.id}
              onClick={() => onChange({ sort: sort.id })}
              className={cx(
                'flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:text-sm',
                query.sort === sort.id ? 'bg-indigo-600 text-white' : 'text-mute hover:text-ink',
              )}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
        {total} {plural(total, 'теория', 'теории', 'теорий')}
      </p>
    </div>
  )
}
