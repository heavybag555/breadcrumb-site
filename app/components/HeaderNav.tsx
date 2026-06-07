'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import NavButtons from './NavButtons'
import styles from './HeaderNav.module.css'

const ITEMS = [
  { href: '/#work', label: 'Work' },
  { href: '/info', label: 'Info' },
  { href: '/resources', label: 'Resources' },
  { href: '/writing', label: 'Writing' },
]

export default function HeaderNav() {
  const pathname = usePathname() || '/'
  const [navVisible, setNavVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

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

  // Close mobile overlay on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while overlay is open + close on Escape
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false)
      }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const activeHref = (() => {
    if (pathname === '/') return '/#work'
    const match = ITEMS.find(
      (i) => !i.href.startsWith('/#') && pathname.startsWith(i.href),
    )
    return match?.href ?? '/#work'
  })()

  const closeMobile = useCallback(() => setMenuOpen(false), [])

  // Homepage hero owns its own centered nav (reference structure),
  // so the global fixed header is suppressed on '/'.
  if (pathname === '/') return null

  return (
    <>
      <div
        className={`${styles.navOverlay} ${navVisible || menuOpen ? '' : styles.navHidden}`}
      >
        <nav className={styles.nav}>
          {/* Desktop: inline buttons + CTA (hidden ≤900px) */}
          <div className={styles.desktopNav}>
            <NavButtons styles={styles} activeHref={activeHref} items={ITEMS} />
            <a
              href="mailto:2you4youstudio@gmail.com"
              className={styles.ctaLink}
            >
              Connect
              <svg
                className={styles.ctaArrow}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
          </div>

          {/* Mobile: plus / xmark toggle (shown ≤900px) */}
          <button
            className={`${styles.mobileToggle} ${menuOpen ? styles.mobileToggleOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg
              className={styles.toggleIconPlus}
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4.5V15.5M4.5 10H15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className={styles.toggleIconXmark}
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile fullscreen overlay */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.mobileLink} ${activeHref === item.href ? styles.mobileLinkActive : ''}`}
            onClick={closeMobile}
          >
            {item.label}
          </Link>
        ))}
        <a
          href="mailto:2you4youstudio@gmail.com"
          className={`${styles.mobileLink} ${styles.mobileLinkConnect}`}
          onClick={closeMobile}
        >
          Connect
          <svg
            className={styles.ctaArrow}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
      </div>
    </>
  )
}
