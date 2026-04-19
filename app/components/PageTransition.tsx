'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * Route-change crossfade for the App Router.
 *
 * Next doesn't remount shared layouts on navigation, so we drive
 * the transition ourselves:
 *
 *   1. Intercept same-origin `<a>` clicks (including Next `<Link>`
 *      output, since `Link` ultimately renders an anchor).
 *   2. Set the wrapper to `opacity: 0` and wait for the fade-out
 *      to finish (`--page-fade-out`).
 *   3. Call `router.push`, scroll to the top, and — once the new
 *      route's pathname has been committed — fade the wrapper back
 *      in on the slower `--page-fade-in` ramp.
 *
 * On the initial hard load we also start hidden and fade in once
 * the first commit lands, so the first paint doesn't snap in.
 *
 * Pure opacity — no transform, no blur — so sticky positions and
 * the custom SmoothScroll handler aren't disturbed.
 */

/** Keep in sync with `--page-fade-out` in `globals.css`. */
const FADE_OUT_MS = 900

/** Small buffer after navigation commits before fading back in —
 *  gives React a frame to paint the new route before the opacity
 *  transition starts, so we don't see a half-faded old page. */
const PRE_FADE_IN_MS = 40

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? '/'
  const router = useRouter()

  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  const pendingHrefRef = useRef<string | null>(null)
  const pendingHashRef = useRef<string | null>(null)
  const fadeOutTimerRef = useRef<number | null>(null)
  const fadeInTimerRef = useRef<number | null>(null)
  const lastCommittedPathRef = useRef<string>(pathname)

  const clearTimers = () => {
    if (fadeOutTimerRef.current !== null) {
      clearTimeout(fadeOutTimerRef.current)
      fadeOutTimerRef.current = null
    }
    if (fadeInTimerRef.current !== null) {
      clearTimeout(fadeInTimerRef.current)
      fadeInTimerRef.current = null
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // Initial mount: fade in on the first paint.
  useEffect(() => {
    if (reduced) {
      setVisible(true)
      return
    }
    const id = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(id)
  }, [reduced])

  // Intercept same-origin link clicks so we can run the fade-out
  // before navigation. Capture phase so we land before Next's
  // internal `<Link>` click handler fires.
  useEffect(() => {
    if (reduced) return

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement | null)?.closest(
        'a[href]',
      ) as HTMLAnchorElement | null
      if (!anchor) return

      const target = anchor.getAttribute('target')
      if (target && target !== '' && target !== '_self') return

      const rawHref = anchor.getAttribute('href')
      if (!rawHref) return
      if (
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('javascript:')
      ) {
        return
      }

      // `download` anchors should keep their default behaviour.
      if (anchor.hasAttribute('download')) return

      let url: URL
      try {
        url = new URL(rawHref, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      // Same-URL click → let it no-op (no fade).
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash
      ) {
        return
      }

      // Same-page hash jump (e.g. "/#work" while already on "/").
      // Skip the page fade and smoothly scroll to the target so the
      // viewer keeps their current context instead of blinking out.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash &&
        url.hash !== window.location.hash
      ) {
        e.preventDefault()
        const hash = url.hash
        const targetId = decodeURIComponent(hash.slice(1))
        const target = targetId ? document.getElementById(targetId) : null
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        if (typeof window.history?.pushState === 'function') {
          window.history.pushState(null, '', hash)
        }
        return
      }

      e.preventDefault()

      // Ignore while we're already transitioning out.
      if (pendingHrefRef.current) return

      const dest = url.pathname + url.search + url.hash
      pendingHrefRef.current = dest
      pendingHashRef.current = url.hash || null

      setVisible(false)

      clearTimers()
      fadeOutTimerRef.current = window.setTimeout(() => {
        fadeOutTimerRef.current = null
        const href = pendingHrefRef.current
        if (!href) return
        router.push(href)
      }, FADE_OUT_MS)
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
    }
  }, [reduced, router])

  // When the pathname actually changes (post `router.push`), scroll
  // to the top (or to the hash target, if one was requested) and
  // schedule a fade back in.
  useEffect(() => {
    if (pathname === lastCommittedPathRef.current) return
    lastCommittedPathRef.current = pathname
    pendingHrefRef.current = null

    const hash = pendingHashRef.current
    pendingHashRef.current = null

    const scrollToHashTarget = () => {
      if (!hash) return false
      const targetId = decodeURIComponent(hash.slice(1))
      if (!targetId) return false
      const target = document.getElementById(targetId)
      if (!target) return false
      // Jump without animation — the new page is still fading in,
      // so a smooth scroll on top of that reads as jittery.
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
      return true
    }

    if (reduced) {
      if (!scrollToHashTarget()) window.scrollTo(0, 0)
      setVisible(true)
      return
    }

    if (!scrollToHashTarget()) {
      window.scrollTo(0, 0)
    }

    if (fadeInTimerRef.current !== null) clearTimeout(fadeInTimerRef.current)
    fadeInTimerRef.current = window.setTimeout(() => {
      fadeInTimerRef.current = null
      setVisible(true)
    }, PRE_FADE_IN_MS)
  }, [pathname, reduced])

  useEffect(() => clearTimers, [])

  return (
    <div
      className={
        reduced
          ? undefined
          : `pageTransition ${visible ? '' : 'pageTransitionHidden'}`
      }
    >
      {children}
    </div>
  )
}
