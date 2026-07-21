'use client'

import { useEffect, useRef, useState } from 'react'
import { staggerEnter } from '@/app/lib/staggerEnter'
import styles from './WorkIndex.module.css'
import type { Project, PhotoProject, WorkItem } from '@/sanity/types'

/* ── Field helpers ── */

function itemName(item: WorkItem): string {
  if (item._type === 'photoProject') return item.title
  return (item as Project).clientName || item.title
}

function itemDomain(item: WorkItem): string {
  if (item._type === 'project') return (item as Project).domain ?? ''
  return ''
}

function itemMeta(item: WorkItem): string {
  if (item._type === 'project') return ((item as Project).stack ?? []).join(', ')
  const photo = item as PhotoProject
  return [photo.location, photo.year].filter(Boolean).join(', ')
}

function DomainArrow() {
  return (
    <svg
      className={styles.domainArrow}
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

function itemVideo(item: WorkItem): string | undefined {
  return (item as { previewVideoUrl?: string }).previewVideoUrl
}

/* ── Image optimization ──
   Grid cells render at ~260px (2x ≈ 520px) so serving multi-MB originals
   is wasteful. Route Sanity CDN URLs through its image pipeline and local
   /public files through Next's optimizer, both emitting resized WebP/AVIF. */

const GRID_WIDTHS = [384, 640, 828]
/* Match the page container: 20px margins, 20px gutter at 2-col. */
const GRID_SIZES =
  '(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 60px) / 2), 260px'

function buildSrc(src: string, w: number): string {
  if (src.includes('cdn.sanity.io')) {
    const sep = src.includes('?') ? '&' : '?'
    return `${src}${sep}w=${w}&fit=max&auto=format&q=75`
  }
  if (src.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`
  }
  return src
}

function optimized(src: string | undefined) {
  if (!src) return undefined
  return {
    src: buildSrc(src, 828),
    srcSet: GRID_WIDTHS.map((w) => `${buildSrc(src, w)} ${w}w`).join(', '),
    sizes: GRID_SIZES,
  }
}

export { itemDomain, itemHref, itemName }

/* ── Grid cell — square frame with padded media ── */

function WorkCard({
  item,
  enterIndex,
}: {
  item: WorkItem
  enterIndex: number
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  const domain = itemDomain(item)
  const meta = itemMeta(item)
  const href = itemHref(item)
  const isInternal = href === '#'
  const videoSrc = itemVideo(item)
  const src = item.imageUrl ?? undefined
  const img = optimized(src)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '0px 200px', threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [videoSrc])

  return (
    <a
      href={href}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className={`${styles.card} animate-enter`}
      style={staggerEnter(enterIndex)}
    >
      <div className={styles.square}>
        <div className={styles.preview}>
          {videoSrc ? (
            <video
              ref={videoRef}
              className={styles.media}
              data-loaded={loaded}
              muted
              loop
              playsInline
              preload="metadata"
              poster={img?.src}
              onLoadedData={() => setLoaded(true)}
            >
              <source src={videoSrc} />
            </video>
          ) : img ? (
            <img
              ref={imgRef}
              className={styles.media}
              data-loaded={loaded}
              src={img.src}
              srcSet={img.srcSet}
              sizes={img.sizes}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
            />
          ) : null}
        </div>
      </div>
      {(domain || meta) && (
        <div className={styles.meta}>
          {domain ? (
            <span className={styles.domain}>
              <span>{domain}</span>
              <DomainArrow />
            </span>
          ) : null}
          {meta ? <span className={styles.metaStack}>{meta}</span> : null}
        </div>
      )}
    </a>
  )
}

/* ── Selected work — one card every two page columns ── */

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
        Selected Work
      </p>

      <div className={styles.grid}>
        {projects.map((item, i) => (
          <WorkCard
            key={item._id}
            item={item}
            enterIndex={staggerBase + 1 + i}
          />
        ))}
      </div>
    </div>
  )
}
