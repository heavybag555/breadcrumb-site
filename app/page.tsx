import { Inter } from "next/font/google";
import styles from "./page.module.css";
import AnimatedText from "./components/AnimatedText";
import WhatWeDo from "./components/WhatWeDo";

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
            <AnimatedText delay={0} stagger={0.06}>
              Breadcrumb Studio
            </AnimatedText>
          </a>
          <img
            className={styles.portrait}
            src="/images/me.jpg"
            alt="Portrait"
          />
        </div>

        <div className={styles.taglineGroup}>
          <span className={styles.tagline}>
            <AnimatedText
              className={styles.desktopTagline}
              delay={0.3}
              stagger={0.05}
            >
              Web, Photo, and Interaction Studio based in Los Angeles, CA.
            </AnimatedText>
            <AnimatedText
              className={styles.mobileTagline}
              delay={0.3}
              stagger={0.05}
            >
              Web, Photo, and Interaction Studio based in LA.
            </AnimatedText>
          </span>
          <div className={styles.whatWeDoDesktop}>
            <WhatWeDo />
          </div>
        </div>

        <div className={styles.contact}>
          <span className={styles.reachLabel}>
            <AnimatedText delay={1.1} stagger={0.05}>
              Reach:
            </AnimatedText>
          </span>
          <div className={styles.buttonGroup}>
            <a
              className={styles.workLink}
              href="https://www.instagram.com/studio.breadcrumb?igsh=YzBkMWMxajNtd3E4&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AnimatedText delay={0.8} stagger={0.04}>
                Our work
              </AnimatedText>
            </a>
            <a className={styles.email} href="mailto:breadcrumb.la@gmail.com">
              <AnimatedText delay={1.3} stagger={0.03}>
                breadcrumb.la@gmail.com
              </AnimatedText>
            </a>
          </div>
        </div>

        <div className={styles.whatWeDoMobile}>
          <WhatWeDo />
        </div>
      </div>
    </main>
  );
}
