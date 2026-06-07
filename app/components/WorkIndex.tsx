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

function itemTags(item: WorkItem): string[] {
  const typeTag = item._type === 'photoProject' ? 'Photo' : 'Web'
  const extra = (item.tags ?? [])
    .map(formatTag)
    .filter((tag) => tag.toLowerCase() !== typeTag.toLowerCase())
  return [typeTag, ...extra]
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
        const tags = itemTags(item)
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
            <span className={styles.rowDomain}>{domain}</span>
            <span className={styles.rowTag}>
              {tags.map((tag, ti) => (
                <span key={`${tag}-${ti}`} className={styles.tagBadge}>
                  {tag}
                </span>
              ))}
            </span>
          </a>
        )
      })}

      {projects.length > 0 && (
        <div className={styles.listEndRule} aria-hidden="true" />
      )}
    </div>
  )
}
