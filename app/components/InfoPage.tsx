'use client'

import Link from 'next/link'
import styles from './InfoPage.module.css'
import FadeImage from './FadeImage'

const SERVICES = [
  'Web design & development',
  'Interaction design & prototyping',
  'Art direction',
  'Photography',
  'Design systems',
]

const STACK = ['Next.JS', 'Figma', 'React', 'Tailwind', 'Sanity']

const INTERESTS = [
  'Artist platform',
  'Technology & software',
  'Architecture & built environment',
  'Cultural organizations',
  'Product startups',
]

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

export default function InfoPage() {
  return (
    <main className={styles.page}>
      {/* ── Brand: always sticky at top-left ── */}
      <p className={styles.brand}>
        <Link href="/" aria-label="2u4u Studio — home">
          2u4u Studio
        </Link>
      </p>

      {/* ── Info sections ── */}
      <div className={styles.sections}>
        {/* ── Information ── */}
        <div className={styles.infoRow}>
          <div className={styles.col}>
            <p className={styles.rowLabel}>Information</p>
          </div>
          <div className={styles.col}>
            <p className={styles.subHeading}>About</p>
            <p className={styles.bodyText}>
              Benjamin Uribe is a designer, developer, and educator based in Los
              Angeles. He is the founder of 2u4u.studio and a design engineer at
              Fuser, where he builds features for the next generation of
              collaborative creative workspaces and teaches through published
              tutorials and walkthroughs.
            </p>
            <div className={styles.paraSpacer} />
            <p className={styles.bodyText}>
              He is currently completing postgraduate work in Interaction Design
              at ArtCenter College of Design. His long-term ambition is to
              return to education as a professor — to do for the next generation
              of designers what his parents did for theirs: give knowledge away
              generously, and make space for people who weren&#39;t expected to
              be in the room.
            </p>
          </div>
          <div className={styles.col}>
            <div className={styles.scopeBlock}>
              <p className={styles.scopeTitle}>Services</p>
              <p className={styles.bodyText}>{SERVICES.join(', ')}</p>
            </div>
            <div className={styles.scopeBlock}>
              <p className={styles.scopeTitle}>Stack</p>
              <p className={styles.bodyText}>{STACK.join(', ')}</p>
            </div>
            <div className={styles.scopeBlock}>
              <p className={styles.scopeTitle}>Interests</p>
              <p className={styles.bodyText}>{INTERESTS.join(', ')}</p>
            </div>
          </div>
          <div className={styles.col}>
            <p className={styles.subHeading}>Contact</p>
            <FadeImage
              src="/images/benuribe.jpg"
              alt="Benjamin Uribe"
              className={styles.colImage}
            />
            <a
              href="https://www.instagram.com/2u4u.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bodyLink}
            >
              Instagram <span className={styles.linkArrow}>↗</span>
            </a>
            <a
              href="mailto:2you4youstudio@gmail.com"
              className={styles.bodyLink}
            >
              2you4youstudio@gmail.com <span className={styles.linkArrow}>↗</span>
            </a>
          </div>
        </div>

        {/* ── Philosophy ── */}
        <div className={styles.infoRow}>
          <div className={styles.col}>
            <p className={styles.rowLabel}>Philosophy</p>
          </div>
          <div className={styles.col}>
            <FadeImage
              src="/images/family.jpg"
              alt="Family"
              className={styles.colImage}
            />
          </div>
          <div className={styles.col}>
            <p className={styles.bodyText}>
              The studio exists at the intersection of two inheritances: a
              family of educators who gave knowledge away freely, and a field
              that has historically underrepresented the communities it claims to
              design for.
            </p>
            <div className={styles.paraSpacer} />
            <p className={styles.bodyText}>
              The goal is to close that gap — not as a mission statement, but as
              a structural commitment embedded in every project, every client
              relationship, and every piece of work published under this name.
            </p>
          </div>
          <div className={styles.col}>
            <p className={styles.scopeTitle}>Principles</p>
            {PRINCIPLES.map((pr, i) => (
              <p key={pr} className={styles.bodyText}>
                <span className={styles.principleNum}>{String(i + 1).padStart(2, '0')}</span> {pr}
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
