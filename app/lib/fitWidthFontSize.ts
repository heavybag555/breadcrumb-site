export function fitWidthFontSize(textEl: HTMLElement, width: number) {
  if (width <= 0) return

  textEl.style.fontSize = ''

  let lo = 8
  let hi = 512

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    textEl.style.fontSize = `${mid}px`
    if (textEl.scrollWidth > width) hi = mid - 1
    else lo = mid
  }

  textEl.style.fontSize = `${lo}px`
}
