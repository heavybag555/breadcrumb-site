'use client'

import { useEffect, useState } from 'react'
import styles from './HomePage.module.css'
import { staggerEnter } from '@/app/lib/staggerEnter'
import WorkIndex from './WorkIndex'
import type { Resource, ResourcesByCategory, WorkItem } from '@/sanity/types'

const SERVICES = [
  'Web design & development',
  'Interaction design & prototyping',
  'Art direction',
  'Photography',
  'Design systems',
]

type ActivePanel = 'info' | 'resources' | null

function ServiceItem({ service }: { service: string }) {
  const parts = service.split(' & ')
  if (parts.length < 2) return <>{service}</>

  return (
    <>
      {parts[0]}
      <br />
      {parts.slice(1).join(' ')}
    </>
  )
}

function HeroExternalArrow() {
  return (
    <svg
      className={styles.heroNavArrow}
      width="10"
      height="10"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DirectoryToggle({
  label,
  isOpen,
  onClick,
}: {
  label: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={styles.heroNavLink}
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <span className={styles.toggleStack}>
        <span
          className={`${styles.toggleWord} ${
            isOpen ? styles.toggleWordHidden : ''
          }`}
        >
          {label}
        </span>
        <span
          className={`${styles.toggleWord} ${
            isOpen ? '' : styles.toggleWordHidden
          }`}
        >
          Close
        </span>
      </span>
    </button>
  )
}

function ResourceLink({ resource }: { resource: Resource }) {
  const preview = resource.previewImage

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.resourceLink}
    >
      <span className={styles.resourceLinkThumb} aria-hidden="true">
        {preview ? (
          <img src={preview} alt="" loading="lazy" />
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 1.5H6.5L9.5 4.5V10.5H2.5V1.5Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 1.5V4.5H9.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.resourceLinkLabel} title={resource.label}>
        {resource.label}
      </span>
    </a>
  )
}

function formatPstTime(): string {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
  return `${time} PST`
}

function FooterTime({ stagger }: { stagger: number }) {
  const [time, setTime] = useState(formatPstTime)

  useEffect(() => {
    const id = setInterval(() => setTime(formatPstTime()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <p
      className={`${styles.footerTime} animate-enter`}
      style={staggerEnter(stagger)}
    >
      {time}
    </p>
  )
}

/* ── Main HomePage ── */

export default function HomePage({
  projects,
  resources,
}: {
  projects: WorkItem[]
  resources: ResourcesByCategory
}) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const infoOpen = activePanel === 'info'
  const resourcesOpen = activePanel === 'resources'

  const resourceSections = [
    { title: 'Learning', items: resources.learning },
    { title: 'Reading', items: resources.reading },
    { title: 'Watching', items: resources.watching },
  ] as const

  const workStaggerBase = 10
  const footerStaggerBase = workStaggerBase + 1 + projects.length

  return (
    <main className={styles.page}>
      {/* ── Info reveal — column 3, pushes the whole page down ── */}
      <div
        className={`${styles.panelReveal} ${styles.panelRevealCol3} ${
          infoOpen ? styles.panelRevealOpen : ''
        }`}
      >
        <div className={styles.panelRevealInner}>
          <section className={styles.infoBlock}>
            <h2 className={styles.infoBlockTitle}>Information</h2>
            <p className={styles.infoText}>
              Benjamin Uribe is a designer, developer, and educator based in Los
              Angeles. He is the founder of 2u4u.studio, working across concept,
              design, and development for clients in art, culture, and commerce.
            </p>
            <p className={styles.infoText}>
              He is currently completing postgraduate work in Interaction Design
              at ArtCenter College of Design, with a focus on building thoughtful
              digital experiences and sharing what he learns along the way.
            </p>
          </section>
          <section className={styles.infoBlock}>
            <h2 className={styles.infoBlockTitle}>Services</h2>
            <ul className={styles.infoList}>
              {SERVICES.map((service) => (
                <li key={service}>
                  <ServiceItem service={service} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ── Resources reveal — column 4, pushes the whole page down ── */}
      <div
        className={`${styles.panelReveal} ${styles.panelRevealCol4} ${
          resourcesOpen ? styles.panelRevealOpen : ''
        }`}
      >
        <div className={styles.panelRevealInner}>
          {resourceSections.map(({ title, items }) => (
            <section key={title} className={styles.infoBlock}>
              <h2 className={styles.infoBlockTitle}>{title}</h2>
              {items.length > 0 ? (
                <ul className={styles.resourceList}>
                  {items.map((resource) => (
                    <li key={resource._id}>
                      <ResourceLink resource={resource} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.infoText}>—</p>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* ── Hero: centered identity block (structure after bureaunicolasleuliet.com) ── */}
      <section className={styles.hero}>
        <div className={styles.heroNavColStack}>
          <div
            className={`${styles.heroNavCol} ${styles.heroNavCol3} animate-enter`}
            style={staggerEnter(1)}
          >
            <DirectoryToggle
              label="Information"
              isOpen={activePanel === 'info'}
              onClick={() =>
                setActivePanel((p) => (p === 'info' ? null : 'info'))
              }
            />
          </div>
          <div
            className={`${styles.heroNavCol} ${styles.heroNavCol4} animate-enter`}
            style={staggerEnter(2)}
          >
            <DirectoryToggle
              label="Resources"
              isOpen={activePanel === 'resources'}
              onClick={() =>
                setActivePanel((p) => (p === 'resources' ? null : 'resources'))
              }
            />
          </div>
        </div>
        <div className={`${styles.heroNavCol} ${styles.heroNavCol6}`}>
          <nav className={styles.heroNav}>
            <a
              href="mailto:2you4youstudio@gmail.com"
              className={`${styles.heroNavLink} ${styles.heroNavExternal} animate-enter`}
              style={staggerEnter(3)}
            >
              Email
              <HeroExternalArrow />
            </a>
            <a
              href="https://www.instagram.com/2u4u.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroNavLink} ${styles.heroNavExternal} animate-enter`}
              style={staggerEnter(4)}
            >
              Instagram
              <HeroExternalArrow />
            </a>
            <a
              href="https://www.are.na/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroNavLink} ${styles.heroNavExternal} animate-enter`}
              style={staggerEnter(5)}
            >
              Are.na
              <HeroExternalArrow />
            </a>
          </nav>
        </div>

        <div className={styles.heroCenter}>
          <h1
            className={`${styles.heroBrand} animate-enter`}
            style={staggerEnter(6)}
          >
            2u4u Studio
          </h1>
          <p
            className={`${styles.heroText} animate-enter`}
            style={staggerEnter(7)}
          >
            Design, development, and image studio in Los Angeles.
          </p>
          <p
            className={`${styles.heroTextBody} animate-enter`}
            style={staggerEnter(8)}
          >
            Latest:{' '}
            <a
              href="https://daniel-derro.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroDomain}
            >
              daniel-derro.com
            </a>
          </p>
        </div>
      </section>

      {/* ── Work: index list with morphing hover preview ── */}
      <div id="work" className={styles.contentSection}>
        <WorkIndex projects={projects} staggerBase={workStaggerBase} />
      </div>

      {/* ── Footer: centered CTA + bottom-left copyright (structure after reference) ── */}
      <footer className={styles.footer}>
        <div className={styles.footerCol}>
          <div className={styles.footerCenter}>
            <div className={styles.footerPrimary}>
              <p
                className={`${styles.footerCta} animate-enter`}
                style={staggerEnter(footerStaggerBase)}
              >
                Got a project, idea or collaboration in mind?
              </p>
              <p
                className={`${styles.footerContact} animate-enter`}
                style={staggerEnter(footerStaggerBase + 1)}
              >
                Contact me directly via{' '}
                <a
                  href="mailto:2you4youstudio@gmail.com"
                  className={styles.footerEmail}
                >
                  2you4youstudio@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footerMetaCol}>
          <p
            className={`${styles.footerLocation} animate-enter`}
            style={staggerEnter(footerStaggerBase + 2)}
          >
            Los Angeles, California, USA
          </p>
          <FooterTime stagger={footerStaggerBase + 3} />
        </div>
      </footer>
    </main>
  )
}
