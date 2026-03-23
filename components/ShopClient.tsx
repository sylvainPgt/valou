'use client'

import {useMemo, useState} from 'react'
import Image from 'next/image'
import {useCartStore} from '@/store/useCartStore'

type ProductCard = {
  _id: string
  name: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

type ShopClientProps = {
  products: ProductCard[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function ShopClient({products}: ShopClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const getItemsCount = useCartStore((state) => state.getItemsCount)
  const getTotalAmount = useCartStore((state) => state.getTotalAmount)

  const itemsCount = getItemsCount()
  const totalAmount = getTotalAmount()
  const productIds = useMemo(
    () =>
      items.flatMap((item) =>
        Array.from({length: item.quantity}, () => item.id),
      ),
    [items],
  )

  async function handleCheckout() {
    if (productIds.length === 0 || isCheckingOut) return

    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productIds}),
      })

      if (!response.ok) {
        throw new Error('Impossible de créer la session de paiement.')
      }

      const data = (await response.json()) as {url?: string}
      if (!data.url) {
        throw new Error('URL de paiement introuvable.')
      }

      window.location.href = data.url
    } catch (error) {
      // Minimal feedback without blocking UX
      alert(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la validation du panier.',
      )
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
              Catalogue
            </p>
            <h1 className="text-lg font-semibold sm:text-2xl">Boutique</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50"
          >
            <span aria-hidden>🛒</span>
            Panier
            {itemsCount > 0 && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-16 sm:px-6">
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
        )}
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <button
            type="button"
            aria-label="Fermer le panier"
            className="h-full w-full bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <aside className="relative h-full w-full max-w-md border-l border-black/10 bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                <h2 className="text-lg font-semibold">Votre panier</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-black/10 px-3 py-1 text-sm hover:bg-zinc-50"
                >
                  Fermer
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="text-sm text-foreground/70">
                    Votre panier est vide.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-black/5 p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="text-sm text-foreground/70">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-black/5 px-5 py-4">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    disabled={items.length === 0 || isCheckingOut}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Vider
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isCheckingOut}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCheckingOut ? 'Chargement...' : 'Valider la commande'}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

