import type { CSSProperties } from 'react'

/** Stagger index for `.animate-enter` — pairs with `--delay` in `globals.css`. */
export function staggerEnter(index: number): CSSProperties {
  return { '--stagger': index } as CSSProperties
}
