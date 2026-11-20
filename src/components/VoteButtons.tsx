import { ChevronDown, ChevronUp } from 'lucide-react'
import type { VoteDirection } from '../types/theory'
import { useTheoryStore } from '../store/useTheoryStore'
import { cx, signed } from '../utils/format'

export function VoteButtons({
  theoryId,
  votesUp,
  votesDown,
  layout = 'row',
}: {
  theoryId: string
  votesUp: number
  votesDown: number
  layout?: 'row' | 'stack'
}) {
  const mine = useTheoryStore((state) => state.votes[theoryId])
  const vote = useTheoryStore((state) => state.vote)
  const score = votesUp - votesDown

  const button = (direction: VoteDirection, label: string, Icon: typeof ChevronUp) => {
    const active = mine === direction
    return (
      <button
        type="button"
        aria-pressed={active}
        aria-label={label}
        onClick={() => vote(theoryId, direction)}
        className={cx(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-semibold tabular-nums transition',
          active
            ? direction === 'up'
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300'
            : 'border-line bg-card text-mute hover:border-accent/40 hover:text-ink',
        )}
      >
        <Icon size={16} aria-hidden />
        <span>{direction === 'up' ? 'За' : 'Против'}</span>
        <span className="text-ink">{direction === 'up' ? votesUp : votesDown}</span>
      </button>
    )
  }

  return (
    <div className={cx('flex items-center gap-2', layout === 'stack' && 'sm:flex-col sm:items-stretch')}>
      {button('up', 'Голос за', ChevronUp)}
      <div
        className={cx(
          'min-w-12 text-center font-mono text-sm font-medium tabular-nums',
          score > 0 ? 'text-emerald-700 dark:text-emerald-300' : score < 0 ? 'text-rose-700 dark:text-rose-300' : 'text-mute',
        )}
        title="Рейтинг: голоса за минус голоса против"
      >
        {signed(score)}
      </div>
      {button('down', 'Голос против', ChevronDown)}
    </div>
  )
}
