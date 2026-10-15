'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Seamless Mobile Safari chrome, per Josh Puckett.
 *
 * One sampled palette is written to the fixed edge strips, the document
 * backgrounds (html = top, body = bottom), and the theme-color meta tag.
 * Joe Bell's 48px edge fade is intentionally not used: it would wash the
 * photographs and the exclusion-blend headline.
 */

type Rgb = { r: number; g: number; b: number; a: number }

const EDGE_SELECTOR = '.edge-top, .edge-bottom'
const OPAQUE = 0.98

function parseColor(input: string): Rgb | null {
  const match =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(
      input.trim(),
    )
  if (!match) return null
  return {
    r: clampChannel(match[1]),
    g: clampChannel(match[2]),
    b: clampChannel(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  }
}

function clampChannel(value: string): number {
  return Math.max(0, Math.min(255, Math.round(Number(value))))
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (n: number) => n.toString(16).padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function designPageColor(): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--page-background')
    .trim()
    .toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw
  if (/^#[0-9a-f]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
  }
  const parsed = parseColor(raw)
  return parsed ? toHex(parsed) : '#0e0e0e'
}

function readInset(edge: 'top' | 'bottom'): number {
  const probe = document.createElement('div')
  probe.style.cssText = [
    'position:fixed',
    'left:0',
    'visibility:hidden',
    'pointer-events:none',
    `${edge}:0`,
    `height:env(safe-area-inset-${edge}, 0px)`,
  ].join(';')
  document.body.appendChild(probe)
  const height = probe.getBoundingClientRect().height
  probe.remove()
  return Number.isFinite(height) ? height : 0
}

function colorAt(x: number, y: number, fallback: string): string {
  const maxX = Math.max(0, window.innerWidth - 1)
  const maxY = Math.max(0, window.innerHeight - 1)
  const stack = document.elementsFromPoint(
    Math.min(Math.max(x, 0), maxX),
    Math.min(Math.max(y, 0), maxY),
  )

  for (const el of stack) {
    if (!(el instanceof Element)) continue
    if (el.closest(EDGE_SELECTOR)) continue
    if (el === document.body || el === document.documentElement) continue

    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    if (Number(style.opacity) === 0) continue

    const parsed = parseColor(style.backgroundColor)
    if (!parsed || parsed.a < OPAQUE) continue
    return toHex(parsed)
  }

  return fallback
}

function readPalette(
  fallback: string,
  topInset: number,
  bottomInset: number,
): { top: string; bottom: string } {
  const viewport = window.visualViewport
  const offsetTop = viewport?.offsetTop ?? 0
  const offsetLeft = viewport?.offsetLeft ?? 0
  const width = viewport?.width ?? window.innerWidth
  const height = viewport?.height ?? window.innerHeight
  const x = offsetLeft + width / 2
  // Read the surface just inside each strip so the sample is the adjacent
  // page color, not the strip we are about to paint.
  const topY = offsetTop + Math.max(12, topInset) + 4
  const bottomY = offsetTop + height - Math.max(12, bottomInset) - 4

  return {
    top: colorAt(x, topY, fallback),
    bottom: colorAt(x, Math.max(topY, bottomY), fallback),
  }
}

function themeMeta(): { el: HTMLMetaElement; created: boolean } {
  const existing = document.querySelector('meta[name="theme-color"]')
  if (existing instanceof HTMLMetaElement) return { el: existing, created: false }
  const el = document.createElement('meta')
  el.setAttribute('name', 'theme-color')
  document.head.appendChild(el)
  return { el, created: true }
}

export default function SafariEdgeBackground() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const { el: meta, created } = themeMeta()
    const previous = {
      htmlBackground: root.style.backgroundColor,
      bodyBackground: document.body.style.backgroundColor,
      edgeTop: root.style.getPropertyValue('--edge-top-background'),
      edgeBottom: root.style.getPropertyValue('--edge-bottom-background'),
      theme: meta.getAttribute('content') ?? '',
    }
    const fallback = designPageColor()
    let frame = 0
    let appliedTop = ''
    let appliedBottom = ''
    let topInset = readInset('top')
    let bottomInset = readInset('bottom')

    const apply = (top: string, bottom: string) => {
      if (top === appliedTop && bottom === appliedBottom) return
      appliedTop = top
      appliedBottom = bottom
      root.style.backgroundColor = top
      document.body.style.backgroundColor = bottom
      root.style.setProperty('--edge-top-background', top)
      root.style.setProperty('--edge-bottom-background', bottom)
      if (meta.getAttribute('content') !== top) meta.setAttribute('content', top)
    }

    const update = () => {
      const palette = readPalette(fallback, topInset, bottomInset)
      apply(palette.top, palette.bottom)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const onGeometry = () => {
      topInset = readInset('top')
      bottomInset = readInset('bottom')
      schedule()
    }

    const delays = [0, 120, 480]
    const timers = delays.map((delay) => window.setTimeout(schedule, delay))

    const viewport = window.visualViewport
    document.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', onGeometry)
    window.addEventListener('orientationchange', onGeometry)
    window.addEventListener('pageshow', onGeometry)
    viewport?.addEventListener('resize', onGeometry)
    viewport?.addEventListener('scroll', schedule)
    update()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      timers.forEach((timer) => window.clearTimeout(timer))
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', onGeometry)
      window.removeEventListener('orientationchange', onGeometry)
      window.removeEventListener('pageshow', onGeometry)
      viewport?.removeEventListener('resize', onGeometry)
      viewport?.removeEventListener('scroll', schedule)

      root.style.backgroundColor = previous.htmlBackground
      document.body.style.backgroundColor = previous.bodyBackground
      if (previous.edgeTop) {
        root.style.setProperty('--edge-top-background', previous.edgeTop)
      } else {
        root.style.removeProperty('--edge-top-background')
      }
      if (previous.edgeBottom) {
        root.style.setProperty('--edge-bottom-background', previous.edgeBottom)
      } else {
        root.style.removeProperty('--edge-bottom-background')
      }
      if (created) {
        meta.remove()
      } else if (previous.theme) {
        meta.setAttribute('content', previous.theme)
      } else {
        meta.removeAttribute('content')
      }
    }
  }, [pathname])

  return (
    <>
      <div className="edge-top" aria-hidden="true" />
      <div className="edge-bottom" aria-hidden="true" />
    </>
  )
}
