import { useEffect, useRef, useState } from 'react'
import { BarChart3, Moon, Plus, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import type { Locale } from '../i18n/messages'
import { useTheoryStore } from '../store/useTheoryStore'
import { cx } from '../utils/format'

export function Navbar() {
  const theme = useTheoryStore((state) => state.theme)
  const setTheme = useTheoryStore((state) => state.setTheme)
  const user = useTheoryStore((state) => state.user)
  const setUserName = useTheoryStore((state) => state.setUserName)
  const toggleModerator = useTheoryStore((state) => state.toggleModerator)
  const resetDemo = useTheoryStore((state) => state.resetDemo)
  const showToast = useTheoryStore((state) => state.showToast)
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setName(user.name), [user.name])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [open])

  const saveName = () => {
    const ok = setUserName(name)
    showToast(ok ? t('toastNameOk') : t('toastNameBad'))
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'rounded-full px-3 py-1.5 text-sm font-semibold',
      isActive ? 'bg-indigo-600/15 text-ink' : 'text-mute hover:text-ink',
    )

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-3">
        <NavLink to="/" end className="mr-auto flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-amber-200" aria-hidden>
            <svg viewBox="0 0 32 32" className="h-5 w-5">
              <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="22" cy="12" r="2.1" fill="#fbbf24" />
            </svg>
          </span>
          <span className="font-serif text-[1.7rem] leading-none tracking-tight">{t('brand')}</span>
        </NavLink>
        <nav className="hidden items-center gap-1 sm:flex" aria-label={t('sections')}>
          <NavLink to="/" end className={linkClass}>
            {t('feed')}
          </NavLink>
          <NavLink to="/stats" className={linkClass}>
            {t('stats')}
          </NavLink>
        </nav>
        <NavLink
          to="/stats"
          aria-label={t('stats')}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute sm:hidden"
        >
          <BarChart3 size={18} />
        </NavLink>
        <NavLink
          to="/add"
          className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus size={16} aria-hidden />
          <span className="hidden sm:inline">{t('addTheory')}</span>
          <span className="sm:hidden">{t('addShort')}</span>
        </NavLink>
        <div className="flex rounded-full border border-line p-0.5" role="group" aria-label={t('language')}>
          {(['ru', 'en'] as const satisfies readonly Locale[]).map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={locale === code}
              onClick={() => setLocale(code)}
              className={cx(
                'rounded-full px-2 py-1 text-xs font-semibold uppercase',
                locale === code ? 'bg-indigo-600 text-white' : 'text-mute hover:text-ink',
              )}
            >
              {code}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute hover:text-ink"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="max-w-24 truncate rounded-full border border-line px-3 py-2 text-sm font-medium sm:max-w-40"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            {user.name}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-card p-4 shadow-card">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{t('profile')}</p>
              <label className="mt-3 block text-sm">
                {t('name')}
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2"
                />
              </label>
              <button type="button" onClick={saveName} className="mt-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {t('saveName')}
              </button>
              <label className="mt-4 flex items-start gap-2 text-sm">
                <input type="checkbox" checked={user.isModerator} onChange={toggleModerator} className="mt-1" />
                <span>
                  {t('moderator')}
                  <span className="mt-1 block text-xs text-mute">{t('moderatorHint')}</span>
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  resetDemo()
                  setOpen(false)
                }}
                className="mt-4 text-sm font-semibold text-mute hover:text-ink"
              >
                {t('restoreDemo')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
