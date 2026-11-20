import { useCallback } from 'react'
import { useTheoryStore } from '../store/useTheoryStore'
import { translate } from './messages'
import type { Locale, MessageKey } from './messages'

export function useI18n() {
  const locale = useTheoryStore((state) => state.locale)
  const setLocale = useTheoryStore((state) => state.setLocale)
  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  )
  return { locale, setLocale, t }
}

export type { Locale, MessageKey }
