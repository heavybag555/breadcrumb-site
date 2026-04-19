'use client'

import {
  forwardRef,
  type ImgHTMLAttributes,
  type MutableRefObject,
  useEffect,
  useRef,
} from 'react'

/**
 * Drop-in replacement for <img> that fades in once the source has
 * finished loading. Pure opacity — no transform, scale, or slide —
 * so sticky positioning, mix-blend-mode, and page transitions stay
 * intact. Respects `prefers-reduced-motion` via the global rule in
 * `globals.css`.
 *
 * Uses a ref-checked `complete` read on mount so images that were
 * already cached still land in the loaded state on hydration, even
 * when React's onLoad handler doesn't fire for them.
 */

type Props = ImgHTMLAttributes<HTMLImageElement>

const FadeImage = forwardRef<HTMLImageElement, Props>(function FadeImage(
  props,
  forwardedRef,
) {
  const innerRef = useRef<HTMLImageElement | null>(null)

  const setRef = (node: HTMLImageElement | null) => {
    innerRef.current = node
    if (typeof forwardedRef === 'function') {
      forwardedRef(node)
    } else if (forwardedRef) {
      (forwardedRef as MutableRefObject<HTMLImageElement | null>).current = node
    }
  }

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    if (el.complete && el.naturalWidth > 0) {
      el.dataset.loaded = 'true'
      return
    }

    const markLoaded = () => {
      el.dataset.loaded = 'true'
    }

    el.addEventListener('load', markLoaded, { once: true })
    el.addEventListener('error', markLoaded, { once: true })
    return () => {
      el.removeEventListener('load', markLoaded)
      el.removeEventListener('error', markLoaded)
    }
  }, [props.src])

  return <img ref={setRef} data-fade="" {...props} />
})

export default FadeImage
