import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/live'

const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    stripePaymentLink,
    "imageUrl": photos[0].asset->url
  }
`

type ProductCard = {
  _id: string
  name: string
  price: number
  stripePaymentLink: string
  imageUrl?: string | null
}

function formatPrice(price: number) {
  // Affichage simple (sans champ currency dans le schéma)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

export default async function Home() {
  const { data } = (await sanityFetch({
    query: PRODUCTS_QUERY,
    perspective: 'published',
  })) as { data: ProductCard[] }

  const products = data ?? []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nos produits
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-foreground/70 sm:text-base">
            Découvrez notre sélection et achetez en quelques clics.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white px-6 py-10 text-center">
            <p className="text-base font-medium text-foreground">Aucun produit.</p>
            <p className="mt-2 text-sm text-foreground/70">
              Ajoutez des documents `product` dans Sanity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <article
                key={p._id}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  {p.imageUrl ? (
                    // Image en haut de carte
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-zinc-500">
                      Aucune image
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold leading-6 text-foreground">
                      {p.name}
                    </h2>
                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  <a
                    href={p.stripePaymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-background text-sm font-medium transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  >
                    Acheter
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
