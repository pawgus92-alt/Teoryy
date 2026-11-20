import type { TheoryStatus } from '../types/theory'
import { STATUS_META } from '../types/theory'
import { cx } from '../utils/format'

export function StatusBadge({ status }: { status: TheoryStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', meta.chip)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden />
      {meta.label}
    </span>
  )
}
