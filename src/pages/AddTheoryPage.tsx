import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TheoryForm } from '../components/TheoryForm'
import { useI18n } from '../i18n/useI18n'
import { canManageTheory, useTheoryStore } from '../store/useTheoryStore'
import { draftFromTheory } from '../utils/theory'

export function AddTheoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const theory = useTheoryStore((state) => state.theories.find((item) => item.id === id))
  const user = useTheoryStore((state) => state.user)
  const addTheory = useTheoryStore((state) => state.addTheory)
  const updateTheory = useTheoryStore((state) => state.updateTheory)
  const showToast = useTheoryStore((state) => state.showToast)
  const { t } = useI18n()
  const editing = Boolean(id)

  useEffect(() => {
    document.title = editing ? t('docEdit', { brand: t('brand') }) : t('docNew', { brand: t('brand') })
    return () => {
      document.title = t('brand')
    }
  }, [editing, t])

  if (editing && !theory) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-serif text-4xl">{t('recordMissing')}</h1>
        <Link to="/" className="mt-3 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {t('toFeed')}
        </Link>
      </div>
    )
  }

  if (theory && !canManageTheory(theory, user.id, user.isModerator)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-serif text-4xl">{t('authorOnly')}</h1>
        <p className="mt-2 text-sm text-mute">{t('authorOnlyHint')}</p>
        <Link to={`/theory/${theory.id}`} className="mt-3 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {t('toTheory')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
        {editing ? t('editing') : t('publishing')}
      </p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{editing ? t('editTheory') : t('newTheory')}</h1>
      <p className="mt-3 text-sm leading-6 text-mute">{t('formLead')}</p>
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
        <TheoryForm
          key={theory?.id ?? 'new'}
          initial={theory ? draftFromTheory(theory) : undefined}
          submitLabel={editing ? t('save') : t('publish')}
          onSubmit={(draft) => {
            if (theory) {
              const ok = updateTheory(theory.id, draft)
              if (!ok) {
                showToast(t('toastDenied'))
                return
              }
              showToast(t('toastUpdated'))
              navigate(`/theory/${theory.id}`)
              return
            }
            const created = addTheory(draft)
            navigate(`/theory/${created}`)
          }}
        />
      </div>
    </div>
  )
}
