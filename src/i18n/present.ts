import type { Comment, Theory } from '../types/theory'
import type { Locale } from './messages'
import { seedTheories } from '../utils/seed'
import { COMMENT_EN, THEORY_EN } from './content-en'

let cachedSeed: Theory[] | null = null
let cachedComments: Map<string, string> | null = null

function seedList(): Theory[] {
  if (!cachedSeed) cachedSeed = seedTheories()
  return cachedSeed
}

function seedComments(): Map<string, string> {
  if (cachedComments) return cachedComments
  const map = new Map<string, string>()
  const walk = (comments: Comment[]) => {
    for (const comment of comments) {
      map.set(comment.id, comment.text)
      walk(comment.replies)
    }
  }
  for (const theory of seedList()) walk(theory.comments)
  cachedComments = map
  return map
}

function translateComments(comments: Comment[], locale: Locale): Comment[] {
  if (locale !== 'en') return comments
  const originals = seedComments()
  return comments.map((comment) => {
    const english = COMMENT_EN[comment.id]
    const unchanged = originals.get(comment.id) === comment.text
    return {
      ...comment,
      text: english && unchanged ? english : comment.text,
      replies: translateComments(comment.replies, locale),
    }
  })
}

export function presentTheory(theory: Theory, locale: Locale): Theory {
  const comments = translateComments(theory.comments, locale)
  if (locale !== 'en') return comments === theory.comments ? theory : { ...theory, comments }
  const english = THEORY_EN[theory.id]
  const source = seedList().find((item) => item.id === theory.id)
  const untouched =
    english &&
    source &&
    source.title === theory.title &&
    source.summary === theory.summary &&
    source.body === theory.body &&
    source.tags.join('\u0000') === theory.tags.join('\u0000')
  if (!untouched || !english) return { ...theory, comments }
  return {
    ...theory,
    title: english.title,
    summary: english.summary,
    body: english.body,
    tags: english.tags,
    comments,
  }
}

export function displayAuthor(name: string, anonymous: boolean, label: string): string {
  if (anonymous || name === 'Аноним' || name === 'Anonymous') return label
  return name
}

export function searchBlob(theory: Theory): string {
  const english = THEORY_EN[theory.id]
  const parts = [theory.title, theory.summary, theory.body, theory.author, theory.authorName, ...theory.tags]
  if (english) parts.push(english.title, english.summary, english.body, ...english.tags)
  const walk = (comments: Comment[]) => {
    for (const comment of comments) {
      parts.push(comment.text, comment.author)
      const translated = COMMENT_EN[comment.id]
      if (translated) parts.push(translated)
      walk(comment.replies)
    }
  }
  walk(theory.comments)
  return parts.join('\n').toLowerCase()
}
