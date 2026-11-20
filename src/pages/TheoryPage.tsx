import { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Share2, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AddTheoryModal } from '../components/AddTheoryModal'
import { CommentTree } from '../components/CommentTree'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { VoteButtons } from '../components/VoteButtons'
import { canManageTheory, useTheoryStore } from '../store/useTheoryStore'
import { categoryLabel } from '../types/theory'
import type { ConfirmChoice, TheoryStatus } from '../types/theory'
import { cx, formatDate, plural, todayInputValue } from '../utils/format'

const choices: Array<{ id: ConfirmChoice; label: string }> = [
  { id: 'fulfilled', label: 'Сбылась' },
  { id: 'notYet', label: 'Не сбылась' },
  { id: 'refuted', label: 'Опровергнута' },
]

export function TheoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const theory = useTheoryStore((state) => state.theories.find((item) => item.id === id))
  const user = useTheoryStore((state) => state.user)
  const choice = useTheoryStore((state) => (id ? state.confirmations[id] : undefined))
  const confirm = useTheoryStore((state) => state.confirm)
  const setStatus = useTheoryStore((state) => state.setStatus)
  const deleteTheory = useTheoryStore((state) => state.deleteTheory)
  const showToast = useTheoryStore((state) => state.showToast)
  const [editing, setEditing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [status, setStatusValue] = useState<TheoryStatus>(theory?.status ?? 'pending')
  const [fulfilledAt, setFulfilledAt] = useState(theory?.fulfilledAt ?? todayInputValue())

  useEffect(() => {
    if (!theory) return
    document.title = `${theory.title} — Теории`
    setStatusValue(theory.status)
    setFulfilledAt(theory.fulfilledAt ?? todayInputValue())
    return () => {
      document.title = 'Теории'
    }
  }, [theory])

  if (!theory || !id) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <p className="text-5xl" aria-hidden>
          🪐
        </p>
        <h1 className="mt-4 font-serif text-4xl">Теория не найдена</h1>
        <p className="mt-2 text-sm text-mute">Ссылка устарела или запись удалили в этом браузере.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          Вернуться в ленту
        </Link>
      </div>
    )
  }

  const manageable = canManageTheory(theory, user.id, user.isModerator)
  const paragraphs = theory.body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  const votes = theory.confirmVotes
  const voteTotal = votes.fulfilled + votes.refuted + votes.notYet
  const leaning =
    voteTotal >= 3 && votes.fulfilled > votes.refuted && votes.fulfilled >= votes.notYet
      ? 'Сообщество склоняется к тому, что теория сбылась.'
      : voteTotal >= 3 && votes.refuted > votes.fulfilled && votes.refuted >= votes.notYet
        ? 'Сообщество склоняется к тому, что теория опровергнута.'
        : voteTotal >= 3
          ? 'Сообщество пока не видит сбытия.'
          : 'Голосов сообщества пока мало.'

  const share = async () => {
    const url = `${window.location.origin}/theory/${theory.id}`
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: theory.title, text: theory.summary, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('Ссылка скопирована')
    } catch {
      showToast('Не удалось скопировать ссылку')
    }
  }

  const saveStatus = () => {
    const ok = setStatus(theory.id, status, status === 'fulfilled' ? fulfilledAt : undefined)
    showToast(ok ? 'Статус обновлён' : 'Статус может менять автор или модератор')
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-mute hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Лента
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={theory.status} />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{categoryLabel(theory.category)}</span>
      </div>
      <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{theory.title}</h1>
      <p className="mt-4 text-sm text-mute">
        <span className="text-ink">{theory.author}</span>
        {' · '}
        <time dateTime={theory.createdAt}>{formatDate(theory.createdAt)}</time>
        {theory.predictedDate && ` · ожидается к ${formatDate(theory.predictedDate)}`}
        {theory.fulfilledAt && theory.status === 'fulfilled' && ` · сбылась ${formatDate(theory.fulfilledAt)}`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void share()} className={actionClass}>
          <Share2 size={15} aria-hidden /> Поделиться
        </button>
        {manageable && (
          <button type="button" onClick={() => setEditing(true)} className={actionClass}>
            <Pencil size={15} aria-hidden /> Редактировать
          </button>
        )}
        {manageable && (
          <button type="button" onClick={() => setRemoving(true)} className={cx(actionClass, 'text-rose-700 dark:text-rose-300')}>
            <Trash2 size={15} aria-hidden /> Удалить
          </button>
        )}
      </div>
      {theory.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {theory.tags.map((tag) => (
            <Link key={tag} to={`/?q=${encodeURIComponent(tag)}`} className="rounded-full bg-card px-2.5 py-1 text-xs text-mute ring-1 ring-line">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-line bg-card p-4 shadow-card">
        <VoteButtons theoryId={theory.id} votesUp={theory.votesUp} votesDown={theory.votesDown} />
        <p className="mt-2 text-xs text-mute">Один голос «за» или «против» на человека. Повторное нажатие снимает голос. Выбор хранится в этом браузере.</p>
      </div>

      <p className="mt-8 font-serif text-2xl leading-snug text-ink/90">{theory.summary}</p>
      {paragraphs.length > 0 && (
        <div className="mt-6 space-y-4 text-[17px] leading-8">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-3xl">Сбылась ли?</h2>
        <p className="mt-1 text-sm text-mute">Голос сообщества не меняет официальный статус. Это отдельный сигнал.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {choices.map((item) => {
            const active = choice === item.id
            const count = votes[item.id]
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => confirm(theory.id, item.id)}
                className={cx(
                  'rounded-2xl border px-3 py-3 text-left text-sm font-semibold',
                  active ? 'border-indigo-500 bg-indigo-500/10' : 'border-line hover:border-accent/40',
                )}
              >
                <span className="block">{item.label}</span>
                <span className="mt-1 block font-mono text-xs font-normal text-mute">
                  {count} {plural(count, 'голос', 'голоса', 'голосов')}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-4 space-y-2">
          <Bar label="Сбылась" value={votes.fulfilled} total={voteTotal} color="bg-emerald-400" />
          <Bar label="Не сбылась" value={votes.notYet} total={voteTotal} color="bg-amber-400" />
          <Bar label="Опровергнута" value={votes.refuted} total={voteTotal} color="bg-rose-400" />
        </div>
        <p className="mt-3 text-sm text-mute">{leaning}</p>
      </section>

      {manageable && (
        <section className="mt-4 rounded-3xl border border-dashed border-line p-5">
          <h2 className="font-serif text-2xl">Официальный статус</h2>
          <p className="mt-1 text-sm text-mute">Доступно автору и модератору. Для отметки «Сбылась» нужна дата.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="text-sm">
              Статус
              <select
                value={status}
                onChange={(event) => setStatusValue(event.target.value as TheoryStatus)}
                className="mt-1 block rounded-xl border border-line bg-bg px-3 py-2"
              >
                <option value="pending">Не подтверждена</option>
                <option value="fulfilled">Сбылась</option>
                <option value="refuted">Опровергнута</option>
              </select>
            </label>
            {status === 'fulfilled' && (
              <label className="text-sm">
                Дата сбытия
                <input
                  type="date"
                  required
                  value={fulfilledAt}
                  onChange={(event) => setFulfilledAt(event.target.value)}
                  className="mt-1 block rounded-xl border border-line bg-bg px-3 py-2"
                />
              </label>
            )}
            <button type="button" onClick={saveStatus} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              Обновить статус
            </button>
          </div>
        </section>
      )}

      <CommentTree theoryId={theory.id} comments={theory.comments} />
      <AddTheoryModal open={editing} theory={theory} onClose={() => setEditing(false)} />
      <ConfirmDialog
        open={removing}
        title="Удалить теорию?"
        body="Карточка, голоса и обсуждение исчезнут из этого браузера."
        confirmLabel="Удалить"
        onClose={() => setRemoving(false)}
        onConfirm={() => {
          deleteTheory(theory.id)
          navigate('/')
        }}
      />
    </article>
  )
}

const actionClass = 'inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold'

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const width = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-mute">
        <span>{label}</span>
        <span className="tabular-nums">{width}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg">
        <div className={cx('h-full rounded-full', color)} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
