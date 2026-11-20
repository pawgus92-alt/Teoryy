import { useEffect, useRef, useState } from 'react'
import { BarChart3, Moon, Plus, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
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
    showToast(ok ? 'Имя сохранено' : 'Имя: от 2 до 40 символов')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'rounded-full px-3 py-1.5 text-sm font-semibold',
      isActive ? 'bg-indigo-600/15 text-ink' : 'text-mute hover:text-ink',
    )

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <NavLink to="/" end className="mr-auto flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-amber-200" aria-hidden>
            <svg viewBox="0 0 32 32" className="h-5 w-5">
              <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="22" cy="12" r="2.1" fill="#fbbf24" />
            </svg>
          </span>
          <span className="font-serif text-[1.7rem] leading-none tracking-tight">Теории</span>
        </NavLink>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Разделы">
          <NavLink to="/" end className={linkClass}>
            Лента
          </NavLink>
          <NavLink to="/stats" className={linkClass}>
            Статистика
          </NavLink>
        </nav>
        <NavLink
          to="/stats"
          aria-label="Статистика"
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute sm:hidden"
        >
          <BarChart3 size={18} />
        </NavLink>
        <NavLink
          to="/add"
          className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus size={16} aria-hidden />
          <span className="hidden sm:inline">Добавить теорию</span>
          <span className="sm:hidden">Новая</span>
        </NavLink>
        <button
          type="button"
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-mute hover:text-ink"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="max-w-40 truncate rounded-full border border-line px-3 py-2 text-sm font-medium"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            {user.name}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-card p-4 shadow-card">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Профиль в этом браузере</p>
              <label className="mt-3 block text-sm">
                Имя
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2"
                />
              </label>
              <button type="button" onClick={saveName} className="mt-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Сохранить имя
              </button>
              <label className="mt-4 flex items-start gap-2 text-sm">
                <input type="checkbox" checked={user.isModerator} onChange={toggleModerator} className="mt-1" />
                <span>
                  Режим модератора
                  <span className="mt-1 block text-xs text-mute">Локальный переключатель: можно закрывать чужие теории.</span>
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
                Вернуть демо-данные
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
