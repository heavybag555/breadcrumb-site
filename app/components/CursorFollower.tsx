'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CursorFollower.module.css'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isOverText, setIsOverText] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  // Animation frame refs
  const animationFrameRef = useRef<number>()
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const cursorPositionRef = useRef({ x: 0, y: 0 })
  
  // Check if element is a text element by walking up the DOM tree
  const isTextElement = (element: Element | null): boolean => {
    if (!element) return false
    
    // Walk up the DOM tree to find text elements
    let current: Element | null = element
    const textElementTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'LI', 'LABEL', 'BUTTON', 'STRONG', 'EM', 'B', 'I', 'U']
    
    while (current && current !== document.body) {
      // Skip cursor elements
      if (current.classList?.contains('cursor')) {
        current = current.parentElement
        continue
      }
      
      // Check if it's a text element
      if (textElementTags.includes(current.tagName)) {
        return true
      }
      
      // Check if element has direct text content (not just in children)
      const hasDirectText = Array.from(current.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && (node.textContent?.trim()?.length ?? 0) > 0
      )
      
      if (hasDirectText && (current.textContent?.trim()?.length ?? 0) > 0) {
        const computedStyle = window.getComputedStyle(current)
        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          return true
        }
      }
      
      current = current.parentElement
    }
    
    return false
  }

  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
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
      const elementUnderCursor = document.elementFromPoint(
        cursorPositionRef.current.x,
        cursorPositionRef.current.y
      )
      setIsOverText(isTextElement(elementUnderCursor))

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
      className={`${styles.cursor} ${isOverText ? styles.cursorOverText : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        mixBlendMode: isOverText ? 'difference' : 'normal',
      }}
    />
  )
}
