'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './InfoPage.module.css'
import FadeImage from './FadeImage'
import WritingLightbox from './WritingLightbox'

/* ── Portable Text shapes we accept from Sanity ──
   Kept intentionally narrow — our minimal renderer only reads `style`,
   `listItem`, and span children. Shared with `@/sanity/types`. */

export interface WritingBlockSpan {
  _type: 'span'
  _key?: string
  text: string
  marks?: string[]
}

export interface WritingBlock {
  _type: 'block'
  _key?: string
  style?: string
  listItem?: string
  level?: number
  children: WritingBlockSpan[]
  markDefs?: Array<Record<string, unknown>>
}

export interface WritingEntry {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string | null
  url?: string
  text?: WritingBlock[]
}

const EMPTY_ENTRIES: WritingEntry[] = []

function formatDate(raw: string): string {
  // Input shape is ISO `YYYY-MM-DD` from Sanity's date field. Render as
  // "MM DD YY" (e.g. "04 18 26"). Falls through to the raw string if the
  // input doesn't match the expected shape.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
  if (!match) return raw
  const [, yyyy, mm, dd] = match
  return `${mm} ${dd} ${yyyy.slice(-2)}`
}

function hasBody(entry: WritingEntry): boolean {
  return Array.isArray(entry.text) && entry.text.length > 0
}

function WritingRow({
  entry,
  onOpen,
}: {
  entry: WritingEntry
  onOpen: (entry: WritingEntry) => void
}) {
  const preview = entry.imageUrl
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
    null
  )
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!preview) return
    const x = e.clientX
    const y = e.clientY
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setHoverPos({ x, y })
    })
  }

  const handleMouseLeave = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setHoverPos(null)
  }

  const content = (
    <>
      <span className={`${styles.writingCell} ${styles.writingCellTitle}`}>
        <span className={styles.writingTitleText}>
          {entry.title}
          <svg
            className={styles.writingTitlePlus}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 3.5V10.5M3.5 7H10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      <span className={`${styles.writingCell} ${styles.writingCellDesc}`}>
        {entry.description}
      </span>
      <span className={`${styles.writingCell} ${styles.writingCellDate}`}>
        {formatDate(entry.date)}
      </span>
    </>
  )

  const rowClass = `${styles.writingRow} ${preview ? styles.writingRowHoverCursor : ''}`

  // Decide the row's element based on what's available:
  //  1. body text → <button> that opens the lightbox
  //  2. external `url` → <a> target="_blank" (legacy path)
  //  3. neither → non-interactive <span>
  let Row: React.ReactNode
  if (hasBody(entry)) {
    Row = (
      <button
        type="button"
        className={rowClass}
        onClick={() => onOpen(entry)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </button>
    )
  } else if (entry.url) {
    Row = (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    )
  } else {
    Row = (
      <span
        className={rowClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </span>
    )
  }

  return (
    <>
      {Row}
      {preview && hoverPos ? (
        <FadeImage
          className={styles.writingHoverImage}
          src={preview}
          alt=""
          aria-hidden="true"
          style={{
            transform: `translate3d(${hoverPos.x}px, ${hoverPos.y}px, 0)`,
          }}
        />
      ) : null}
    </>
  )
}

export default function WritingPage({
  entries = EMPTY_ENTRIES,
}: {
  entries?: WritingEntry[]
} = {}) {
  const [active, setActive] = useState<WritingEntry | null>(null)

  return (
    <main className={styles.page}>
      {/* ── Brand: always sticky at top-left ── */}
      <p className={styles.brand}>2u4u Studio</p>

      {/* ── Writing sections ── */}
      <div className={styles.sections}>
        <div className={styles.infoRow}>
          <div className={styles.col}>
            <p className={styles.rowLabel}>Writing</p>
          </div>
          <div className={styles.writingEntries}>
            <div className={styles.writingHeader}>
              <span className={`${styles.writingCell} ${styles.scopeTitle}`}>
                Title
              </span>
              <span className={`${styles.writingCell} ${styles.scopeTitle}`}>
                Description
              </span>
              <span className={`${styles.writingCell} ${styles.scopeTitle}`}>
                Date
              </span>
            </div>
            {entries.length > 0 ? (
              <div className={styles.writingList}>
                {entries.map((entry) => (
                  <WritingRow
                    key={entry.id}
                    entry={entry}
                    onOpen={setActive}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.bodyText}>—</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={`${styles.footer} ${styles.contentSection}`}>
        <div className={styles.footerCol}>
          <a href="/" className={styles.footerLink}>
            2u4u.studio
          </a>
        </div>
        <div className={styles.footerColCenter}>
          <p className={styles.footerCenter}>
            Web, Photo, and Interaction Studio based in Los Angeles, CA
          </p>
        </div>
        <div className={styles.footerColRight}>
          <p>© 2026</p>
        </div>
      </footer>

      {active ? (
        <WritingLightbox entry={active} onClose={() => setActive(null)} />
      ) : null}
    </main>
  )
}
