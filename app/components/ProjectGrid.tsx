'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './ProjectGrid.module.css'

export interface ProjectSlot {
  id: string
  title: string
  href: string
  imageUrl?: string
  category?: string
  year?: string
}

interface ProjectGridProps {
  slots: ProjectSlot[]
  columns?: 2 | 3
}

function PlaceholderSlot({ index }: { index: number }) {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <div className={styles.placeholder} />
      </div>
      <div className={styles.meta}>
        <span className={styles.title}>Project {index + 1}</span>
        <span className={styles.category}>Coming Soon</span>
      </div>
    </div>
  )
}

export default function ProjectGrid({ slots, columns = 2 }: ProjectGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let loaded = false
    const run = async () => {
      if (loaded) return
      loaded = true
      const { animate, stagger } = await import('animejs')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()

          const cards = gridRef.current?.querySelectorAll(`.${styles.card}`)
          if (!cards) return

          animate(cards, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 800,
            easing: 'easeOutCubic',
            delay: stagger(150),
          })
        },
        { threshold: 0.15 }
      )

      if (gridRef.current) observer.observe(gridRef.current)
    }
    run()
  }, [])

  const count = columns === 3 ? 3 : 2
  const items = Array.from({ length: count }, (_, i) => slots[i] || null)

  return (
    <div className={styles.wrapper}>
      <div
        ref={gridRef}
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {items.map((slot, i) =>
          slot ? (
            <a
              key={slot.id}
              href={slot.href}
              className={styles.card}
              style={{ opacity: 0 }}
            >
              <div className={styles.thumbnail}>
                {slot.imageUrl ? (
                  <Image
                    src={slot.imageUrl}
                    alt={slot.title}
                    width={800}
                    height={600}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <div className={styles.meta}>
                <span className={styles.title}>{slot.title}</span>
                <span className={styles.category}>{slot.category || ''}</span>
                {slot.year && <span className={styles.year}>{slot.year}</span>}
              </div>
            </a>
          ) : (
            <PlaceholderSlot key={`placeholder-${i}`} index={i} />
          )
        )}
      </div>
    </div>
  )
}
