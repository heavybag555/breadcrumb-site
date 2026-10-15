'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Seamless Mobile Safari chrome, following Josh Puckett's edge-strip
 * technique. Two fixed strips sit outside transformed ancestors. Their
 * ::after backgrounds, the document backgrounds, and the theme-color
 * meta tag all receive one sampled top color and one sampled bottom
 * color.
 *
 * Samples come from the page's own CSS: full-width background colors
 * (the #0e0e0e canvas, the #000 footer) and full-bleed CSS background
 * images (the end-of-work photo). Joe Bell's edge fade is intentionally
 * omitted — a 48px gradient would fog the sticky exclusion type and the
 * photographs.
 */

type RGBA = { r: number; g: number; b: number; a: number }

type SampleKind = 'surface' | 'image' | 'page'

type Sample = { hex: string; kind: SampleKind }

type Bitmap = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
}

const PAGE_FALLBACK = '#0e0e0e'
const WIDE_FRACTION = 0.75
const MIN_SURFACE_HEIGHT = 8

function parseColor(input: string): RGBA | null {
  const value = input.trim().toLowerCase()
  if (!value || value === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }

  const hex = /^#([0-9a-f]{3,8})$/.exec(value)
  if (hex) {
    const raw = hex[1]
    const expand = (pair: string) => Number.parseInt(pair, 16)
    if (raw.length === 3 || raw.length === 4) {
      const r = expand(raw[0] + raw[0])
      const g = expand(raw[1] + raw[1])
      const b = expand(raw[2] + raw[2])
      const a = raw.length === 4 ? expand(raw[3] + raw[3]) / 255 : 1
      return { r, g, b, a }
    }
    if (raw.length === 6 || raw.length === 8) {
      return {
        r: expand(raw.slice(0, 2)),
        g: expand(raw.slice(2, 4)),
        b: expand(raw.slice(4, 6)),
        a: raw.length === 8 ? expand(raw.slice(6, 8)) / 255 : 1,
      }
    }
  }

  const modern = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(
    value,
  )
  if (!modern) return null
  const alpha = modern[4]
  let a = 1
  if (alpha) {
    a = alpha.endsWith('%') ? Number.parseFloat(alpha) / 100 : Number.parseFloat(alpha)
  }
  return {
    r: Number.parseFloat(modern[1]),
    g: Number.parseFloat(modern[2]),
    b: Number.parseFloat(modern[3]),
    a,
  }
}

function toHex({ r, g, b }: RGBA): string {
  const channel = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function composite(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a + bg.a * (1 - fg.a)
  if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 }
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  }
}

function readPageBackground(): RGBA {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--page-background')
    .trim()
  return parseColor(raw) ?? parseColor(PAGE_FALLBACK)!
}

function isEdge(el: Element): boolean {
  return Boolean(el.closest('.edge-top, .edge-bottom'))
}

function effectiveOpacity(el: Element, cache: Map<Element, number>): number {
  const cached = cache.get(el)
  if (cached !== undefined) return cached
  const own = Number.parseFloat(getComputedStyle(el).opacity)
  const parent = el.parentElement
  const value =
    (Number.isFinite(own) ? own : 1) *
    (parent && parent !== document.documentElement
      ? effectiveOpacity(parent, cache)
      : 1)
  cache.set(el, value)
  return value
}

