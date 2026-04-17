'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { animate, stagger } from 'animejs'
import styles from './HomePage.module.css'
import type { Project } from '@/sanity/types'

const STICKY_LINES = [
  'A one-person web, interaction, and photography practice based in Los Angeles.',
  'Founded by Benjamin Uribe, the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.',
]

const SERVICES = [
  'Web design & development',
  'Interaction design & prototyping',
  'Art direction',
  'Photography',
  'Design systems',
]

const INTEREST = [
  'Artist platform',
  'Technology & software',
  'Architecture & built environment',
  'Cultural organizations',
  'Product startups',
]

const STACK = ['Next.JS', 'Figma', 'React', 'Tailwind', 'Sanity']

const PRINCIPLES = [
  'Every project is a case study.',
  'Coherence is a competitive advantage.',
  'Ship something real before you call it a prototype.',
  'The work should be traceable back to a decision, not a preference.',
  'Quality is structural, not cosmetic.',
  'Get close to the material — code is clay.',
  "Urgency isn't always useful. Pause, think, then act.",
  "Knowledge is most meaningful when it's given away.",
  'Treat the end product as your own.',
  'The community is the client too.',
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

  m.innerHTML =
    `<span data-brand>${brandText} </span>` +
    STICKY_LINES.map((line, i) => {
      let html = line
      if (i === 1) {
        html = line.replace(
          'Benjamin Uribe,',
          `Benjamin Uribe ${imgPlaceholder},`,
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

/* ── Intersection-observer reveal hook ── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.revealVisible)
          animate(el, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            ease: 'outCubic',
          })
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

/* ── Staggered children reveal ── */

function useStaggerReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(el.children, {
            opacity: [0, 1],
            translateY: [12, 0],
            delay: stagger(60),
            duration: 500,
            ease: 'outCubic',
          })
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

/* ── Project Card ── */

function ProjectCard({
  project,
  className,
}: {
  project: Project | null
  className: string
}) {
  const ref = useReveal()
  const title = project?.title ?? 'Untitled'
  const subtitle = project?.subtitle ?? ''
  const imageUrl = project?.imageUrl ?? null
  const tags = project?.tags ?? []
  const href = project?.href ?? '#'

  return (
    <div ref={ref} className={`${className} ${styles.reveal}`} suppressHydrationWarning>
      <div className={styles.projectMeta}>
        <p className={styles.projectTitle}>{title}</p>
        {subtitle && <p className={styles.projectSubtitle}>{subtitle}</p>}
      </div>
      <a href={href} className={styles.projectImage}>
        {imageUrl && <img src={imageUrl} alt={title} loading="lazy" />}
      </a>
      {tags.length > 0 && (
        <div className={styles.projectTags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main HomePage ── */

export default function HomePage({ projects }: { projects: Project[] }) {
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

  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  const servicesRef = useStaggerReveal()
  const interestRef = useStaggerReveal()
  const stackRef = useStaggerReveal()
  const interest2Ref = useStaggerReveal()
  const principlesRef = useStaggerReveal()

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

      const brandText = brandRef.current?.textContent ?? '2u4u Studio'
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

  // Nav show/hide on scroll direction
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 100) {
          setNavVisible(true)
        } else {
          setNavVisible(y < lastScrollY.current)
        }
        lastScrollY.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const p = useCallback(
    (i: number): Project | null => projects[i] ?? null,
    [projects],
  )

  return (
    <main ref={pageRef} className={styles.page} suppressHydrationWarning>
      {/* ── Brand: always sticky at top-left ── */}
      <p ref={brandRef} className={styles.brand}>
        2u4u Studio
      </p>

      {/* ── Nav overlay: fixed, transparent, show/hide ── */}
      <div
        className={`${styles.navOverlay} ${navVisible ? '' : styles.navHidden}`}
      >
        <nav className={styles.nav}>
          <a href="/" className={`${styles.navBtn} ${styles.navBtnActive}`}>
            Work
          </a>
          <a href="/info" className={styles.navBtn}>
            Info
          </a>
          <a href="/writing" className={styles.navBtn}>
            Writing
          </a>
        </nav>
        <div className={styles.ctaCol}>
          <a href="mailto:2you4youstudio@gmail.com" className={styles.ctaBtn}>
            Get in touch
          </a>
        </div>
      </div>

      {/* ── Assembly paragraph: sticky merged view ── */}
      <div ref={assemblyRef} className={styles.assembly}>
        <span className={styles.assemblyBrandPrefix} aria-hidden="true">
          2u4u Studio{' '}
        </span>
        <span ref={spanRefs[0]} className={styles.assemblySpan}>
          {STICKY_LINES[0]}{' '}
        </span>
        <span ref={spanRefs[1]} className={styles.assemblySpan}>
          {'Founded by Benjamin Uribe '}
          <img src="/images/benuribe.jpg" alt="Benjamin Uribe" className={styles.profilePic} />
          {', the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.'}
        </span>
      </div>

      {/* ── Sentence 1: sticks at its paragraph position ── */}
      <div ref={floatRefs[0]} className={styles.float}>
        {STICKY_LINES[0]}
      </div>

      {/* ── Sentence 2: sticks at its paragraph position ── */}
      <div ref={floatRefs[1]} className={styles.float}>
        {'Founded by Benjamin Uribe '}
        <img src="/images/benuribe.jpg" alt="Benjamin Uribe" className={styles.profilePic} />
        {', the studio works across development, design, art direction, and photography — under one roof, one voice, one standard of care.'}
      </div>

      {/* ── Recent Work (row 1: large left + small right) ── */}
      <section className={styles.contentSection}>
        <p className={styles.sectionLabel}>Recent Work</p>
        <div className={styles.projectRow}>
          <ProjectCard project={p(0)} className={styles.projectCardLarge} />
          <ProjectCard project={p(1)} className={styles.projectCardSmall} />
        </div>
      </section>

      {/* ── Services / Interest panel ── */}
      <div className={`${styles.infoPanel} ${styles.contentSection}`}>
        <div className={styles.infoColumn}>
          <p className={styles.infoLabel}>Services</p>
          <div ref={servicesRef} className={styles.infoList}>
            {SERVICES.map((s) => (
              <p key={s} style={{ opacity: 0 }}>
                {s}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.infoColumn}>
          <p className={styles.infoLabel}>Interest</p>
          <div ref={interestRef} className={styles.infoList}>
            {INTEREST.map((s) => (
              <p key={s} style={{ opacity: 0 }}>
                {s}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects row 2: small left + large right ── */}
      <div className={`${styles.projectRow} ${styles.contentSection}`}>
        <ProjectCard project={p(2)} className={styles.projectCardSmallLeft} />
        <ProjectCard project={p(3)} className={styles.projectCardLargeRight} />
      </div>

      {/* ── Principles block ── */}
      <div className={`${styles.principlesWrap} ${styles.contentSection}`}>
        <div className={styles.principles}>
          <div className={styles.principlesInner}>
            <p className={styles.principlesLabel}>Principles</p>
            <div ref={principlesRef} className={styles.principlesList}>
              {PRINCIPLES.map((pr) => (
                <p key={pr} style={{ opacity: 0 }}>
                  <span className={styles.dash}>––</span>
                  {pr}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Projects row 3: three equal columns ── */}
      <div className={`${styles.projectRow} ${styles.contentSection}`}>
        <ProjectCard project={p(4)} className={styles.projectCardThird} />
        <ProjectCard project={p(5)} className={styles.projectCardThird} />
        <ProjectCard project={p(6)} className={styles.projectCardThird} />
      </div>

      {/* ── Stack / Interest panel ── */}
      <div className={`${styles.infoPanel} ${styles.contentSection}`}>
        <div className={styles.infoColumn}>
          <p className={styles.infoLabel}>Stack</p>
          <div ref={stackRef} className={styles.infoList}>
            {STACK.map((s) => (
              <p key={s} style={{ opacity: 0 }}>
                {s}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.infoColumn}>
          <p className={styles.infoLabel}>Interest</p>
          <div ref={interest2Ref} className={styles.infoList}>
            {INTEREST.map((s) => (
              <p key={s} style={{ opacity: 0 }}>
                {s}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={`${styles.footer} ${styles.contentSection}`}>
        <div className={styles.footerCol}>
          <a href="/" className={styles.footerLink}>
            2u4u.studio
          </a>
          <a
            href="https://www.instagram.com/2u4u.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Instagram
          </a>
          <a
            href="mailto:2you4youstudio@gmail.com"
            className={styles.footerLink}
          >
            2you4youstudio@gmail.com
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
