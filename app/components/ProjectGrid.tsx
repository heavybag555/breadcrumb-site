'use client'

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
  const count = columns === 3 ? 3 : 2
  const items = Array.from({ length: count }, (_, i) => slots[i] || null)

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {items.map((slot, i) =>
          slot ? (
            <a
              key={slot.id}
              href={slot.href}
              className={styles.card}
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
