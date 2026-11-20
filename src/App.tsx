import { useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { AddTheoryPage } from './pages/AddTheoryPage'
import { HomePage } from './pages/HomePage'
import { StatsPage } from './pages/StatsPage'
import { TheoryPage } from './pages/TheoryPage'
import { useTheoryStore } from './store/useTheoryStore'

export default function App() {
  const toast = useTheoryStore((state) => state.toast)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/theory/:id" element={<TheoryPage />} />
          <Route path="/add" element={<AddTheoryPage />} />
          <Route path="/edit/:id" element={<AddTheoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs leading-5 text-mute">
        Данные живут в localStorage этого браузера. Стор ходит в один репозиторий — его можно заменить на REST, Supabase или Firebase, не переписывая страницы.
      </footer>
      {toast && <Toast message={toast} />}
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-bg shadow-card">
      {message}
    </div>
  )
}

function NotFound() {
  useEffect(() => {
    document.title = 'Страница не найдена — Теории'
    return () => {
      document.title = 'Теории'
    }
  }, [])

  return (
    <div className="py-20 text-center">
      <p className="text-5xl" aria-hidden>
        🧭
      </p>
      <h1 className="mt-4 font-serif text-4xl">Такой страницы нет</h1>
      <Link to="/" className="mt-3 inline-block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        В ленту
      </Link>
    </div>
  )
}
