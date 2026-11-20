import { useState, type ReactNode } from 'react'
import { CATEGORIES, categoryLabel } from '../types/theory'
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
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Предпросмотр</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status="pending" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
              {categoryLabel(checked.value.category)}
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
            {checked.value.anonymous ? 'Аноним' : user.name}
            {checked.value.predictedDate && ` · ожидается к ${formatDate(checked.value.predictedDate)}`}
          </p>
          {checked.value.tags.length > 0 && (
            <p className="mt-2 text-xs text-mute">{checked.value.tags.map((tag) => `#${tag}`).join('  ')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Заголовок" hint={`${draft.title.trim().length}/120`} error={errors.title}>
            <input
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
              maxLength={140}
              required
              className={inputClass}
              placeholder="Коротко и проверяемо, от 10 до 120 символов"
            />
          </Field>
          <Field label="Краткое описание" hint={`${draft.summary.trim().length}/400`} error={errors.summary}>
            <textarea
              value={draft.summary}
              onChange={(event) => patch({ summary: event.target.value })}
              rows={3}
              required
              className={inputClass}
              placeholder="Две-три фразы: что утверждается и как это узнать"
            />
          </Field>
          <Field label="Полный текст" hint="необязательно" error={errors.body}>
            <textarea
              value={draft.body}
              onChange={(event) => patch({ body: event.target.value })}
              rows={8}
              className={inputClass}
              placeholder="Аргументы, критерий сбытия, что не будет считаться подтверждением"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Категория" error={errors.category}>
              <select
                value={draft.category}
                onChange={(event) => patch({ category: event.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Дата предполагаемого сбытия" hint="необязательно" error={errors.predictedDate}>
              <input
                type="date"
                value={draft.predictedDate}
                onChange={(event) => patch({ predictedDate: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Теги" hint="через запятую, необязательно" error={errors.tags}>
            <input
              value={draft.tags}
              onChange={(event) => patch({ tags: event.target.value })}
              className={inputClass}
              placeholder="кванты, связь, эксперимент"
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
              <span className="font-medium">Опубликовать анонимно</span>
              <span className="mt-1 block text-mute">
                В ленте будет «Аноним». Редактировать запись сможете вы и модератор этого браузера.
              </span>
            </span>
          </label>
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {preview ? (
          <button type="button" onClick={() => setPreview(false)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
            Вернуться к правкам
          </button>
        ) : (
          <button type="button" onClick={openPreview} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
            Предпросмотр
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
