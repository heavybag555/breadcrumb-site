'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import NavButtons from './NavButtons'
import styles from './HeaderNav.module.css'

const ITEMS = [
  { href: '/', label: 'Work' },
  { href: '/info', label: 'Info' },
  { href: '/resources', label: 'Resources' },
  { href: '/writing', label: 'Writing' },
]

export default function HeaderNav() {
  const pathname = usePathname() || '/'
  const [navVisible, setNavVisible] = useState(true)
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

  const activeHref = (() => {
    if (pathname === '/') return '/'
    const match = ITEMS.find((i) => i.href !== '/' && pathname.startsWith(i.href))
    return match?.href ?? '/'
  })()

  return (
    <div
      className={`${styles.navOverlay} ${navVisible ? '' : styles.navHidden}`}
    >
      <nav className={styles.nav}>
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
      </nav>
    </div>
  )
}
