'use client'

import {useEffect} from 'react'
import Link from 'next/link'
import {useCartStore} from '@/store/useCartStore'

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-3xl border border-secondary/10 bg-card p-8 text-center shadow-soft sm:p-10">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/60">
            Commande confirmee
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Merci pour votre confiance
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-foreground/75 sm:text-base">
            Votre commande est bien enregistree. Merci de soutenir une consommation
            plus responsable en choisissant des pieces renovees au charme vintage.
            Chaque achat participe a prolonger la vie des objets et a reduire le
            gaspillage.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:brightness-[0.92]"
          >
            Retourner a la boutique
          </Link>
        </section>
      </div>
    </main>
  )
}

