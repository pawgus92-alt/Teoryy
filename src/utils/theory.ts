import type { Category, Comment, Theory, TheoryDraft, TheoryStatus } from '../types/theory'
import { isCategory } from '../types/theory'
import { countComments } from './format'

export interface TheoryQuery {
  q: string
  category: Category | 'all'
  status: TheoryStatus | 'all'
  sort: 'new' | 'popular' | 'discussed'
}

export function ratingOf(theory: Theory): number {
  return theory.votesUp - theory.votesDown
}

export function filterTheories(theories: Theory[], query: TheoryQuery): Theory[] {
  const needle = query.q.trim().toLowerCase()
  const filtered = theories.filter((theory) => {
    if (query.category !== 'all' && theory.category !== query.category) return false
    if (query.status !== 'all' && theory.status !== query.status) return false
    if (!needle) return true
    const haystack = [theory.title, theory.summary, theory.body, theory.author, ...theory.tags]
      .join('\n')
      .toLowerCase()
    return haystack.includes(needle)
  })

  const sorted = [...filtered]
  sorted.sort((left, right) => {
    if (query.sort === 'popular') {
      const byRating = ratingOf(right) - ratingOf(left)
      if (byRating !== 0) return byRating
    }
    if (query.sort === 'discussed') {
      const byComments = countComments(right.comments) - countComments(left.comments)
      if (byComments !== 0) return byComments
    }
    return right.createdAt.localeCompare(left.createdAt)
  })
  return sorted
}

export interface FieldErrors {
  title?: string
  summary?: string
  body?: string
  category?: string
  tags?: string
  predictedDate?: string
}

export interface DraftInput {
  title: string
  summary: string
  body: string
  category: string
  tags: string
  predictedDate: string
  anonymous: boolean
}

export function parseTags(raw: string): { tags: string[]; error?: string } {
  const parts = raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  const unique: string[] = []
  const seen = new Set<string>()
  for (const tag of parts) {
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(tag)
  }
  if (unique.length > 6) return { tags: unique, error: 'Не больше 6 тегов' }
  const tooLong = unique.find((tag) => tag.length < 2 || tag.length > 24)
  if (tooLong) return { tags: unique, error: 'Каждый тег — от 2 до 24 символов' }
  return { tags: unique }
}

export function validateDraft(input: DraftInput): { errors: FieldErrors; value: TheoryDraft | null } {
  const errors: FieldErrors = {}
  const title = input.title.trim()
  const summary = input.summary.trim()
  const body = input.body.trim()

  if (!title) errors.title = 'Заголовок обязателен'
  else if (title.length < 10) errors.title = 'Минимум 10 символов'
  else if (title.length > 120) errors.title = 'Максимум 120 символов'

  if (!summary) errors.summary = 'Краткое описание обязательно'
  else if (summary.length < 20) errors.summary = 'Минимум 20 символов'
  else if (summary.length > 400) errors.summary = 'Максимум 400 символов'

  if (body.length > 8000) errors.body = 'Максимум 8000 символов'

  if (!isCategory(input.category)) errors.category = 'Выберите категорию'

  const parsedTags = parseTags(input.tags)
  if (parsedTags.error) errors.tags = parsedTags.error

  let predictedDate: string | undefined
  if (input.predictedDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.predictedDate)) {
      errors.predictedDate = 'Укажите корректную дату'
    } else {
      predictedDate = input.predictedDate
    }
  }

  if (Object.keys(errors).length > 0 || !isCategory(input.category)) {
    return { errors, value: null }
  }

  return {
    errors,
    value: {
      title,
      summary,
      body,
      category: input.category,
      tags: parsedTags.tags,
      predictedDate,
      anonymous: input.anonymous,
    },
  }
}

export function emptyDraft(category: Category = 'science'): DraftInput {
  return {
    title: '',
    summary: '',
    body: '',
    category,
    tags: '',
    predictedDate: '',
    anonymous: false,
  }
}

export function draftFromTheory(theory: Theory): DraftInput {
  return {
    title: theory.title,
    summary: theory.summary,
    body: theory.body,
    category: theory.category,
    tags: theory.tags.join(', '),
    predictedDate: theory.predictedDate ?? '',
    anonymous: theory.anonymous,
  }
}

export function findComment(comments: Comment[], id: string): Comment | undefined {
  for (const comment of comments) {
    if (comment.id === id) return comment
    const nested = findComment(comment.replies, id)
    if (nested) return nested
  }
  return undefined
}
