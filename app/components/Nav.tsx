'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return

    let loaded = false
    const run = async () => {
      if (loaded) return
      loaded = true
      const { animate } = await import('animejs')
      animate(el, {
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 800,
        easing: 'easeOutCubic',
      })
    }
    run()
  }, [])

  return (
    <nav ref={navRef} className={styles.nav}>
      <Link href="/" className={styles.siteName}>Nuvany David</Link>
      <div className={styles.navLinks}>
        <a href="mailto:hello@nuvanydavid.com" className={styles.navLink}>
          hello@nuvanydavid.com
        </a>
      </div>
    </nav>
  )
}
