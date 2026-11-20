import { useNavigate } from 'react-router-dom'
import type { Theory } from '../types/theory'
import { useI18n } from '../i18n/useI18n'
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
  const { t } = useI18n()

  return (
    <Modal open={open} title={theory ? t('editTheory') : t('newTheory')} onClose={onClose}>
      {open && (
        <TheoryForm
          initial={theory ? draftFromTheory(theory) : undefined}
          submitLabel={theory ? t('save') : t('publish')}
          onSubmit={(draft) => {
            if (theory) {
              const ok = updateTheory(theory.id, draft)
              if (!ok) {
                showToast(t('toastDenied'))
                return
              }
              showToast(t('toastUpdated'))
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
