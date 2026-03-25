'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useCartStore} from '@/store/useCartStore'

export type ProductCard = {
  _id: string
  name: string
  slug: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

type ProductGridProps = {
  products: ProductCard[]
  variant?: 'shop' | 'preview'
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

const fallbackImage =
  'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80'

export default function ProductGrid({products, variant = 'shop'}: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem)

  const cols =
    variant === 'preview'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  return (
    <div className={`grid ${cols} gap-6`}>
      {products.map((p) => (
        <article
          key={p._id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md text-gray-900"
        >
          <Link href={`/boutique/${p.slug}`} className="block">
            <div className="relative aspect-[4/3] bg-zinc-100">
              <Image
                src={p.imageUrl ?? fallbackImage}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {!p.isAvailable && (
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
                  Vendu
                </div>
              )}
            </div>
          </Link>

          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              <Link href={`/boutique/${p.slug}`} className="block">
                <h3 className="text-base font-semibold leading-6 text-gray-900 group-hover:underline underline-offset-4">
                  {p.name}
                </h3>
              </Link>
              <p className="text-lg font-semibold tabular-nums text-gray-900">
                {formatPrice(p.price)}
              </p>
            </div>

            {p.isAvailable ? (
              <button
                type="button"
                onClick={() =>
                  addItem({
                    id: p._id,
                    title: p.name,
                    price: p.price,
                    image: p.imageUrl ?? null,
                  })
                }
                className="mt-auto inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                Ajouter au panier
              </button>
            ) : (
              <span className="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-500">
                Indisponible
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

