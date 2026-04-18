'use client'

import { useEffect, useRef } from 'react'
import styles from './HomePage.module.css'
import type { Project, PhotoProject, WorkItem } from '@/sanity/types'

const STICKY_LINES = [
  'A web, interaction, and photography practice based in Los Angeles.',
  'Founded by Benjamin Uribe, the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.',
]

/**
 * Renders the brand text + all sentences as one flowing paragraph in a
 * hidden element, then uses getClientRects() to find the x-position
 * where each sentence fragment would naturally start.
 *
 * Reads font metrics from the live assembly element so the measurement
 * stays in sync with whatever CSS declares (including media queries).
 */
function measureParagraphOffsets(
  contentWidth: number,
  brandText: string,
  assemblyEl: HTMLElement,
): number[] {
  const cs = getComputedStyle(assemblyEl)

  const m = document.createElement('div')
  Object.assign(m.style, {
    position: 'absolute',
    visibility: 'hidden',
    top: '0',
    left: '0',
    width: `${contentWidth}px`,
    fontFamily: cs.fontFamily,
    fontWeight: cs.fontWeight,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    wordWrap: 'break-word',
  })

  const imgSize = parseFloat(cs.fontSize) || 32
  const imgPlaceholder =
    `<span style="display:inline-block;width:${imgSize}px;height:${imgSize}px;vertical-align:middle;"></span>`

  const line0Measured =
    'A <span style="color:#353535">web, interaction, and photography</span> practice based in <span style="color:#353535">Los Angeles</span>.'

  m.innerHTML =
    `<span data-brand>${brandText} </span>` +
    STICKY_LINES.map((line, i) => {
      let html = i === 0 ? line0Measured : line
      if (i === 1) {
        html = html.replace(
          'Benjamin Uribe,',
          `<span style="color:#353535">Benjamin Uribe</span> ${imgPlaceholder},`,
        )
      }
      return `<span data-f="${i}">${html}</span>${i < STICKY_LINES.length - 1 ? ' ' : ''}`
    }).join('')

  document.body.appendChild(m)
  const cRect = m.getBoundingClientRect()

  const offsets = STICKY_LINES.map((_, i) => {
    const span = m.querySelector(`[data-f="${i}"]`)
    if (!span) return 0
    const rects = span.getClientRects()
    if (rects.length === 0) return 0
    return Math.round(rects[0].left - cRect.left)
  })

  document.body.removeChild(m)
  return offsets
}

/* ── Project Detail Row (4-col, info-page style) ── */

