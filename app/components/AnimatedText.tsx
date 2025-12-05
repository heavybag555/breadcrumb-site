'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AnimatedText.module.css'

interface AnimatedTextProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
}

export default function AnimatedText({ 
  children, 
  className = '', 
  delay = 0,
  stagger = 0.05 
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const words = children.split(' ')

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`${styles.word} ${isVisible ? styles.visible : ''}`}
          style={{
            animationDelay: `${index * stagger}s`,
          }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

