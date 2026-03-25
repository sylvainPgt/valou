'use client'

import Image from 'next/image'
import {useEffect, useMemo, useState} from 'react'
import {useCartStore} from '@/store/useCartStore'

type ProductDetailClientProps = {
  product: {
    _id: string
    name: string
    price: number
    isAvailable: boolean
    imageUrl?: string | null
  }
  photos: {url: string}[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function ProductDetailClient({
  product,
  photos,
}: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const safePhotos = useMemo(
    () => photos.filter((p) => typeof p?.url === 'string' && p.url.length > 0),
    [photos],
  )

  const activePhoto = safePhotos[activeIndex]?.url ?? product.imageUrl ?? null

  useEffect(() => {
    if (!lightboxOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) => (i - 1 + safePhotos.length) % safePhotos.length)
      }
      if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i + 1) % safePhotos.length)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, safePhotos.length])

  return (
    <div className="space-y-5 text-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {product.isAvailable ? (
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product._id,
                title: product.name,
                price: product.price,
                image: product.imageUrl ?? safePhotos[0]?.url ?? null,
              })
            }
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Ajouter au panier · {formatPrice(product.price)}
          </button>
        ) : (
          <span className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-500">
            Indisponible
          </span>
        )}

        {safePhotos.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setActiveIndex(0)
              setLightboxOpen(true)
            }}
            className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
          >
            Voir les photos en grand
          </button>
        ) : null}
      </div>

      {safePhotos.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {safePhotos.slice(0, 8).map((p, idx) => (
            <button
              key={p.url}
              type="button"
              onClick={() => {
                setActiveIndex(idx)
                setLightboxOpen(true)
              }}
              className={[
                'relative h-16 w-16 overflow-hidden rounded-xl border bg-zinc-100',
                idx === activeIndex ? 'border-black/20' : 'border-black/5',
              ].join(' ')}
              aria-label={`Ouvrir la photo ${idx + 1}`}
            >
              <Image src={p.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen && activePhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setLightboxOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl bg-black">
              <div className="relative aspect-[16/9]">
                <Image
                  src={activePhoto}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {safePhotos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Photo précédente"
                  onClick={() =>
                    setActiveIndex(
                      (i) => (i - 1 + safePhotos.length) % safePhotos.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Photo suivante"
                  onClick={() => setActiveIndex((i) => (i + 1) % safePhotos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white"
                >
                  →
                </button>
              </>
            ) : null}

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-white/80">
                {safePhotos.length > 0
                  ? `Photo ${activeIndex + 1} / ${safePhotos.length}`
                  : null}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-white/90"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

