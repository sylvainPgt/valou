import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import ProductGrid, {type ProductCard} from '@/components/ProductGrid'

export const dynamic = 'force-dynamic'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1800&q=80'

const PREVIEW_PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc)[0...4] {
    _id,
    name,
    "slug": slug.current,
    price,
    isAvailable,
    "imageUrl": photos[0].asset->url
  }
`

export default async function HomePage() {
  const {data} = (await sanityFetch({
    query: PREVIEW_PRODUCTS_QUERY,
    perspective: 'published',
  })) as {data: ProductCard[]}

  const products = data ?? []

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Atelier et bois"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs uppercase tracking-[0.25em] text-white/80">
            Artisanat • rénovation vintage • pièces uniques
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            La seconde vie des meubles oubliés
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Une boutique d&apos;artisanat dédiée au bois sauvé, aux finitions soignées et
            aux objets qui traversent le temps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/boutique"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:brightness-[0.92]"
            >
              Explorer la boutique
            </Link>
            <Link
              href="/demarche"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Découvrir ma démarche
            </Link>
          </div>
        </div>
      </section>

      {/* Aperçu boutique */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Aperçu Boutique
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
              Quelques pièces du moment — chaque restauration est unique.
            </p>
          </div>
          <Link
            href="/boutique"
            className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
          >
            Voir toute la boutique
          </Link>
        </div>

        <div className="mt-8">
          <ProductGrid products={products} variant="preview" />
        </div>
      </section>

      {/* Philosophie */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-secondary/10 bg-card p-10 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
              Ma philosophie
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Restaurer, préserver, transmettre
            </h2>
            <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
              Des peintures plus saines, du bois sauvé, des finitions durables — et
              surtout le respect des matériaux. Découvrez la démarche derrière
              chaque pièce.
            </p>
            <div className="mt-7">
              <Link
                href="/demarche"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:brightness-[0.92]"
              >
                Lire la démarche
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-secondary/10 bg-secondary/10 shadow-soft">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80"
                alt="Matières et artisanat"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
