'use client'

import { staggerEnter } from '@/app/lib/staggerEnter'
import styles from './WorkIndex.module.css'
import type { Project, PhotoProject, WorkItem } from '@/sanity/types'

/* ── Field helpers (web + photo projects share the index row) ── */

function itemName(item: WorkItem): string {
  if (item._type === 'photoProject') return item.title
  return (item as Project).clientName || item.title
}

function itemDomain(item: WorkItem): string {
  if (item._type === 'project') return (item as Project).domain ?? ''
  return ''
}

function formatTag(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1)
}

type TagKind = 'type' | 'topic' | 'stack'

function itemTagGroups(
  item: WorkItem
): { label: string; kind: TagKind }[] {
  const typeTag = item._type === 'photoProject' ? 'Photo' : 'Web'
  const topics = (item.tags ?? [])
    .map(formatTag)
    .filter((tag) => tag.toLowerCase() !== typeTag.toLowerCase())
    .map((label) => ({ label, kind: 'topic' as const }))
  const stack =
    item._type === 'project'
      ? ((item as Project).stack ?? [])
          .map(formatTag)
          .map((label) => ({ label, kind: 'stack' as const }))
      : []
  return [{ label: typeTag, kind: 'type' }, ...topics, ...stack]
}

function DomainArrow() {
  return (
    <svg
      className={styles.rowDomainArrow}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function itemHref(item: WorkItem): string {
  if (item._type === 'project') return (item as Project).href ?? '#'
  return '#'
}

export { itemDomain, itemHref, itemName }

/* ── Work index — list rows with inline project previews ── */

export default function WorkIndex({
  projects,
  staggerBase = 1,
}: {
  projects: WorkItem[]
  staggerBase?: number
}) {
  return (
    <div className={styles.list}>
      <p
        className={`${styles.label} animate-enter`}
        style={staggerEnter(staggerBase)}
      >
        Selected work
      </p>

      {projects.map((item, i) => {
        const name = itemName(item)
        const domain = itemDomain(item)
        const tagGroups = itemTagGroups(item)
        const href = itemHref(item)
        const isInternal = href === '#'

        return (
          <a
            key={item._id}
            href={href}
            target={isInternal ? undefined : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
            className={`${styles.row} animate-enter`}
            style={staggerEnter(staggerBase + 1 + i)}
          >
            <span className={styles.rowLead}>
              <span className={styles.rowIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.rowMedia}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className={styles.rowMediaImg}
                    loading="lazy"
                  />
                ) : null}
              </span>
            </span>
            <span className={styles.rowName}>{name}</span>
            <span className={styles.rowDomain}>
              {domain ? (
                <>
                  <span className={styles.rowDomainLabel}>{domain}</span>
                  <DomainArrow />
                </>
              ) : null}
            </span>
            <span className={styles.rowTag}>
              {tagGroups.map(({ label, kind }, ti) => (
                <span
                  key={`${kind}-${label}-${ti}`}
                  className={styles.tagBadge}
                >
                  {label}
                </span>
              ))}
            </span>
          </a>
        )
      })}

      {projects.length > 0 && (
        <div
          className={`${styles.listEndRule} animate-enter`}
          style={staggerEnter(staggerBase + 1 + projects.length)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
