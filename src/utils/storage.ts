import type {
  AppState,
  Category,
  Comment,
  ConfirmChoice,
  ConfirmVotes,
  Theory,
  TheoryStatus,
  UserProfile,
  VoteDirection,
} from '../types/theory'
import { isCategory } from '../types/theory'
import { seedTheories } from './seed'

export const STORAGE_KEY = 'teorii.v1'

/**
 * Единственный шов хранилища.
 * Сейчас состояние лежит в localStorage. Чтобы перейти на REST, Supabase
 * или Firebase, реализуйте TheoryRepository и подставьте его в `repository`:
 * страницы и Zustand-стор ходят только сюда.
 */
export interface TheoryRepository {
  load(): AppState | null
  save(state: AppState): void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeComments(value: unknown): Comment[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.text !== 'string') return []
    return [
      {
        id: item.id,
        author: asString(item.author, 'Аноним'),
        text: item.text,
        createdAt: asString(item.createdAt, new Date(0).toISOString()),
        replies: normalizeComments(item.replies),
      },
    ]
  })
}

function normalizeStatus(value: unknown): TheoryStatus {
  return value === 'fulfilled' || value === 'refuted' || value === 'pending' ? value : 'pending'
}

function normalizeConfirm(value: unknown): ConfirmVotes {
  const source = isRecord(value) ? value : {}
  return {
    fulfilled: asNumber(source.fulfilled),
    refuted: asNumber(source.refuted),
    notYet: asNumber(source.notYet),
  }
}

function normalizeTheory(value: unknown): Theory | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string') return null
  const category = isCategory(asString(value.category)) ? (value.category as Category) : 'other'
  const anonymous = value.anonymous === true || value.author === 'Аноним'
  const authorName = asString(value.authorName, asString(value.author, 'Аноним'))
  return {
    id: value.id,
    title: value.title,
    summary: asString(value.summary),
    body: asString(value.body),
    category,
    tags: Array.isArray(value.tags) ? value.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    author: anonymous ? 'Аноним' : asString(value.author, authorName),
    authorName,
    authorId: asString(value.authorId, `legacy-${value.id}`),
    anonymous,
    createdAt: asString(value.createdAt, new Date(0).toISOString()),
    predictedDate: typeof value.predictedDate === 'string' ? value.predictedDate : undefined,
    status: normalizeStatus(value.status),
    fulfilledAt: typeof value.fulfilledAt === 'string' ? value.fulfilledAt : undefined,
    votesUp: asNumber(value.votesUp),
    votesDown: asNumber(value.votesDown),
    confirmVotes: normalizeConfirm(value.confirmVotes),
    comments: normalizeComments(value.comments),
  }
}

function normalizeVotes(value: unknown): Record<string, VoteDirection> {
  if (!isRecord(value)) return {}
  const votes: Record<string, VoteDirection> = {}
  for (const [key, vote] of Object.entries(value)) {
    if (vote === 'up' || vote === 'down') votes[key] = vote
  }
  return votes
}

function normalizeConfirmations(value: unknown): Record<string, ConfirmChoice> {
  if (!isRecord(value)) return {}
  const choices: Record<string, ConfirmChoice> = {}
  for (const [key, choice] of Object.entries(value)) {
    if (choice === 'fulfilled' || choice === 'refuted' || choice === 'notYet') choices[key] = choice
  }
  return choices
}

function normalizeUser(value: unknown): UserProfile | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null
  const name = asString(value.name).trim()
  if (name.length < 2) return null
  return { id: value.id, name: name.slice(0, 40), isModerator: value.isModerator === true }
}

export function createUser(): UserProfile {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return { id: `user-${crypto.randomUUID()}`, name: `Исследователь ${suffix}`, isModerator: false }
}

export function createInitialState(): AppState {
  return {
    theories: seedTheories(),
    user: createUser(),
    votes: {},
    confirmations: {},
    theme: 'dark',
  }
}

function normalizeState(value: unknown): AppState | null {
  if (!isRecord(value) || !Array.isArray(value.theories)) return null
  const user = normalizeUser(value.user)
  if (!user) return null
  return {
    theories: value.theories.flatMap((item) => {
      const theory = normalizeTheory(item)
      return theory ? [theory] : []
    }),
    user,
    votes: normalizeVotes(value.votes),
    confirmations: normalizeConfirmations(value.confirmations),
    theme: value.theme === 'light' ? 'light' : 'dark',
  }
}

export const localRepository: TheoryRepository = {
  load() {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return normalizeState(JSON.parse(raw))
    } catch {
      return null
    }
  },
  save(state) {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },
}

export const repository: TheoryRepository = localRepository

export function loadState(): AppState {
  const stored = repository.load()
  if (stored) {
    applyTheme(stored.theme)
    return stored
  }
  const fresh = createInitialState()
  repository.save(fresh)
  applyTheme(fresh.theme)
  return fresh
}

export function saveState(state: AppState): void {
  repository.save(state)
  applyTheme(state.theme)
}

export function applyTheme(theme: AppState['theme']): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme !== 'light')
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', theme === 'light' ? '#f6f3ec' : '#0c0e14')
}
