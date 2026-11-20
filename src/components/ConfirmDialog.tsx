import { useI18n } from '../i18n/useI18n'
import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  const { t } = useI18n()
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm leading-6 text-mute">{body}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
