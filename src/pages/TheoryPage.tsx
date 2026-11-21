import { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Share2, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AddTheoryModal } from '../components/AddTheoryModal'
import { CommentTree } from '../components/CommentTree'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { VoteButtons } from '../components/VoteButtons'
import { categoryMessage, statusMessage } from '../i18n/messages'
import type { MessageKey } from '../i18n/messages'
import { displayAuthor, presentTheory } from '../i18n/present'
import { useI18n } from '../i18n/useI18n'
import { canManageTheory, useTheoryStore } from '../store/useTheoryStore'
import type { ConfirmChoice, TheoryStatus } from '../types/theory'
import { cx, formatDate, plural, todayInputValue } from '../utils/format'

const choices: Array<{ id: ConfirmChoice; label: MessageKey; bar: MessageKey }> = [
  { id: 'fulfilled', label: 'statusFulfilled', bar: 'statusFulfilled' },
  { id: 'notYet', label: 'statusNotYet', bar: 'statusNotYet' },
  { id: 'refuted', label: 'statusRefuted', bar: 'statusRefuted' },
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
  const { locale, t } = useI18n()
  const shown = theory ? presentTheory(theory, locale) : undefined
  const [editing, setEditing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [status, setStatusValue] = useState<TheoryStatus>(theory?.status ?? 'pending')
  const [fulfilledAt, setFulfilledAt] = useState(theory?.fulfilledAt ?? todayInputValue())

  useEffect(() => {
    if (!theory || !shown) return
    document.title = t('docTheory', { title: shown.title, brand: t('brand') })
    setStatusValue(theory.status)
    setFulfilledAt(theory.fulfilledAt ?? todayInputValue())
    return () => {
      document.title = t('brand')
    }
  }, [theory, locale, t])

  if (!theory || !id || !shown) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <p className="text-5xl" aria-hidden>
          🪐
        </p>
        <h1 className="mt-4 font-serif text-4xl">{t('notFoundTitle')}</h1>
        <p className="mt-2 text-sm text-mute">{t('notFoundText')}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {t('backToFeed')}
        </Link>
      </div>
    )
  }

  const manageable = canManageTheory(theory, user.id, user.isModerator)
  const paragraphs = shown.body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  const votes = theory.confirmVotes
  const voteTotal = votes.fulfilled + votes.refuted + votes.notYet
  const leaning =
    voteTotal >= 3 && votes.fulfilled > votes.refuted && votes.fulfilled >= votes.notYet
      ? t('leanFulfilled')
      : voteTotal >= 3 && votes.refuted > votes.fulfilled && votes.refuted >= votes.notYet
        ? t('leanRefuted')
        : voteTotal >= 3
          ? t('leanNotYet')
          : t('leanFew')

  const share = async () => {
    const url = `${window.location.origin}/theory/${theory.id}`
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shown.title, text: shown.summary, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast(t('toastCopied'))
    } catch {
      showToast(t('toastCopyFail'))
    }
  }

  const saveStatus = () => {
    const ok = setStatus(theory.id, status, status === 'fulfilled' ? fulfilledAt : undefined)
    showToast(ok ? t('toastStatusOk') : t('toastStatusDenied'))
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-mute hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        {t('backFeed')}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={theory.status} />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{t(categoryMessage(shown.category))}</span>
      </div>
      <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{shown.title}</h1>
      <p className="mt-4 text-sm text-mute">
        <span className="text-ink">{displayAuthor(shown.author, shown.anonymous, t('anonymous'))}</span>
        {' · '}
        <time dateTime={theory.createdAt}>{formatDate(theory.createdAt, locale)}</time>
        {theory.predictedDate && ` · ${t('expectedBy', { date: formatDate(theory.predictedDate, locale) })}`}
        {theory.fulfilledAt && theory.status === 'fulfilled' && ` · ${t('fulfilledOn', { date: formatDate(theory.fulfilledAt, locale) })}`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void share()} className={actionClass}>
          <Share2 size={15} aria-hidden /> {t('share')}
        </button>
        {manageable && (
          <button type="button" onClick={() => setEditing(true)} className={actionClass}>
            <Pencil size={15} aria-hidden /> {t('edit')}
          </button>
        )}
        {manageable && (
          <button type="button" onClick={() => setRemoving(true)} className={cx(actionClass, 'text-rose-700 dark:text-rose-300')}>
            <Trash2 size={15} aria-hidden /> {t('remove')}
          </button>
        )}
      </div>
      {shown.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {shown.tags.map((tag) => (
            <Link key={tag} to={`/?q=${encodeURIComponent(tag)}`} className="rounded-full bg-card px-2.5 py-1 text-xs text-mute ring-1 ring-line">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-line bg-card p-4 shadow-card">
        <VoteButtons theoryId={theory.id} votesUp={theory.votesUp} votesDown={theory.votesDown} />
        <p className="mt-2 text-xs text-mute">{t('voteHint')}</p>
      </div>

      <p className="mt-8 max-w-[66ch] font-serif text-[1.35rem] font-medium leading-snug text-ink/90">{shown.summary}</p>
      {paragraphs.length > 0 && (
        <div className="read mt-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-3xl">{t('didItHappen')}</h2>
        <p className="mt-1 text-sm text-mute">{t('communityHint')}</p>
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
                <span className="block">{t(item.label)}</span>
                <span className="mt-1 block font-mono text-xs font-normal text-mute">
                  {count} {plural(count, locale, t('voteOne'), t('voteFew'), t('voteMany'))}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-4 space-y-2">
          <Bar label={t('statusFulfilled')} value={votes.fulfilled} total={voteTotal} color="bg-emerald-400" />
          <Bar label={t('statusNotYet')} value={votes.notYet} total={voteTotal} color="bg-amber-400" />
          <Bar label={t('statusRefuted')} value={votes.refuted} total={voteTotal} color="bg-rose-400" />
        </div>
        <p className="mt-3 text-sm text-mute">{leaning}</p>
      </section>

      {manageable && (
        <section className="mt-4 rounded-3xl border border-dashed border-line p-5">
          <h2 className="font-serif text-2xl">{t('officialStatus')}</h2>
          <p className="mt-1 text-sm text-mute">{t('officialHint')}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="text-sm">
              {t('status')}
              <select
                value={status}
                onChange={(event) => setStatusValue(event.target.value as TheoryStatus)}
                className="mt-1 block rounded-xl border border-line bg-bg px-3 py-2"
              >
                <option value="pending">{t(statusMessage('pending'))}</option>
                <option value="fulfilled">{t(statusMessage('fulfilled'))}</option>
                <option value="refuted">{t(statusMessage('refuted'))}</option>
              </select>
            </label>
            {status === 'fulfilled' && (
              <label className="text-sm">
                {t('fulfilledDate')}
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
              {t('updateStatus')}
            </button>
          </div>
        </section>
      )}

      <CommentTree theoryId={theory.id} comments={shown.comments} />
      <AddTheoryModal open={editing} theory={theory} onClose={() => setEditing(false)} />
      <ConfirmDialog
        open={removing}
        title={t('deleteTitle')}
        body={t('deleteBody')}
        confirmLabel={t('remove')}
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
