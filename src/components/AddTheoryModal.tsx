import { useNavigate } from 'react-router-dom'
import type { Theory } from '../types/theory'
import { useTheoryStore } from '../store/useTheoryStore'
import { draftFromTheory } from '../utils/theory'
import { Modal } from './Modal'
import { TheoryForm } from './TheoryForm'

export function AddTheoryModal({
  open,
  onClose,
  theory,
}: {
  open: boolean
  onClose: () => void
  theory?: Theory
}) {
  const navigate = useNavigate()
  const addTheory = useTheoryStore((state) => state.addTheory)
  const updateTheory = useTheoryStore((state) => state.updateTheory)
  const showToast = useTheoryStore((state) => state.showToast)

  return (
    <Modal open={open} title={theory ? 'Редактировать теорию' : 'Новая теория'} onClose={onClose}>
      {open && (
        <TheoryForm
          initial={theory ? draftFromTheory(theory) : undefined}
          submitLabel={theory ? 'Сохранить' : 'Опубликовать'}
          onSubmit={(draft) => {
            if (theory) {
              const ok = updateTheory(theory.id, draft)
              if (!ok) {
                showToast('Недостаточно прав для правки')
                return
              }
              showToast('Теория обновлена')
              onClose()
              return
            }
            const id = addTheory(draft)
            onClose()
            navigate(`/theory/${id}`)
          }}
        />
      )}
    </Modal>
  )
}
