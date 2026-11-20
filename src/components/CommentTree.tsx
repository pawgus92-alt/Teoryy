import { useState } from 'react'
import { Send } from 'lucide-react'
import { displayAuthor } from '../i18n/present'
import { useI18n } from '../i18n/useI18n'
import type { Comment } from '../types/theory'
import { useTheoryStore } from '../store/useTheoryStore'
import { formatDate, plural } from '../utils/format'

export function CommentTree({ theoryId, comments }: { theoryId: string; comments: Comment[] }) {
  const addComment = useTheoryStore((state) => state.addComment)
  const { locale, t } = useI18n()
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    const ok = addComment(theoryId, text)
    if (!ok) {
      setError(t('errComment'))
      return
    }
    setText('')
    setError('')
  }

  return (
    <section className="mt-10">
      <h2 className="font-serif text-3xl">{t('discussion')}</h2>
      <p className="mt-1 text-sm text-mute">
        {comments.length === 0
          ? t('discussionEmptyLead')
          : `${countAll(comments)} ${plural(countAll(comments), locale, t('replyOne'), t('replyFew'), t('replyMany'))}`}
      </p>
      <div className="mt-4 rounded-2xl border border-line bg-card p-4">
        <label htmlFor="root-comment" className="text-sm font-medium">
          {t('commentLabel')}
        </label>
        <textarea
          id="root-comment"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder={t('commentPlaceholder')}
          className="mt-2 w-full resize-y rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none ring-accent/40 focus:ring-2"
        />
        {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        <button
          type="button"
          onClick={submit}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Send size={15} aria-hidden />
          {t('send')}
        </button>
      </div>
      {comments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <p className="text-4xl" aria-hidden>
            💬
          </p>
          <p className="mt-3 font-serif text-2xl">{t('noComments')}</p>
          <p className="mt-1 text-sm text-mute">{t('noCommentsHint')}</p>
        </div>
      ) : (
        <ol className="mt-6 space-y-4">
          {comments.map((comment) => (
            <CommentNode key={comment.id} theoryId={theoryId} comment={comment} depth={0} />
          ))}
        </ol>
      )}
    </section>
  )
}

function countAll(comments: Comment[]): number {
  return comments.reduce((total, comment) => total + 1 + countAll(comment.replies), 0)
}

function CommentNode({ theoryId, comment, depth }: { theoryId: string; comment: Comment; depth: number }) {
  const addComment = useTheoryStore((state) => state.addComment)
  const { locale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    const ok = addComment(theoryId, text, comment.id)
    if (!ok) {
      setError(t('errReply'))
      return
    }
    setText('')
    setError('')
    setOpen(false)
  }

  return (
    <li className={depth > 0 ? 'ml-3 border-l border-line pl-3 sm:ml-5 sm:pl-4' : ''}>
      <article className="rounded-2xl border border-line bg-card px-4 py-3">
        <header className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-mute">
          <span className="font-semibold text-ink">{displayAuthor(comment.author, false, t('anonymous'))}</span>
          <time dateTime={comment.createdAt}>{formatDate(comment.createdAt, locale)}</time>
        </header>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.text}</p>
        <button type="button" onClick={() => setOpen((value) => !value)} className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          {open ? t('hideReply') : t('reply')}
        </button>
        {open && (
          <div className="mt-3">
            <label className="sr-only" htmlFor={`reply-${comment.id}`}>
              {t('replyFor', { name: displayAuthor(comment.author, false, t('anonymous')) })}
            </label>
            <textarea
              id={`reply-${comment.id}`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={2}
              className="w-full resize-y rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none ring-accent/40 focus:ring-2"
            />
            {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">{error}</p>}
            <button
              type="button"
              onClick={submit}
              className="mt-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              {t('reply')}
            </button>
          </div>
        )}
      </article>
      {comment.replies.length > 0 && (
        <ol className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode key={reply.id} theoryId={theoryId} comment={reply} depth={depth + 1} />
          ))}
        </ol>
      )}
    </li>
  )
}
