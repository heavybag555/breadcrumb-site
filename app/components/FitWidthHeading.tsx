'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { fitWidthFontSize } from '@/app/lib/fitWidthFontSize'

export default function FitWidthHeading({
  children,
  className,
  wrapClassName,
  style,
}: {
  children: ReactNode
  className?: string
  wrapClassName?: string
  style?: CSSProperties
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const text = textRef.current
    if (!wrap || !text) return

    const fit = () => fitWidthFontSize(text, wrap.clientWidth)

    fit()

    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    document.fonts?.ready.then(fit).catch(() => undefined)

    return () => ro.disconnect()
  }, [children])

  return (
    <div ref={wrapRef} className={wrapClassName}>
      <h1 ref={textRef} className={className} style={style}>
        {children}
      </h1>
    </div>
  )
}
