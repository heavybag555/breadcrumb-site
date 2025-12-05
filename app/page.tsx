import { Inter } from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <main className={`${inter.className} ${styles.page}`}>
      <div className={styles.navRow}>
        <div className={styles.brandWrap}>
          <a className={styles.brand} href="/">
            Breadcrumb Studio
          </a>
          <img
            className={styles.portrait}
            src="/images/me.jpg"
            alt="Portrait"
          />
        </div>

        <div className={styles.taglineGroup}>
          <span className={styles.tagline}>
            Web, Photo, and Interaction Studio based in Los Angeles, CA.
          </span>
          <a
            className={styles.workLink}
            href="https://www.instagram.com/studio.breadcrumb?igsh=YzBkMWMxajNtd3E4&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            [View our work]
          </a>
        </div>

        <div className={styles.contact}>
          <span className={styles.reachLabel}>Reach:</span>
          <a className={styles.email} href="mailto:breadcrumb.la@gmail.com">
            breadcrumb.la@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
