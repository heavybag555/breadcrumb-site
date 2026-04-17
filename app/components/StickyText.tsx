'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StickyText.module.css'

interface Fragment {
  text: string
  align: 'left' | 'right' | 'center' | 'indent'
}

interface StickyTextProps {
  fragments: Fragment[]
}

export default function StickyText({ fragments }: StickyTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fragmentRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    fragmentRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleSet(prev => {
            const next = new Set(prev)
            if (entry.isIntersecting) {
              next.add(i)
            }
            return next
          })
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [fragments.length])

  useEffect(() => {
    let loaded = false
    const run = async () => {
      if (loaded) return
      loaded = true
      const { animate } = await import('animejs')

      visibleSet.forEach(i => {
        const el = fragmentRefs.current[i]
        if (!el || el.dataset.animated === 'true') return
        el.dataset.animated = 'true'

        animate(el, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 900,
          easing: 'easeOutCubic',
          delay: 100,
        })
      })
    }
    run()
  }, [visibleSet])

  return (
    <div ref={containerRef} className={styles.container}>
      {fragments.map((fragment, i) => (
        <div
          key={i}
          className={styles.stickyWrapper}
        >
          <div
            ref={el => { fragmentRefs.current[i] = el }}
            className={`${styles.fragment} ${styles[fragment.align]}`}
            style={{ opacity: 0 }}
          >
            <p className={styles.text}>{fragment.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
