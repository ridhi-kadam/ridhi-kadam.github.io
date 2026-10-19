import { useState } from 'react'

type ArchiveImageProps = {
  src: string
  alt: string
  className?: string
  eager?: boolean
}

export function ArchiveImage({ src, alt, className = '', eager = false }: ArchiveImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <span className={`archive-image ${className}`} data-image-error={failed ? 'true' : 'false'}>
      {failed ? (
        <span className="archive-image__fallback" role="img" aria-label={`Image unavailable: ${alt}`}>
          <b>Evidence unavailable</b>
          <small>{alt}</small>
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
