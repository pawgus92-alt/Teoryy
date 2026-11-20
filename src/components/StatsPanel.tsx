import { Link } from 'react-router-dom'
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { categoryLabel, STATUS_META } from '../types/theory'
import { useTheoryStore } from '../store/useTheoryStore'
import { plural, signed } from '../utils/format'
import { buildStats } from '../utils/stats'
import { ratingOf } from '../utils/theory'

export function StatsPanel() {
  const theories = useTheoryStore((state) => state.theories)
  const theme = useTheoryStore((state) => state.theme)
  const stats = buildStats(theories)
  const axis = theme === 'dark' ? '#a8a3b8' : '#5a5666'
  const grid = theme === 'dark' ? 'rgba(168,163,184,0.16)' : 'rgba(90,86,102,0.16)'

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <RateCard rate={stats.rate} total={stats.total} />
        <Metric label="Всего теорий" value={stats.total} tone="text-ink" />
        <Metric label={STATUS_META.fulfilled.short} value={stats.fulfilled} tone="text-emerald-700 dark:text-emerald-300" />
        <Metric label={STATUS_META.refuted.short} value={stats.refuted} tone="text-rose-700 dark:text-rose-300" />
        <Metric label={STATUS_META.pending.short} value={stats.pending} tone="text-amber-700 dark:text-amber-200" />
      </section>
      <p className="-mt-2 text-sm text-mute">Счётчик сбытия — доля теорий со статусом «Сбылась» среди всех записей.</p>

      <section className="rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
        <h2 className="font-serif text-3xl">Динамика сбывшихся теорий</h2>
        <p className="mt-1 text-sm text-mute">Столбцы — сколько теорий сбылось в месяце, линия — накопительный итог.</p>
        {stats.series.length === 0 ? (
          <div className="mt-8 px-4 py-12 text-center">
            <p className="text-4xl" aria-hidden>
              📈
            </p>
            <p className="mt-3 text-mute">Пока нет теорий с датой сбытия.</p>
          </div>
        ) : (
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats.series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: axis, fontSize: 11 }} interval={2} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="За месяц" fill="#34d399" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Line dataKey="cumulative" name="Накопительно" stroke="#818cf8" strokeWidth={2.4} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <h2 className="font-serif text-3xl">Топ-5 по рейтингу</h2>
          {stats.topTheories.length === 0 ? (
            <Empty emoji="🔭" text="Рейтинг появится вместе с теориями." />
          ) : (
            <ol className="mt-4 space-y-3">
              {stats.topTheories.map((theory, index) => (
                <li key={theory.id}>
                  <Link to={`/theory/${theory.id}`} className="flex items-start gap-3 rounded-2xl px-2 py-2 hover:bg-bg">
                    <span className="font-mono text-sm text-mute">{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium leading-snug">{theory.title}</span>
                      <span className="mt-1 block text-xs text-mute">
                        {categoryLabel(theory.category)} · {STATUS_META[theory.status].label}
                      </span>
                    </span>
                    <span className="font-mono text-sm tabular-nums">{signed(ratingOf(theory))}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>
        <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <h2 className="font-serif text-3xl">Топ-5 авторов</h2>
          {stats.authors.length === 0 ? (
            <Empty emoji="✍️" text="Авторы появятся после первой публикации." />
          ) : (
            <ol className="mt-4 space-y-3">
              {stats.authors.map((author, index) => (
                <li key={author.name} className="flex items-center gap-3 rounded-2xl px-2 py-2">
                  <span className="font-mono text-sm text-mute">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{author.name}</span>
                    <span className="text-xs text-mute">
                      {author.theories} {plural(author.theories, 'теория', 'теории', 'теорий')}
                    </span>
                  </span>
                  <span className="font-mono text-sm tabular-nums">{signed(author.rating)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}

function RateCard({ rate, total }: { rate: number; total: number }) {
  return (
    <article className="rounded-3xl border border-line bg-indigo-600 p-5 text-white sm:col-span-2 xl:col-span-1">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-100">Счётчик сбытия</p>
      <p className="mt-3 font-serif text-6xl leading-none">{total === 0 ? '—' : `${rate}%`}</p>
      <p className="mt-3 text-sm text-indigo-100">сбывшихся теорий от общего числа</p>
    </article>
  )
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/70">{label}</p>
      <p className={`mt-2 font-serif text-5xl leading-none ${tone}`}>{value}</p>
    </article>
  )
}

function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="px-2 py-10 text-center">
      <p className="text-4xl" aria-hidden>
        {emoji}
      </p>
      <p className="mt-3 text-sm text-mute">{text}</p>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 text-sm shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="mt-1">
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  )
}
