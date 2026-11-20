import type { Locale } from '../i18n/messages'
import type { Comment } from '../types/theory'

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function uid(prefix: string): string {
  const bytes = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  return `${prefix}-${bytes}`
}

export function parseDay(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function formatDate(value: string, locale: Locale = 'ru'): string {
  const date = value.length <= 10 ? parseDay(value) : new Date(value)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatMonth(key: string, locale: Locale = 'ru'): string {
  const date = parseDay(`${key}-01`)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', { month: 'short', year: 'numeric' }).format(date)
}

export function todayInputValue(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function plural(count: number, locale: Locale, one: string, few: string, many: string): string {
  if (locale === 'en') return Math.abs(count) === 1 ? one : many
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}

export function countComments(comments: Comment[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0)
}

export function insertReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [...comment.replies, reply] }
    }
    return { ...comment, replies: insertReply(comment.replies, parentId, reply) }
  })
}

export function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}
