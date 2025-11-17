'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CursorFollower.module.css'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  // Animation frame refs
  const animationFrameRef = useRef<number>()
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const cursorPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        (window.matchMedia && window.matchMedia('(hover: none)').matches)
      )
    }
    
    const touchDevice = checkTouchDevice()
    setIsTouchDevice(touchDevice)
    
    // Don't initialize cursor on touch devices
    if (touchDevice) {
      return
    }
    
    // Initialize positions
    const initX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
    const initY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    
    mousePositionRef.current = { x: initX, y: initY }
    cursorPositionRef.current = { x: initX, y: initY }
    
    // Set initial cursor position
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${initX}px, ${initY}px)`
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Smooth animation loop with high frame rate
    const animate = () => {
      if (!cursorRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Check if cursor is over text element (use cursor's actual position for blend mode)
      // Extremely smooth cursor movement with fine-tuned easing
      const ease = 0.12
      const dx = mousePositionRef.current.x - cursorPositionRef.current.x
      const dy = mousePositionRef.current.y - cursorPositionRef.current.y
      
      cursorPositionRef.current.x += dx * ease
      cursorPositionRef.current.y += dy * ease

      // Update cursor position
      cursorRef.current.style.transform = `translate(${cursorPositionRef.current.x}px, ${cursorPositionRef.current.y}px)`

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Don't render cursor on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      style={{
        opacity: isVisible ? 1 : 0,
        mixBlendMode: 'normal',
      }}
    />
  )
}
