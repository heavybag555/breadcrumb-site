'use client'

import { useEffect } from 'react'

/**
 * Soft, heavy, buttery smooth scroll.
 *
 * Implementation notes
 * - Intercepts wheel + keyboard scroll and lerps a target scroll
 *   position toward the desired value on every rAF tick.
 * - Keeps the native scroll container (window) so `position: sticky`,
 *   anchor links, and all existing scroll listeners keep working.
 * - Bails out on touch devices and when the user prefers reduced motion,
 *   falling back to the browser's native scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqCoarse = window.matchMedia('(pointer: coarse)')
    if (mqReduced.matches || mqCoarse.matches) return

    // Heaviness: lower = heavier / longer glide. 0.04 feels very
    // weighted — the page keeps drifting after the wheel stops.
    const LERP = 0.04
    // Scale wheel delta. Kept <1 so a single wheel notch doesn't
    // overshoot the long glide and the motion stays cinematic.
    const WHEEL_MULT = 0.7
    // Stop ticking once we're within half a pixel of the target.
    const EPSILON = 0.5

    let target = window.scrollY
    let current = window.scrollY
    let lastAppliedY = window.scrollY
    let rafId: number | null = null
    let running = false

    const getMaxScroll = () =>
      Math.max(
        0,
        (document.documentElement.scrollHeight || 0) - window.innerHeight,
      )

    const clamp = (v: number) => Math.max(0, Math.min(getMaxScroll(), v))

    const tick = () => {
      const dy = target - current
      if (Math.abs(dy) < EPSILON) {
        current = target
        window.scrollTo(0, current)
        lastAppliedY = window.scrollY
        running = false
        rafId = null
        return
      }
      current += dy * LERP
      window.scrollTo(0, current)
      lastAppliedY = window.scrollY
      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(tick)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return
      e.preventDefault()

      // Convert line/page deltas to pixels.
      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 16
      else if (e.deltaMode === 2) dy *= window.innerHeight

      target = clamp(target + dy * WHEEL_MULT)
      start()
    }

    const KEY_STEP: Record<string, number> = {
      ArrowDown: 80,
      ArrowUp: -80,
      PageDown: 0, // filled in dynamically
      PageUp: 0,
      Space: 0,
      Home: -Infinity,
      End: Infinity,
    }

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t) {
        const tag = t.tagName
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          t.isContentEditable
        ) {
          return
        }
      }

      let delta: number | null = null
      switch (e.key) {
        case 'ArrowDown':
          delta = KEY_STEP.ArrowDown
          break
        case 'ArrowUp':
          delta = KEY_STEP.ArrowUp
          break
        case 'PageDown':
          delta = window.innerHeight * 0.9
          break
        case 'PageUp':
          delta = -window.innerHeight * 0.9
          break
        case ' ':
          delta = (e.shiftKey ? -1 : 1) * window.innerHeight * 0.9
          break
        case 'Home':
          e.preventDefault()
          target = 0
          start()
          return
        case 'End':
          e.preventDefault()
          target = getMaxScroll()
          start()
          return
        default:
          return
      }

      if (delta === null) return
      e.preventDefault()
      target = clamp(target + delta)
      start()
    }

    // If something scrolled the window outside of our rAF (scrollbar
    // drag, anchor jump, focus(), hash change, etc.), snap to it so
    // we don't fight the browser.
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - lastAppliedY) > 1) {
        current = y
        target = y
        lastAppliedY = y
      }
    }

    const onResize = () => {
      target = clamp(target)
      current = clamp(current)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return null
}
