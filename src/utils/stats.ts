import type { Theory } from '../types/theory'
import { formatMonth } from './format'
import { ratingOf } from './theory'

export interface AuthorStat {
  name: string
  theories: number
  rating: number
}

export interface MonthPoint {
  key: string
  label: string
  count: number
  cumulative: number
}

export interface DashboardStats {
  total: number
  fulfilled: number
  refuted: number
  pending: number
  rate: number
  topTheories: Theory[]
  authors: AuthorStat[]
  series: MonthPoint[]
}

function monthKey(value: string): string {
  return value.slice(0, 7)
}

function shiftMonth(key: string, amount: number): string {
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, month - 1 + amount, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function fulfilledSeries(theories: Theory[]): MonthPoint[] {
  const fulfilled = theories.filter((theory) => theory.status === 'fulfilled' && theory.fulfilledAt)
  if (fulfilled.length === 0) return []

  const counts = new Map<string, number>()
  for (const theory of fulfilled) {
    const key = monthKey(theory.fulfilledAt!)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const keys = [...counts.keys()].sort()
  let cursor = keys[0]
  const end = currentMonth() > keys[keys.length - 1] ? currentMonth() : keys[keys.length - 1]
  const points: MonthPoint[] = []
  let cumulative = 0
  while (cursor <= end) {
    const count = counts.get(cursor) ?? 0
    cumulative += count
    points.push({ key: cursor, label: formatMonth(cursor), count, cumulative })
    cursor = shiftMonth(cursor, 1)
  }
  return points
}

export function buildStats(theories: Theory[]): DashboardStats {
  const fulfilled = theories.filter((theory) => theory.status === 'fulfilled').length
  const refuted = theories.filter((theory) => theory.status === 'refuted').length
  const pending = theories.filter((theory) => theory.status === 'pending').length
  const total = theories.length

  const authors = new Map<string, AuthorStat>()
  for (const theory of theories) {
    const name = theory.author
    const current = authors.get(name) ?? { name, theories: 0, rating: 0 }
    current.theories += 1
    current.rating += ratingOf(theory)
    authors.set(name, current)
  }

  return {
    total,
    fulfilled,
    refuted,
    pending,
    rate: total === 0 ? 0 : Math.round((fulfilled / total) * 100),
    topTheories: [...theories].sort((a, b) => ratingOf(b) - ratingOf(a)).slice(0, 5),
    authors: [...authors.values()]
      .sort((a, b) => b.theories - a.theories || b.rating - a.rating || a.name.localeCompare(b.name, 'ru'))
      .slice(0, 5),
    series: fulfilledSeries(theories),
  }
}
