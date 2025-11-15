import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Breadcrumb STUDIO</h1>
          <div className={styles.description}>
            <p className={styles.abbreviation}>BC–S</p>
            <p className={styles.text}>
              is an independent digital, creative, and web studio based in Los Angeles.
            </p>
          </div>
        </div>
        <nav className={styles.navigation}>
          <a href="mailto:breadcrumb.la@gmail.com" className={styles.navLink}>Contact</a>
          <a href="https://www.instagram.com/studio.breadcrumb?igsh=YzBkMWMxajNtd3E4&utm_source=qr" className={styles.navLink} target="_blank" rel="noopener noreferrer">Work</a>
        </nav>
      </div>
    </div>
  )
}

