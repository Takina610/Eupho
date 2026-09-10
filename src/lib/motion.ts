export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function subscribePrefersReducedMotion(onChange: (matches: boolean) => void): () => void {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const update = () => onChange(media.matches)
  update()
  media.addEventListener('change', update)
  return () => media.removeEventListener('change', update)
}
