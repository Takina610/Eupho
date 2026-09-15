import './akArrow.css'

export type AkArrowDirection = 'up' | 'down' | 'left' | 'right'

/**
 * AK-world broken chevron: a tall thick arrow whose upper arm is slice-cut
 * into a detached parallel piece (path lifted from the reference site's
 * icon sprite, viewBox 0 0 7 15, pointing right). Rotation lives in CSS
 * classes so callers can re-aim it per breakpoint via a media query.
 */
export function AkArrow({
  direction = 'right',
  className,
}: {
  direction?: AkArrowDirection
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 7 15"
      className={`ak-arrow ak-arrow--${direction}${className ? ` ${className}` : ''}`}
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M-.005 14.988v-2.856l4.327-4.635 1.335-1.429L6.99 7.497l-6.995 7.491zm0-12.127V.005L4.322 4.64 2.989 6.068-.005 2.861z"
      />
    </svg>
  )
}
