'use client'

import { useEffect, useRef } from 'react'
import styles from './SectionLabel.module.css'

interface SectionLabelProps {
  label: string
  detail?: string
}

export default function SectionLabel({ label, detail }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let loaded = false
    const run = async () => {
      if (loaded) return
      loaded = true
      const { animate } = await import('animejs')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          animate(el, {
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutCubic',
          })
        },
        { threshold: 0.5 }
      )
      observer.observe(el)
    }
    run()
  }, [])

  return (
    <div ref={ref} className={styles.label} style={{ opacity: 0 }}>
      <span className={styles.text}>{label}</span>
      {detail && <span className={styles.detail}>{detail}</span>}
    </div>
  )
}
