import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Nuvany David
          </span>
        </div>
        <div className={styles.right}>
          <a href="mailto:hello@nuvanydavid.com" className={styles.link}>
            Email
          </a>
          <a
            href="https://www.instagram.com/nuvanydavid/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
