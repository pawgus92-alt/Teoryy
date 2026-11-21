import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryMessage } from '../i18n/messages'
import { displayAuthor, presentTheory } from '../i18n/present'
import { useI18n } from '../i18n/useI18n'
import type { Theory } from '../types/theory'
import { countComments, formatDate, plural } from '../utils/format'
import { StatusBadge } from './StatusBadge'
import { VoteButtons } from './VoteButtons'

export function TheoryCard({ theory, index }: { theory: Theory; index: number }) {
  const { locale, t } = useI18n()
  const reduce = useReducedMotion()
  const shown = presentTheory(theory, locale)
  const comments = countComments(shown.comments)

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.04 }}
      className="relative rounded-2xl border border-line bg-card shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <Link to={`/theory/${shown.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={shown.title} />
      <div className="pointer-events-none relative z-10 flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={theory.status} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{t(categoryMessage(shown.category))}</span>
        </div>
        <div>
          <h2 className="font-serif text-2xl leading-tight text-ink">{shown.title}</h2>
          <p className="mt-2 line-clamp-3 font-serif text-[1.02rem] leading-6 text-ink/80">{shown.summary}</p>
        </div>
        {shown.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {shown.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-bg px-2 py-0.5 text-xs text-mute">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-mute">
          <p>
            <span className="text-ink">{displayAuthor(shown.author, shown.anonymous, t('anonymous'))}</span>
            <span aria-hidden> · </span>
            <time dateTime={shown.createdAt}>{formatDate(shown.createdAt, locale)}</time>
          </p>
          <p className="inline-flex items-center gap-1">
            <MessageCircle size={14} aria-hidden />
            {comments} {plural(comments, locale, t('commentOne'), t('commentFew'), t('commentMany'))}
          </p>
        </div>
        <div className="pointer-events-auto">
          <VoteButtons theoryId={theory.id} votesUp={theory.votesUp} votesDown={theory.votesDown} />
        </div>
      </div>
    </motion.article>
  )
}
