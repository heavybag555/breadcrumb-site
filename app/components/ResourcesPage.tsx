'use client'

import Link from 'next/link'
import { staggerEnter } from '@/app/lib/staggerEnter'
import styles from './InfoPage.module.css'
import FadeImage from './FadeImage'
import type { Resource, ResourcesByCategory } from '@/sanity/types'

const EMPTY_RESOURCES: ResourcesByCategory = {
  learning: [],
  reading: [],
  watching: [],
}

/* ── Notion-style mention link ────────────────────────────────
   Each resource renders as a row: preview thumbnail + label.
   Rows stack vertically, all flush-left within the column.     */

// Max characters shown in a mention label before we hard-truncate.
// CSS ellipsis still clips the visible line if the column is narrower
// than the truncated string — this cap just prevents absurdly long
// titles from pushing siblings out of alignment on wider columns.
const MAX_LABEL_CHARS = 44

function truncateLabel(label: string): string {
  if (label.length <= MAX_LABEL_CHARS) return label
  return label.slice(0, MAX_LABEL_CHARS - 1).trimEnd() + '…'
}

function ResourceMention({ resource }: { resource: Resource }) {
  const preview = resource.previewImage
  const displayLabel = truncateLabel(resource.label)
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.mention}
    >
      <span className={styles.mentionThumb} aria-hidden="true">
        {preview ? (
          <FadeImage src={preview} alt="" loading="lazy" />
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 1.5H6.5L9.5 4.5V10.5H2.5V1.5Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 1.5V4.5H9.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.mentionLabel} title={resource.label}>
        {displayLabel}
      </span>
    </a>
  )
}

function ResourceMentionList({
  title,
  items,
}: {
  title: string
  items: Resource[]
}) {
  return (
    <div className={styles.scopeBlock}>
      <p className={`${styles.scopeTitle} ${styles.resourceScopeTitle}`}>
        {title}
        <span className={styles.resourceTitleArrow} aria-hidden="true">↗</span>
      </p>
      {items.length > 0 ? (
        <div className={styles.mentionList}>
          {items.map((r) => (
            <ResourceMention key={r._id} resource={r} />
          ))}
        </div>
      ) : (
        <p className={styles.bodyText}>—</p>
      )}
    </div>
  )
}

export default function ResourcesPage({
  resources = EMPTY_RESOURCES,
}: {
  resources?: ResourcesByCategory
} = {}) {
  return (
    <main className={styles.page}>
      {/* ── Brand: always sticky at top-left ── */}
      <p className={`${styles.brand} animate-enter`} style={staggerEnter(1)}>
        <Link href="/" aria-label="2u4u Studio — home">
          2u4u Studio
        </Link>
      </p>

      {/* ── Resources sections ── */}
      <div className={styles.sections}>
        <div className={`${styles.infoRow} ${styles.resourcesRow}`}>
          <div
            className={`${styles.col} ${styles.resourcesListCol} animate-enter`}
            style={staggerEnter(2)}
          >
            <ResourceMentionList title="Learning" items={resources.learning} />
          </div>
          <div
            className={`${styles.col} ${styles.resourcesListCol} animate-enter`}
            style={staggerEnter(3)}
          >
            <ResourceMentionList title="Reading" items={resources.reading} />
          </div>
          <div
            className={`${styles.col} ${styles.resourcesListCol} animate-enter`}
            style={staggerEnter(4)}
          >
            <ResourceMentionList title="Watching" items={resources.watching} />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={`${styles.footer} ${styles.contentSection}`}>
        <div
          className={`${styles.footerCol} animate-enter`}
          style={staggerEnter(5)}
        >
          <a href="/" className={styles.footerLink}>
            2u4u.studio
          </a>
        </div>
        <div
          className={`${styles.footerColCenter} animate-enter`}
          style={staggerEnter(6)}
        >
          <p className={styles.footerCenter}>
            Web, Photo, and Interaction Studio based in Los Angeles, CA
          </p>
        </div>
        <div
          className={`${styles.footerColRight} animate-enter`}
          style={staggerEnter(7)}
        >
          <p>© 2026</p>
        </div>
      </footer>
    </main>
  )
}
