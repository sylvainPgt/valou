'use client'

import {useMemo, useState} from 'react'
import Image from 'next/image'
import {useCartStore} from '@/store/useCartStore'

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(price)
}

export default function CartDrawer({open, onClose}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotalAmount = useCartStore((state) => state.getTotalAmount)

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
      alert(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la validation du panier.',
      )
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex">
      <button
        type="button"
        aria-label="Fermer le panier"
        className="h-full w-full bg-black/40"
        onClick={onClose}
      />

      <aside className="relative h-full w-full max-w-md border-l border-black/10 bg-white shadow-xl text-gray-900">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="text-lg font-semibold">Votre panier</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/10 px-3 py-1 text-sm hover:bg-zinc-50"
            >
              Fermer
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <p className="text-sm text-gray-700">Votre panier est vide.</p>
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
                      <p className="text-sm text-gray-700">
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
              <span className="text-gray-700">Total</span>
              <span className="text-lg font-semibold text-gray-900">{formatPrice(totalAmount)}</span>
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
  )
}

