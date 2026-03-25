import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import ProductDetailClient from '@/components/ProductDetailClient'

type ProductDetail = {
  _id: string
  name: string
  price: number
  isAvailable: boolean
  description: string
  dimensions?: {
    width?: number
    height?: number
    depth?: number
  } | null
  photos?: {url: string}[] | null
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

const PRODUCT_QUERY = /* groq */ `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    price,
    isAvailable,
    description,
    dimensions{width,height,depth},
    "photos": photos[]{ "url": asset->url }
  }
`

export default async function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const {data} = (await sanityFetch({
    query: PRODUCT_QUERY,
    params: {slug},
    perspective: 'published',
  })) as {data: ProductDetail | null}

  if (!data) notFound()

  const photos = data.photos?.filter((p) => Boolean(p?.url)) ?? []
  const heroImage = photos[0]?.url

  return (
    <main className="bg-background text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href="/boutique"
            className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
          >
            ← Retour à la boutique
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-zinc-100 shadow-sm">
              <div className="relative aspect-[4/3]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={data.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
                    Aucune image
                  </div>
                )}
              </div>
            </div>

            {photos.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {photos.slice(0, 4).map((p) => (
                  <div
                    key={p.url}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-black/5 bg-zinc-100"
                  >
                    <Image
                      src={p.url}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 25vw, 10vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
                Produit
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {data.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatPrice(data.price)}
                </p>
                {data.isAvailable ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Disponible
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    Indisponible
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
              <ProductDetailClient
                product={{
                  _id: data._id,
                  name: data.name,
                  price: data.price,
                  isAvailable: data.isAvailable,
                  imageUrl: heroImage ?? null,
                }}
                photos={photos}
              />
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm text-gray-900">
              <h2 className="text-base font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 sm:text-base">
                {data.description}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm text-gray-900">
              <h2 className="text-base font-semibold">Dimensions</h2>
              <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-2xl border border-black/5 bg-zinc-50 px-4 py-3">
                  <dt className="text-gray-600">Largeur</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {data.dimensions?.width ?? '—'}{' '}
                    {typeof data.dimensions?.width === 'number' ? 'cm' : ''}
                  </dd>
                </div>
                <div className="rounded-2xl border border-black/5 bg-zinc-50 px-4 py-3">
                  <dt className="text-gray-600">Hauteur</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {data.dimensions?.height ?? '—'}{' '}
                    {typeof data.dimensions?.height === 'number' ? 'cm' : ''}
                  </dd>
                </div>
                <div className="rounded-2xl border border-black/5 bg-zinc-50 px-4 py-3">
                  <dt className="text-gray-600">Profondeur</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {data.dimensions?.depth ?? '—'}{' '}
                    {typeof data.dimensions?.depth === 'number' ? 'cm' : ''}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs text-gray-600">
                Astuce : tu peux renseigner ces valeurs dans Sanity (cm).
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

