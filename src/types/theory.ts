export const CATEGORIES = [
  { id: 'science', label: 'Наука' },
  { id: 'conspiracy', label: 'Конспирология' },
  { id: 'tech', label: 'Технологии' },
  { id: 'future', label: 'Будущее' },
  { id: 'politics', label: 'Политика' },
  { id: 'other', label: 'Другое' },
] as const

export type Category = (typeof CATEGORIES)[number]['id']

export type TheoryStatus = 'pending' | 'fulfilled' | 'refuted'

export type VoteDirection = 'up' | 'down'

export type ConfirmChoice = 'fulfilled' | 'refuted' | 'notYet'

export interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
  replies: Comment[]
}

export interface ConfirmVotes {
  fulfilled: number
  refuted: number
  notYet: number
}

export interface Theory {
  id: string
  title: string
  summary: string
  body: string
  category: Category
  tags: string[]
  author: string
  authorName: string
  authorId: string
  anonymous: boolean
  createdAt: string
  predictedDate?: string
  status: TheoryStatus
  fulfilledAt?: string
  votesUp: number
  votesDown: number
  confirmVotes: ConfirmVotes
  comments: Comment[]
}

export interface UserProfile {
  id: string
  name: string
  isModerator: boolean
}

export interface TheoryDraft {
  title: string
  summary: string
  body: string
  category: Category
  tags: string[]
  predictedDate?: string
  anonymous: boolean
}

export interface AppState {
  theories: Theory[]
  user: UserProfile
  votes: Record<string, VoteDirection>
  confirmations: Record<string, ConfirmChoice>
  theme: 'dark' | 'light'
}

export const STATUS_META: Record<
  TheoryStatus,
  { label: string; short: string; dot: string; chip: string }
> = {
  pending: {
    label: 'Не подтверждена',
    short: 'На рассмотрении',
    dot: 'bg-amber-400',
    chip: 'bg-amber-400/15 text-amber-800 ring-amber-500/25 dark:text-amber-200',
  },
  fulfilled: {
    label: 'Сбылась',
    short: 'Сбылось',
    dot: 'bg-emerald-400',
    chip: 'bg-emerald-400/15 text-emerald-800 ring-emerald-500/25 dark:text-emerald-200',
  },
  refuted: {
    label: 'Опровергнута',
    short: 'Опровергнуто',
    dot: 'bg-rose-400',
    chip: 'bg-rose-400/15 text-rose-800 ring-rose-500/25 dark:text-rose-200',
  },
}

export function categoryLabel(category: Category): string {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category
}

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((item) => item.id === value)
}
