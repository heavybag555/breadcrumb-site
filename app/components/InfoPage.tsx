'use client'

import styles from './InfoPage.module.css'

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
      <p className={styles.brand}>2u4u Studio</p>

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
              He grew up in San Jacinto, California — the child of two
              teachers — and spent his after-school hours in a computer lab long
              after the last bell rang. That restlessness became a practice.
              Today it looks like a studio that spans web development,
              interaction design, art direction, and photography, operating at
              the intersection of technical precision and editorial craft.
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
            <img
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
            <p className={styles.subHeading}>
              The studio operates on a few fixed beliefs.
            </p>
            <p className={styles.bodyText}>
              Design is most useful when it&#39;s closest to the build. A
              deployment link with functional interactions communicates more than
              a mid-fidelity frame sitting in a Figma canvas. The translator
              designer — one who moves between taste and implementation — is the
              most valuable person in the room right now.
            </p>
          </div>
          <div className={styles.col}>
            <p className={styles.bodyText}>
              Quality is not a finishing pass. It&#39;s a structural decision
              made at the start, protected throughout, and visible in the
              outcome. Small studios win on coherence. Every project here is
              treated as if the studio&#39;s name depends on it — because it
              does.
            </p>
            <div className={styles.paraSpacer} />
            <p className={styles.bodyText}>
              The work should return something. Not just to clients, but to the
              communities that don&#39;t always see themselves reflected in what
              gets built. That&#39;s not a mission statement. It&#39;s just
              home.
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

        {/* ── Contribution to Humanity ── */}
        <div className={styles.infoRow}>
          <div className={styles.col}>
            <p className={styles.rowLabel}>Contribution to Humanity</p>
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
            <p className={styles.subHeading}>
              What that looks like in practice:
            </p>
            <p className={styles.bodyText}>
              Designing tools and experiences with underrepresented communities
              as primary users, not edge cases. Building in public so that other
              designers from similar backgrounds can see what&#39;s possible and
              find a model to follow. Returning to education as a professor —
              formally, eventually — so that the next generation of designers
              from communities like Hemet, California has someone a few steps
              ahead who is willing to have a real conversation.
            </p>
          </div>
          <div className={styles.col}>
            <img
              src="/images/family.jpg"
              alt="Family"
              className={styles.colImage}
            />
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
