'use client'

import { useEffect } from 'react'
import styles from './InfoPage.module.css'
import type { WritingBlock, WritingEntry } from './WritingPage'

function formatDate(raw: string): string {
  // `YYYY-MM-DD` from Sanity → "MM DD YY" (e.g. "04 18 26"). Matches
  // `WritingPage`'s row formatting so the lightbox and row never disagree.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
  if (!match) return raw
  const [, yyyy, mm, dd] = match
  return `${mm} ${dd} ${yyyy.slice(-2)}`
}

/* ── Minimal portable-text renderer ───────────────────────────
   Handles exactly the subset we seed from `scripts/seed-writings.ts`:
     • `style: 'normal'` → <p>
     • `style: 'h3'`     → <h3>
     • `listItem: 'bullet'` → collected into a shared <ul>
   Unknown styles fall back to <p>. Spans are concatenated — we don't
   render marks (bold/italic/link) yet because the current essay doesn't
   use any. Easy to extend. */

function getBlockText(block: WritingBlock): string {
  return (block.children || []).map((c) => c.text ?? '').join('')
}

function renderBlocks(blocks: WritingBlock[]): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let listBuffer: WritingBlock[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    out.push(
      <ul
        key={`list-${out.length}`}
        className={styles.lightboxList}
      >
        {listBuffer.map((b, i) => (
          <li
            key={b._key ?? `li-${i}`}
            className={styles.lightboxListItem}
          >
            {getBlockText(b)}
          </li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  blocks.forEach((block, i) => {
    if (block.listItem === 'bullet') {
      listBuffer.push(block)
      return
    }
    flushList()
    const text = getBlockText(block)
    const key = block._key ?? `b-${i}`
    if (block.style === 'h3' || block.style === 'h2') {
      out.push(
        <h3 key={key} className={styles.lightboxHeading}>
          {text}
        </h3>
      )
    } else {
      out.push(
        <p key={key} className={styles.lightboxPara}>
          {text}
        </p>
      )
    }
  })
  flushList()
  return out
}

export default function WritingLightbox({
  entry,
  onClose,
}: {
  entry: WritingEntry
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Lock body scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className={styles.lightboxOverlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.lightboxPanel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
      >
        <div className={styles.lightboxScroll}>
          <article className={styles.lightboxArticle}>
            <h2 className={styles.lightboxTitle}>{entry.title}</h2>
            {entry.description ? (
              <p className={styles.lightboxDescription}>{entry.description}</p>
            ) : null}
            <p className={styles.lightboxDate}>{formatDate(entry.date)}</p>
            {entry.imageUrl ? (
              <img
                className={styles.lightboxImage}
                src={entry.imageUrl}
                alt={entry.title}
              />
            ) : null}
            {entry.text ? renderBlocks(entry.text) : null}
          </article>
        </div>
        <div className={styles.lightboxBlurFade} aria-hidden />
      </div>
    </div>
  )
}
