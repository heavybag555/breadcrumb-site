'use client'

import { useEffect, useState } from 'react'
import styles from './HomePage.module.css'
import { staggerEnter } from '@/app/lib/staggerEnter'
import WorkIndex, { itemDomain, itemHref } from './WorkIndex'
import type { Resource, ResourcesByCategory, WorkItem } from '@/sanity/types'

const SERVICES = [
  'Web Design & Development',
  'Interaction Design & Prototyping',
  'Art Direction',
  'Photography',
  'Design Systems',
]

const STACK_FRAMEWORKS = [
  'React',
  'Next.js',
  'Three.js',
  'WebGL',
  'Motion',
  'Anime.js',
]

const STACK_CMS = ['Sanity', 'Notion', 'Are.na']

type ActivePanel = 'info' | 'resources' | 'stack' | null

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
  const stackOpen = activePanel === 'stack'

  const resourceSections = [
    { title: 'Learning', items: resources.learning },
    { title: 'Reading', items: resources.reading },
    { title: 'Watching', items: resources.watching },
  ] as const

  const workStaggerBase = 10
  const footerStaggerBase = workStaggerBase + 1 + projects.length
  const latestProject = projects[0]
  const latestDomain = latestProject ? itemDomain(latestProject) : ''
  const latestHref = latestProject ? itemHref(latestProject) : '#'
  const latestIsExternal = latestHref !== '#'

  return (
    <main className={styles.page}>
      {/* ── Directory reveal — single height-driving host so switching
          between Information, Resources, and Stack is a pure cross-fade with no
          height dip. Panes sit in columns 1, 2, and 3. ── */}
      <div
        className={`${styles.panelHost} ${
          activePanel ? styles.panelHostOpen : ''
        }`}
      >
        <div className={styles.panelHostInner}>
          <div
            className={`${styles.panelPane} ${styles.panelPaneInfo} ${
              infoOpen ? styles.panelPaneActive : ''
            }`}
            aria-hidden={!infoOpen}
          >
            <section className={styles.infoBlock}>
              <h2 className={styles.infoBlockTitle}>Information</h2>
              <p className={styles.infoText}>
                Benjamin Uribe is a designer, developer, and educator based in
                Los Angeles. He is the founder of 2u4u Studio, working across
                concept, design, and development for clients in art, culture,
                and commerce.
              </p>
              <p className={styles.infoText}>
                He is currently completing postgraduate work in Interaction
                Design at ArtCenter College of Design, with a focus on building
                thoughtful digital experiences and sharing what he learns along
                the way.
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

          <div
            className={`${styles.panelPane} ${styles.panelPaneResources} ${
              resourcesOpen ? styles.panelPaneActive : ''
            }`}
            aria-hidden={!resourcesOpen}
          >
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

          <div
            className={`${styles.panelPane} ${styles.panelPaneStack} ${
              stackOpen ? styles.panelPaneActive : ''
            }`}
            aria-hidden={!stackOpen}
          >
            <section className={styles.infoBlock}>
              <h2 className={styles.infoBlockTitle}>Frameworks</h2>
              <ul className={styles.infoList}>
                {STACK_FRAMEWORKS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className={styles.infoBlock}>
              <h2 className={styles.infoBlockTitle}>CMS</h2>
              <ul className={styles.infoList}>
                {STACK_CMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
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
          <div
            className={`${styles.heroNavCol} ${styles.heroNavCol5} animate-enter`}
            style={staggerEnter(3)}
          >
            <DirectoryToggle
              label="Stack"
              isOpen={activePanel === 'stack'}
              onClick={() =>
                setActivePanel((p) => (p === 'stack' ? null : 'stack'))
              }
            />
          </div>
        </div>
        <div className={`${styles.heroNavCol} ${styles.heroNavCol6}`}>
          <nav className={styles.heroNav}>
            <a
              href="mailto:2you4youstudio@gmail.com"
              className={`${styles.heroNavLink} ${styles.heroNavExternal} animate-enter`}
              style={staggerEnter(4)}
            >
              Email
              <HeroExternalArrow />
            </a>
            <a
              href="https://www.instagram.com/2u4u.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroNavLink} ${styles.heroNavExternal} animate-enter`}
              style={staggerEnter(5)}
            >
              Instagram
              <HeroExternalArrow />
            </a>
          </nav>
        </div>

        <div className={styles.heroCenter}>
          <h1
            className={`${styles.heroBrand} animate-enter`}
            style={staggerEnter(7)}
          >
            2u4u Studio
          </h1>
          <p
            className={`${styles.heroText} animate-enter`}
            style={staggerEnter(8)}
          >
            Design, development, and image studio in Los Angeles.
          </p>
          <p
            className={`${styles.heroTextBody} animate-enter`}
            style={staggerEnter(9)}
          >
            Latest:{' '}
            {latestDomain ? (
              <a
                href={latestHref}
                target={latestIsExternal ? '_blank' : undefined}
                rel={latestIsExternal ? 'noopener noreferrer' : undefined}
                className={styles.heroDomain}
              >
                {latestDomain}
              </a>
            ) : null}
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
