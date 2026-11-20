import { useState, type ReactNode } from 'react'
import { categoryMessage } from '../i18n/messages'
import { useI18n } from '../i18n/useI18n'
import { CATEGORIES } from '../types/theory'
import type { TheoryDraft } from '../types/theory'
import { useTheoryStore } from '../store/useTheoryStore'
import { formatDate } from '../utils/format'
import { emptyDraft, validateDraft } from '../utils/theory'
import type { DraftInput, FieldErrors } from '../utils/theory'
import { StatusBadge } from './StatusBadge'

export function TheoryForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: DraftInput
  submitLabel: string
  onSubmit: (draft: TheoryDraft) => void
}) {
  const user = useTheoryStore((state) => state.user)
  const { locale, t } = useI18n()
  const [draft, setDraft] = useState<DraftInput>(initial ?? emptyDraft())
  const [errors, setErrors] = useState<FieldErrors>({})
  const [preview, setPreview] = useState(false)

  const patch = (partial: Partial<DraftInput>) => {
    setDraft((current) => ({ ...current, ...partial }))
    setPreview(false)
  }

  const checked = validateDraft(draft)

  const openPreview = () => {
    setErrors(checked.errors)
    if (checked.value) setPreview(true)
  }

  const publish = () => {
    const result = validateDraft(draft)
    setErrors(result.errors)
    if (!result.value) {
      setPreview(false)
      return
    }
    onSubmit(result.value)
  }

  return (
    <div>
      {preview && checked.value ? (
        <div className="rounded-2xl border border-line bg-bg p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{t('preview')}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status="pending" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
              {t(categoryMessage(checked.value.category))}
            </span>
          </div>
          <h3 className="mt-3 font-serif text-3xl leading-tight">{checked.value.title}</h3>
          <p className="mt-3 text-sm leading-6 text-mute">{checked.value.summary}</p>
          {checked.value.body && (
            <div className="mt-4 space-y-3 text-sm leading-6">
              {checked.value.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-mute">
            {checked.value.anonymous ? t('anonymous') : user.name}
            {checked.value.predictedDate && ` · ${t('expectedBy', { date: formatDate(checked.value.predictedDate, locale) })}`}
          </p>
          {checked.value.tags.length > 0 && (
            <p className="mt-2 text-xs text-mute">{checked.value.tags.map((tag) => `#${tag}`).join('  ')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Field label={t('fieldTitle')} hint={`${draft.title.trim().length}/120`} error={errors.title && t(errors.title)}>
            <input
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
              maxLength={140}
              required
              className={inputClass}
              placeholder={t('titlePlaceholder')}
            />
          </Field>
          <Field label={t('fieldSummary')} hint={`${draft.summary.trim().length}/400`} error={errors.summary && t(errors.summary)}>
            <textarea
              value={draft.summary}
              onChange={(event) => patch({ summary: event.target.value })}
              rows={3}
              required
              className={inputClass}
              placeholder={t('summaryPlaceholder')}
            />
          </Field>
          <Field label={t('fieldBody')} hint={t('optional')} error={errors.body && t(errors.body)}>
            <textarea
              value={draft.body}
              onChange={(event) => patch({ body: event.target.value })}
              rows={8}
              className={inputClass}
              placeholder={t('bodyPlaceholder')}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('category')} error={errors.category && t(errors.category)}>
              <select
                value={draft.category}
                onChange={(event) => patch({ category: event.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {t(categoryMessage(category.id))}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('fieldDate')} hint={t('optional')} error={errors.predictedDate && t(errors.predictedDate)}>
              <input
                type="date"
                value={draft.predictedDate}
                onChange={(event) => patch({ predictedDate: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label={t('fieldTags')} hint={t('tagsHint')} error={errors.tags && t(errors.tags)}>
            <input
              value={draft.tags}
              onChange={(event) => patch({ tags: event.target.value })}
              className={inputClass}
              placeholder={t('tagsPlaceholder')}
            />
          </Field>
          <label className="flex items-start gap-3 rounded-2xl border border-line bg-bg px-3 py-3 text-sm">
            <input
              type="checkbox"
              checked={draft.anonymous}
              onChange={(event) => patch({ anonymous: event.target.checked })}
              className="mt-1"
            />
            <span>
              <span className="font-medium">{t('anonymousPost')}</span>
              <span className="mt-1 block text-mute">{t('anonymousHint')}</span>
            </span>
          </label>
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {preview ? (
          <button type="button" onClick={() => setPreview(false)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
            {t('backToEdit')}
          </button>
        ) : (
          <button type="button" onClick={openPreview} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
            {t('preview')}
          </button>
        )}
        <button type="button" onClick={publish} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

const inputClass = 'mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none ring-accent/40 focus:ring-2'

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="flex items-baseline justify-between gap-3 font-medium">
        {label}
        {hint && <span className="font-mono text-[11px] font-normal text-mute">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  )
}