function cssImageUrl(backgroundImage: string): string | null {
  const match = /url\(\s*(['"]?)(.*?)\1\s*\)/i.exec(backgroundImage)
  if (!match?.[2] || match[2].startsWith('data:')) return null
  try {
    return new URL(match[2], window.location.href).href
  } catch {
    return null
  }
}

function consensus(samples: Sample[]): string {
  const surfaces = samples.filter((sample) => sample.kind === 'surface')
  const pool = surfaces.length
    ? surfaces
    : samples.filter((sample) => sample.kind === 'image')
  const colors = (pool.length ? pool : samples).map((sample) => sample.hex)
  if (pool.length && pool.every((sample) => sample.kind === 'image') && colors.length > 1) {
    const parsed = colors
      .map((hex) => parseColor(hex))
      .filter((color): color is RGBA => color !== null)
    if (parsed.length) {
      const avg = parsed.reduce(
        (acc, color) => ({
          r: acc.r + color.r,
          g: acc.g + color.g,
          b: acc.b + color.b,
          a: 1,
        }),
        { r: 0, g: 0, b: 0, a: 1 },
      )
      return toHex({
        r: avg.r / parsed.length,
        g: avg.g / parsed.length,
        b: avg.b / parsed.length,
        a: 1,
      })
    }
  }
  const counts = new Map<string, number>()
  for (const color of colors) counts.set(color, (counts.get(color) ?? 0) + 1)
  let best = colors[0] ?? PAGE_FALLBACK
  let bestCount = -1
  for (const [color, count] of counts) {
    if (count > bestCount) {
      best = color
      bestCount = count
    }
  }
  return best
}

export default function SafariEdgeBackground() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const snapshot = {
      htmlBg: root.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
      topVar: root.style.getPropertyValue('--edge-top-background'),
      bottomVar: root.style.getPropertyValue('--edge-bottom-background'),
    }
    const existingMetas = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'),
    )
    const metaSnapshot = existingMetas.map((meta) => ({
      meta,
      content: meta.getAttribute('content'),
    }))
    let createdMeta: HTMLMetaElement | null = null
    if (existingMetas.length === 0) {
      createdMeta = document.createElement('meta')
      createdMeta.name = 'theme-color'
      createdMeta.content = toHex(readPageBackground())
      document.head.appendChild(createdMeta)
    }

    return () => {
      root.style.backgroundColor = snapshot.htmlBg
      body.style.backgroundColor = snapshot.bodyBg
      if (snapshot.topVar) root.style.setProperty('--edge-top-background', snapshot.topVar)
      else root.style.removeProperty('--edge-top-background')
      if (snapshot.bottomVar) {
        root.style.setProperty('--edge-bottom-background', snapshot.bottomVar)
      } else {
        root.style.removeProperty('--edge-bottom-background')
      }
      if (createdMeta) {
        createdMeta.remove()
      } else {
        for (const item of metaSnapshot) {
          if (item.content == null) item.meta.removeAttribute('content')
          else item.meta.setAttribute('content', item.content)
        }
      }
    }
  }, [])

  useEffect(() => {
    let frame = 0
    let cancelled = false
    let appliedTop = ''
    let appliedBottom = ''
    const bitmaps = new Map<string, Bitmap | null>()
    const loading = new Set<string>()
    let imageLayers: HTMLElement[] = []

    const schedule = () => {
      if (cancelled || frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const ensureBitmap = (url: string) => {
      if (bitmaps.has(url) || loading.has(url)) return
      loading.add(url)
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        loading.delete(url)
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx || !img.naturalWidth || !img.naturalHeight) {
          bitmaps.set(url, null)
        } else {
          ctx.drawImage(img, 0, 0)
          bitmaps.set(url, { ctx, width: img.naturalWidth, height: img.naturalHeight })
        }
        schedule()
      }
      img.onerror = () => {
        loading.delete(url)
        bitmaps.set(url, null)
      }
      img.src = url
    }

    const refreshImageLayers = () => {
      const found: HTMLElement[] = []
      const nodes = document.body.querySelectorAll<HTMLElement>('*')
      for (const el of nodes) {
        if (isEdge(el)) continue
        const backgroundImage = getComputedStyle(el).backgroundImage
        if (backgroundImage && backgroundImage.includes('url(')) found.push(el)
      }
      imageLayers = found
    }

    const sampleBackgroundImage = (
      el: HTMLElement,
      x: number,
      y: number,
      opacityCache: Map<Element, number>,
    ): RGBA | null => {
      const style = getComputedStyle(el)
      const url = cssImageUrl(style.backgroundImage)
      if (!url) return null
      if (!bitmaps.has(url)) {
        ensureBitmap(url)
        return null
      }
      const bitmap = bitmaps.get(url)
      if (!bitmap) return null

      const opacity = effectiveOpacity(el, opacityCache)
      if (opacity <= 0.02) return null

      const rect = el.getBoundingClientRect()
      const viewW = rect.width
      const viewH = rect.height
      if (viewW <= 0 || viewH <= 0) return null

      let scaleX = viewW / bitmap.width
      let scaleY = viewH / bitmap.height
      const size = style.backgroundSize.trim()
      if (size === 'cover') {
        const scale = Math.max(scaleX, scaleY)
        scaleX = scale
        scaleY = scale
      } else if (size === 'contain') {
        const scale = Math.min(scaleX, scaleY)
        scaleX = scale
        scaleY = scale
      } else if (size === 'auto' || size === '') {
        scaleX = 1
        scaleY = 1
      }

      const renderedW = bitmap.width * scaleX
      const renderedH = bitmap.height * scaleY
      const position = style.backgroundPosition
      let offsetX = (viewW - renderedW) / 2
      let offsetY = (viewH - renderedH) / 2
      if (position.startsWith('0%') || position.startsWith('left') || position.startsWith('top left')) {
        offsetX = 0
      } else if (position.startsWith('100%') || position.startsWith('right')) {
        offsetX = viewW - renderedW
      }
      if (position.includes('top') || position.endsWith(' 0%')) offsetY = 0
      else if (position.includes('bottom') || position.endsWith(' 100%')) {
        offsetY = viewH - renderedH
      }

      const sx = (x - rect.left - offsetX) / scaleX
      const sy = (y - rect.top - offsetY) / scaleY
      if (sx < 0 || sy < 0 || sx >= bitmap.width || sy >= bitmap.height) return null
      const pixel = bitmap.ctx.getImageData(Math.floor(sx), Math.floor(sy), 1, 1).data
      const alpha = (pixel[3] / 255) * opacity
      if (alpha <= 0.02) return null
      return { r: pixel[0], g: pixel[1], b: pixel[2], a: alpha }
    }

    const samplePoint = (x: number, y: number, minWidth: number): Sample => {
      const page = readPageBackground()
      const pageHex = toHex(page)
      const opacityCache = new Map<Element, number>()
      const covering: { el: HTMLElement; color: RGBA; z: number; order: number }[] = []

      imageLayers.forEach((el, order) => {
        const rect = el.getBoundingClientRect()
        if (rect.width < minWidth || rect.height < MIN_SURFACE_HEIGHT) return
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return
        const color = sampleBackgroundImage(el, x, y, opacityCache)
        if (!color) return
        const z = Number.parseInt(getComputedStyle(el).zIndex, 10)
        covering.push({
          el,
          color,
          z: Number.isFinite(z) ? z : 0,
          order,
        })
      })
      covering.sort((a, b) => b.z - a.z || b.order - a.order)
      const frontImage = covering[0]

      const surfaceLayers: RGBA[] = []
      for (const el of document.elementsFromPoint(x, y)) {
        if (el === document.documentElement || el === document.body) continue
        if (isEdge(el)) continue
        // A full-bleed image paints above its ancestors' backgrounds
        // (the page canvas) and below later siblings such as the footer.
        if (frontImage && el.contains(frontImage.el)) continue
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        const rect = el.getBoundingClientRect()
        if (rect.width < minWidth || rect.height < MIN_SURFACE_HEIGHT) continue
        const background = parseColor(style.backgroundColor)
        if (!background || background.a <= 0.01) continue
        const opacity = effectiveOpacity(el, opacityCache)
        if (opacity <= 0.02) continue
        surfaceLayers.push({
          r: background.r,
          g: background.g,
          b: background.b,
          a: background.a * opacity,
        })
      }

      if (surfaceLayers.length) {
        let color = page
        for (let i = surfaceLayers.length - 1; i >= 0; i--) {
          color = composite(surfaceLayers[i], color)
        }
        return { hex: toHex(color), kind: 'surface' }
      }

      if (frontImage) {
        return { hex: toHex(composite(frontImage.color, page)), kind: 'image' }
      }
      return { hex: pageHex, kind: 'page' }
    }

    const update = () => {
      if (cancelled) return
      const vv = window.visualViewport
      const width = vv?.width ?? window.innerWidth
      const height = vv?.height ?? window.innerHeight
      if (width < 2 || height < 2) return
      const offsetX = vv?.offsetLeft ?? 0
      const offsetY = vv?.offsetTop ?? 0
      const insetX = Math.min(12, width / 2)
      const ys = [offsetY + 2, offsetY + Math.max(3, height - 2)]
      const xs = [offsetX + insetX, offsetX + width / 2, offsetX + width - insetX]
      const minWidth = width * WIDE_FRACTION
      const [top, bottom] = ys.map((y) =>
        consensus(xs.map((x) => samplePoint(x, y, minWidth))),
      )
      applyPalette(top, bottom)
    }

    const applyPalette = (top: string, bottom: string) => {
      if (top === appliedTop && bottom === appliedBottom) return
      appliedTop = top
      appliedBottom = bottom
      const root = document.documentElement
      root.style.setProperty('--edge-top-background', top)
      root.style.setProperty('--edge-bottom-background', bottom)
      root.style.backgroundColor = top
      document.body.style.backgroundColor = bottom
      const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      metas.forEach((meta) => {
        if (meta.getAttribute('content') !== top) meta.setAttribute('content', top)
      })
    }

    refreshImageLayers()
    schedule()

    const onChange = () => {
      refreshImageLayers()
      schedule()
    }

    // Late UI (Sanity Studio, the end-photo opacity) can change an edge
    // without a scroll. Ignore the echo from our own html/body writes:
    // applyPalette no-ops when the sampled colors are unchanged.
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    const timeouts = [0, 250, 1000].map((ms) => window.setTimeout(schedule, ms))
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    window.addEventListener('pageshow', onChange)
    window.addEventListener('load', schedule)
    const vv = window.visualViewport
    vv?.addEventListener('resize', schedule)
    vv?.addEventListener('scroll', schedule)

    return () => {
      cancelled = true
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      for (const timeout of timeouts) window.clearTimeout(timeout)
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
      window.removeEventListener('pageshow', onChange)
      window.removeEventListener('load', schedule)
      vv?.removeEventListener('resize', schedule)
      vv?.removeEventListener('scroll', schedule)
    }
  }, [pathname])

  return (
    <>
      <div className="edge-top" aria-hidden="true" />
      <div className="edge-bottom" aria-hidden="true" />
    </>
  )
}
