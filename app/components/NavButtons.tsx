'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

type NavItem = { href: string; label: string }

/**
 * Renders the three main header buttons with a sliding pill indicator
 * that animates horizontally between them — both on hover and whenever
 * the active route changes (so navigating between pages slides the pill
 * to the new active button with a bouncy ease).
 *
 * Button visual styles are owned by the caller via the `styles` map;
 * this component only adds the `navButtons` wrapper + `navIndicator` span.
 */
export default function NavButtons({
  items,
  activeHref,
  styles,
}: {
  items: NavItem[]
  activeHref: string
  styles: Record<string, string>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const btnRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const didInitRef = useRef(false)

  const activeIndex = (() => {
    if (!activeHref) return -1
    const i = items.findIndex((it) => it.href === activeHref)
    return i >= 0 ? i : -1
  })()

  const moveTo = (target: HTMLElement | null, animate: boolean) => {
    const ind = indicatorRef.current
    const cont = containerRef.current
    if (!ind || !cont || !target) return
    const cRect = cont.getBoundingClientRect()
    const tRect = target.getBoundingClientRect()
    const x = tRect.left - cRect.left
    const y = tRect.top - cRect.top
    if (!animate) {
      const prev = ind.style.transition
      ind.style.transition = 'none'
      ind.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ind.style.width = `${tRect.width}px`
      ind.style.height = `${tRect.height}px`
      // Force reflow so the next transition takes effect cleanly.
      void ind.offsetWidth
      ind.style.transition = prev
    } else {
      ind.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ind.style.width = `${tRect.width}px`
      ind.style.height = `${tRect.height}px`
    }
    ind.style.opacity = '1'
  }

  const snapToActive = (animate: boolean) => {
    if (activeIndex < 0) {
      const ind = indicatorRef.current
      if (ind) ind.style.opacity = '0'
      return
    }
    const el = btnRefs.current[activeIndex]
    if (el) moveTo(el, animate)
  }

  useEffect(() => {
    snapToActive(didInitRef.current)
    didInitRef.current = true

    const onResize = () => snapToActive(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref])

  return (
    <div
      ref={containerRef}
      className={styles.navButtons}
      onMouseLeave={() => snapToActive(true)}
    >
      <span
        ref={indicatorRef}
        className={styles.navIndicator}
        aria-hidden="true"
      />
      {items.map((item, i) => {
        const isActive = i === activeIndex
        return (
          <Link
            key={item.href}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            href={item.href}
            className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`}
            onMouseEnter={(e) => moveTo(e.currentTarget, true)}
            onFocus={(e) => moveTo(e.currentTarget, true)}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
