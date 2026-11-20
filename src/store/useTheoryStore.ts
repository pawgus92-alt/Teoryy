import { create } from 'zustand'
import { translate } from '../i18n/messages'
import type { Locale } from '../i18n/messages'
import type { AppState, ConfirmChoice, Theory, TheoryDraft, TheoryStatus, VoteDirection } from '../types/theory'
import { insertReply, uid } from '../utils/format'
import { seedTheories } from '../utils/seed'
import { loadState, saveState } from '../utils/storage'

interface TheoryStore extends AppState {
  toast: string | null
  showToast: (message: string) => void
  setTheme: (theme: AppState['theme']) => void
  setLocale: (locale: Locale) => void
  setUserName: (name: string) => boolean
  toggleModerator: () => void
  resetDemo: () => void
  addTheory: (draft: TheoryDraft) => string
  updateTheory: (id: string, draft: TheoryDraft) => boolean
  deleteTheory: (id: string) => boolean
  setStatus: (id: string, status: TheoryStatus, fulfilledAt?: string) => boolean
  vote: (id: string, direction: VoteDirection) => void
  confirm: (id: string, choice: ConfirmChoice) => void
  addComment: (theoryId: string, text: string, parentId?: string) => boolean
}

let toastTimer = 0

function persist(state: TheoryStore): void {
  saveState({
    theories: state.theories,
    user: state.user,
    votes: state.votes,
    confirmations: state.confirmations,
    theme: state.theme,
    locale: state.locale,
  })
}

function canManage(state: Pick<TheoryStore, 'user'>, theory: Theory): boolean {
  return state.user.isModerator || state.user.id === theory.authorId
}

const initial = loadState()

export const useTheoryStore = create<TheoryStore>((set, get) => ({
  ...initial,
  toast: null,
  showToast: (message) => {
    window.clearTimeout(toastTimer)
    set({ toast: message })
    toastTimer = window.setTimeout(() => set({ toast: null }), 2600)
  },
  setTheme: (theme) => {
    set({ theme })
    persist(get())
  },
  setLocale: (locale) => {
    set({ locale })
    persist(get())
  },
  setUserName: (name) => {
    const trimmed = name.trim()
    if (trimmed.length < 2 || trimmed.length > 40) return false
    set({ user: { ...get().user, name: trimmed } })
    persist(get())
    return true
  },
  toggleModerator: () => {
    const user = get().user
    set({ user: { ...user, isModerator: !user.isModerator } })
    persist(get())
  },
  resetDemo: () => {
    set({ theories: seedTheories(), votes: {}, confirmations: {} })
    persist(get())
    get().showToast(translate(get().locale, 'toastDemo'))
  },
  addTheory: (draft) => {
    const user = get().user
    const id = uid('th')
    const theory: Theory = {
      id,
      title: draft.title,
      summary: draft.summary,
      body: draft.body,
      category: draft.category,
      tags: draft.tags,
      author: draft.anonymous ? 'Аноним' : user.name,
      authorName: user.name,
      authorId: user.id,
      anonymous: draft.anonymous,
      createdAt: new Date().toISOString(),
      predictedDate: draft.predictedDate,
      status: 'pending',
      votesUp: 0,
      votesDown: 0,
      confirmVotes: { fulfilled: 0, refuted: 0, notYet: 0 },
      comments: [],
    }
    set({ theories: [theory, ...get().theories] })
    persist(get())
    return id
  },
  updateTheory: (id, draft) => {
    const current = get().theories.find((theory) => theory.id === id)
    if (!current || !canManage(get(), current)) return false
    set({
      theories: get().theories.map((theory) =>
        theory.id === id
          ? {
              ...theory,
              title: draft.title,
              summary: draft.summary,
              body: draft.body,
              category: draft.category,
              tags: draft.tags,
              predictedDate: draft.predictedDate,
              anonymous: draft.anonymous,
              author: draft.anonymous ? 'Аноним' : theory.authorName,
            }
          : theory,
      ),
    })
    persist(get())
    return true
  },
  deleteTheory: (id) => {
    const current = get().theories.find((theory) => theory.id === id)
    if (!current || !canManage(get(), current)) return false
    const votes = { ...get().votes }
    const confirmations = { ...get().confirmations }
    delete votes[id]
    delete confirmations[id]
    set({
      theories: get().theories.filter((theory) => theory.id !== id),
      votes,
      confirmations,
    })
    persist(get())
    return true
  },
  setStatus: (id, status, fulfilledAt) => {
    const current = get().theories.find((theory) => theory.id === id)
    if (!current || !canManage(get(), current)) return false
    if (status === 'fulfilled' && !fulfilledAt) return false
    set({
      theories: get().theories.map((theory) =>
        theory.id === id
          ? {
              ...theory,
              status,
              fulfilledAt: status === 'fulfilled' ? fulfilledAt : undefined,
            }
          : theory,
      ),
    })
    persist(get())
    return true
  },
  vote: (id, direction) => {
    const current = get().votes[id]
    const votes = { ...get().votes }
    if (current === direction) delete votes[id]
    else votes[id] = direction

    set({
      votes,
      theories: get().theories.map((theory) => {
        if (theory.id !== id) return theory
        let votesUp = theory.votesUp
        let votesDown = theory.votesDown
        if (current === 'up') votesUp -= 1
        if (current === 'down') votesDown -= 1
        if (current !== direction) {
          if (direction === 'up') votesUp += 1
          else votesDown += 1
        }
        return { ...theory, votesUp: Math.max(0, votesUp), votesDown: Math.max(0, votesDown) }
      }),
    })
    persist(get())
  },
  confirm: (id, choice) => {
    const current = get().confirmations[id]
    const confirmations = { ...get().confirmations }
    if (current === choice) delete confirmations[id]
    else confirmations[id] = choice

    const shift = (votes: Theory['confirmVotes'], key: ConfirmChoice, delta: number): Theory['confirmVotes'] => ({
      ...votes,
      [key]: Math.max(0, votes[key] + delta),
    })

    set({
      confirmations,
      theories: get().theories.map((theory) => {
        if (theory.id !== id) return theory
        let confirmVotes = theory.confirmVotes
        if (current) confirmVotes = shift(confirmVotes, current, -1)
        if (current !== choice) confirmVotes = shift(confirmVotes, choice, 1)
        return { ...theory, confirmVotes }
      }),
    })
    persist(get())
  },
  addComment: (theoryId, text, parentId) => {
    const trimmed = text.trim()
    if (trimmed.length < 1 || trimmed.length > 2000) return false
    const reply: Theory['comments'][number] = {
      id: uid('c'),
      author: get().user.name,
      text: trimmed,
      createdAt: new Date().toISOString(),
      replies: [],
    }
    let placed = !parentId
    set({
      theories: get().theories.map((theory) => {
        if (theory.id !== theoryId) return theory
        if (!parentId) return { ...theory, comments: [...theory.comments, reply] }
        const comments = insertReply(theory.comments, parentId, reply)
        placed = JSON.stringify(comments) !== JSON.stringify(theory.comments)
        return placed ? { ...theory, comments } : theory
      }),
    })
    if (!placed) return false
    persist(get())
    return true
  },
}))

export function canManageTheory(theory: Theory, userId: string, isModerator: boolean): boolean {
  return isModerator || theory.authorId === userId
}
