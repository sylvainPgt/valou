import {sanityFetch} from '@/sanity/lib/live'
import ProductGrid, {type ProductCard} from '@/components/ProductGrid'

export const dynamic = 'force-dynamic'

const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    isAvailable,
    "imageUrl": photos[0].asset->url
  }
`

export default async function BoutiquePage() {
  const {data} = (await sanityFetch({
    query: PRODUCTS_QUERY,
    perspective: 'published',
  })) as {data: ProductCard[]}

  const products = data ?? []

  return (
    <main className="bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            La Boutique
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
            Des pièces uniques, restaurées avec soin. Ajoutez vos coups de cœur au
            panier et validez en quelques clics.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-secondary/10 bg-card px-6 py-10 text-center shadow-soft">
            <p className="text-base font-medium">Aucun produit pour le moment.</p>
            <p className="mt-2 text-sm text-foreground/70">
              Ajoutez des documents <code>product</code> dans Sanity.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} variant="shop" />
        )}
      </section>
    </main>
  )
}

