import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TheoryForm } from '../components/TheoryForm'
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
  const editing = Boolean(id)

  useEffect(() => {
    document.title = editing ? 'Редактирование — Теории' : 'Новая теория — Теории'
    return () => {
      document.title = 'Теории'
    }
  }, [editing])

  if (editing && !theory) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-serif text-4xl">Запись не найдена</h1>
        <Link to="/" className="mt-3 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          В ленту
        </Link>
      </div>
    )
  }

  if (theory && !canManageTheory(theory, user.id, user.isModerator)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-serif text-4xl">Править может автор</h1>
        <p className="mt-2 text-sm text-mute">Включите режим модератора в меню профиля, если проверяете чужую карточку.</p>
        <Link to={`/theory/${theory.id}`} className="mt-3 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          К теории
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
        {editing ? 'Правка' : 'Публикация'}
      </p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{editing ? 'Редактировать теорию' : 'Новая теория'}</h1>
      <p className="mt-3 text-sm leading-6 text-mute">
        Заголовок и краткое описание обязательны. Перед публикацией можно открыть предпросмотр — в ленту попадёт только то, что вы подтвердите.
      </p>
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
        <TheoryForm
          key={theory?.id ?? 'new'}
          initial={theory ? draftFromTheory(theory) : undefined}
          submitLabel={editing ? 'Сохранить' : 'Опубликовать'}
          onSubmit={(draft) => {
            if (theory) {
              const ok = updateTheory(theory.id, draft)
              if (!ok) {
                showToast('Недостаточно прав для правки')
                return
              }
              showToast('Теория обновлена')
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
