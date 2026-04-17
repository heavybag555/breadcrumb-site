'use client'

import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.siteName}>Nuvany David</Link>
      <div className={styles.navLinks}>
        <a href="mailto:hello@nuvanydavid.com" className={styles.navLink}>
          hello@nuvanydavid.com
        </a>
      </div>
    </nav>
  )
}