function ProjectDetailRow({ project }: { project: Project }) {
  const clientName = project.clientName || project.title
  const mediumRaw = project.medium ?? ''
  const mediumLabel = mediumRaw
    ? mediumRaw.charAt(0).toUpperCase() + mediumRaw.slice(1)
    : ''
  const process = project.process ?? ''
  const stack = project.stack ?? []
  const domain = project.domain ?? ''
  const href = project.href ?? '#'

  return (
    <div className={styles.detailRow}>
      <div className={styles.detailCol}>
        <h1 className={styles.detailProjectHeading}>
          <span className={styles.detailClientName}>{clientName}</span>
          {mediumLabel && (
            <span className={styles.detailTags}>{mediumLabel}</span>
          )}
        </h1>
      </div>
      <div className={styles.detailCol}>
        {process && <p className={styles.detailBody}>{process}</p>}
      </div>
      <div className={styles.detailCol}>
        {stack.length > 0 && <p className={styles.detailBody}>{stack.join(', ')}</p>}
      </div>
      <div className={`${styles.detailCol} ${styles.detailColDomain}`}>
        {domain && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.detailDomain}
          >
            {domain}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className={styles.detailDomainArrow}
            >
              <path
                d="M3 11L11 3M11 3H4.5M11 3V9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

/* ── Project Card ── */

function ProjectCard({ project, side = 'right' }: { project: Project | null; side?: 'left' | 'right' }) {
  const title = project?.title ?? 'Untitled'
  const imageUrl = project?.imageUrl ?? null
  const href = project?.href ?? '#'

  const isLeft = side === 'left'
  const rowClass = `${styles.projectRow} ${isLeft ? styles.projectRowLeft : ''}`

  const detailsContent = (
    <div className={styles.projectMeta}>
      <p className={styles.projectProcess}>
        {project?.bio || 'Write a short bio for this project here.'}
      </p>
    </div>
  )

  return (
    <div className={rowClass} suppressHydrationWarning>
      {isLeft && <div className={styles.projectDetailsLeft}>{detailsContent}</div>}
      <a href={href} className={styles.projectImage} target="_blank" rel="noopener noreferrer">
        {imageUrl && <img src={imageUrl} alt={title} loading="lazy" />}
      </a>
      {!isLeft && <div className={styles.projectDetails}>{detailsContent}</div>}
    </div>
  )
}

/* ── Photo Detail Row ── */

function PhotoDetailRow({ photo }: { photo: PhotoProject }) {
  const title = photo.title
  const medium = photo.medium ?? 'Photo'

  return (
    <div className={styles.photoDetailRow}>
      <span className={styles.photoTriangle} aria-hidden="true" />
      <p className={styles.detailClientName}>&ldquo;{title}&rdquo;</p>
      <p className={styles.detailTags}>{medium.charAt(0).toUpperCase() + medium.slice(1)}</p>
    </div>
  )
}

/* ── Photo Card (side-by-side pair) ── */

function PhotoCard({ photo, photoIndex }: { photo: PhotoProject; photoIndex: number }) {
  const title = photo.title
  const entries = photo.imageEntries ?? []
  const urls = photo.imageUrls ?? []
  const entry1 = entries[0] ?? { url: urls[0] ?? null, wide: false }
  const entry2 = entries[1] ?? { url: urls[1] ?? null, wide: false }

  const hasMix = entry1.wide !== entry2.wide
  const swap = hasMix && photoIndex % 2 === 1
  const first = swap ? entry2 : entry1
  const second = swap ? entry1 : entry2

  return (
    <div className={styles.photoRow}>
      {first.url && (
        <div className={`${styles.photoImage} ${first.wide ? styles.photoImageWide : styles.photoImageStandard}`}>
          <img src={first.url} alt={`${title} — 1`} loading="lazy" />
        </div>
      )}
      {second.url && (
        <div className={`${styles.photoImage} ${second.wide ? styles.photoImageWide : styles.photoImageStandard}`}>
          <img src={second.url} alt={`${title} — 2`} loading="lazy" />
        </div>
      )}
    </div>
  )
}

/* ── Main HomePage ── */

export default function HomePage({ projects }: { projects: WorkItem[] }) {
  const pageRef = useRef<HTMLElement>(null)
  const brandRef = useRef<HTMLParagraphElement>(null)
  const assemblyRef = useRef<HTMLDivElement>(null)
  const spanRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ]
  const floatRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]
  const endSpacerRef = useRef<HTMLDivElement>(null)
  const bgFillRef = useRef<HTMLDivElement>(null)
  const firstContentRef = useRef<HTMLDivElement>(null)

  // Measure paragraph-flow offsets, set text-indent on floats,
  // position assembly sticky top, and set float sticky tops
  // to match where each span sits inside the assembly.
  useEffect(() => {
    const pageEl = pageRef.current
    const assemblyEl = assemblyRef.current
    if (!pageEl || !assemblyEl) return

    async function init() {
      try { await document.fonts.ready } catch {}
      measure()
    }

    function measure() {
      const assemblyWidth = assemblyEl!.clientWidth

      const brandText = brandRef.current?.textContent ?? '2u4u Studio.'
      const offsets = measureParagraphOffsets(assemblyWidth, brandText, assemblyEl!)

      floatRefs.forEach((ref, i) => {
        const el = ref.current
        if (!el) return
        el.style.textIndent = `${offsets[i]}px`
      })

      // The assembly includes an invisible brand prefix, so its
      // sticky top should match where the brand text starts.
      const brandStyle = getComputedStyle(brandRef.current!)
      const brandStickyTop = parseFloat(brandStyle.top) || 20
      const brandPaddingTop = parseFloat(brandStyle.paddingTop) || 20
      const assemblyTop = brandStickyTop + brandPaddingTop
      assemblyEl!.style.top = `${assemblyTop}px`

      // Set each float's sticky top to match the y-position
      // of its corresponding span inside the assembly.
      const aRect = assemblyEl!.getBoundingClientRect()
      spanRefs.forEach((sRef, i) => {
        const span = sRef.current
        const floatEl = floatRefs[i].current
        if (!span || !floatEl) return
        const sRects = span.getClientRects()
        if (sRects.length === 0) return
        const spanY = sRects[0].top - aRect.top
        floatEl.style.top = `${assemblyTop + spanY}px`
      })
    }

    init()
    const ro = new ResizeObserver(measure)
    ro.observe(pageEl)
    return () => ro.disconnect()
  }, [])

  // Swap: when a float is stuck (reached its sticky top),
  // hide it and show the assembly span. Reverse on scroll up.
  useEffect(() => {
    function check() {
      floatRefs.forEach((ref, i) => {
        const floatEl = ref.current
        const spanEl = spanRefs[i].current
        if (!floatEl || !spanEl) return

        const stickyTop = parseFloat(floatEl.style.top || '0')
        const currentTop = floatEl.getBoundingClientRect().top
        const isStuck = currentTop <= stickyTop + 1

        if (isStuck) {
          if (!floatEl.classList.contains(styles.floatHidden)) {
            floatEl.classList.add(styles.floatHidden)
            spanEl.classList.add(styles.assemblySpanVisible)
          }
        } else {
          if (floatEl.classList.contains(styles.floatHidden)) {
            floatEl.classList.remove(styles.floatHidden)
            spanEl.classList.remove(styles.assemblySpanVisible)
          }
        }
      })
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        check()
        ticking = false
      })
    }

    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smoothly fade the sticky assembly/floats as they approach
  // project content, and fade back in at the page bottom.
  // Uses a distance-based opacity ramp instead of a hard toggle.
  useEffect(() => {
    const FADE_ZONE = 120

    let ticking = false
    const update = () => {
      const firstContent = firstContentRef.current
      const pageEl = pageRef.current
      if (!firstContent || !pageEl) return

      const lastFloat = floatRefs[floatRefs.length - 1].current
      const floatStickyTop = lastFloat ? parseFloat(lastFloat.style.top || '0') : 0
      const floatHeight = lastFloat?.offsetHeight || 0
      const assemblyBottom = floatStickyTop + floatHeight

      const firstRect = firstContent.getBoundingClientRect()
      const distance = firstRect.top - assemblyBottom

      let atBottom = false
      const spacer = endSpacerRef.current
      if (spacer) {
        const rect = spacer.getBoundingClientRect()
        const vh = window.innerHeight
        atBottom = rect.top < vh * 0.5
      }

      let opacity: number
      if (atBottom) {
        opacity = 1
      } else if (distance >= FADE_ZONE) {
        opacity = 1
      } else if (distance <= 0) {
        opacity = 0
      } else {
        opacity = distance / FADE_ZONE
      }

      pageEl.style.setProperty('--text-fade', String(opacity))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  // End-of-page background fade: opacity 1 when the end spacer has
  // fully scrolled into view (top at viewport top); fades to 0 as the
  // user scrolls upward out of the spacer region.
  useEffect(() => {
    let ticking = false
    const update = () => {
      const spacer = endSpacerRef.current
      const bg = bgFillRef.current
      if (!spacer || !bg) return
      const rect = spacer.getBoundingClientRect()
      const vh = window.innerHeight
      const opacity = Math.max(0, Math.min(1, 1 - rect.top / vh))
      bg.style.opacity = String(opacity)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <main
      ref={pageRef}
      className={styles.page}
      suppressHydrationWarning
    >
      {/* ── Brand: always sticky at top-left ── */}
      <p ref={brandRef} className={styles.brand}>
        2u4u Studio.
      </p>

      {/* ── Assembly paragraph: sticky merged view ── */}
      <div ref={assemblyRef} className={styles.assembly}>
        <span className={styles.assemblyBrandPrefix} aria-hidden="true">
          2u4u Studio.{' '}
        </span>
        <span ref={spanRefs[0]} className={styles.assemblySpan}>
          A{' '}
          <span className={styles.assemblyMuted}>
            web, interaction, and photography
          </span>{' '}
          practice based in{' '}
          <span className={styles.assemblyMuted}>Los Angeles</span>.{' '}
        </span>
        <span ref={spanRefs[1]} className={styles.assemblySpan}>
          Founded by{' '}
          <span className={styles.assemblyMuted}>Benjamin Uribe</span>{' '}
          <img src="/images/benuribe.jpg" alt="Benjamin Uribe" className={styles.profilePic} />
          {', the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.'}
        </span>
      </div>

      {/* ── Sentence 1: sticks at its paragraph position ── */}
      <div ref={floatRefs[0]} className={styles.float}>
        A{' '}
        <span className={styles.assemblyMuted}>
          web, interaction, and photography
        </span>{' '}
        practice based in{' '}
        <span className={styles.assemblyMuted}>Los Angeles</span>.
      </div>

      {/* ── Sentence 2: sticks at its paragraph position ── */}
      <div ref={floatRefs[1]} className={styles.float}>
        Founded by{' '}
        <span className={styles.assemblyMuted}>Benjamin Uribe</span>{' '}
        <img src="/images/benuribe.jpg" alt="Benjamin Uribe" className={styles.profilePic} />
        {', the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.'}
      </div>

      {/* ── Work: detail row + image card per project ── */}
      {(() => {
        let webIndex = 0
        let photoIndex = 0
        return projects.map((item, i) => {
          const isPhoto = item._type === 'photoProject'
          const currentWebIndex = webIndex
          const currentPhotoIndex = photoIndex
          if (isPhoto) photoIndex++
          else webIndex++

          return (
            <div
              key={item._id}
              ref={i === 0 ? firstContentRef : undefined}
              className={i === 0 ? styles.contentSection : styles.projectRowSpacing}
            >
              {isPhoto ? (
                <>
                  <div className={styles.photoDetailGrid}>
                    <div className={styles.photoDetailCol}>
                      <PhotoDetailRow photo={item as PhotoProject} />
                    </div>
                  </div>
                  <PhotoCard photo={item as PhotoProject} photoIndex={currentPhotoIndex} />
                </>
              ) : (
                <>
                  <ProjectDetailRow project={item as Project} />
                  <ProjectCard project={item as Project} side={currentWebIndex % 2 === 0 ? 'right' : 'left'} />
                </>
              )}
            </div>
          )
        })
      })()}

      {/* ── End-of-work breathing room: full empty viewport before footer ── */}
      <div ref={endSpacerRef} className={styles.endSpacer} aria-hidden="true" />

      {/* ── Fixed background image revealed when the end spacer is in view ── */}
      <div ref={bgFillRef} className={styles.bgFill} aria-hidden="true" />

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
    </main>
  )
}
