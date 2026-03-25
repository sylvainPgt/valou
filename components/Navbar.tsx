'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'
import {useCartStore} from '@/store/useCartStore'
import CartDrawer from '@/components/CartDrawer'

const navLinks = [
  {href: '/boutique', label: 'La Boutique'},
  {href: '/demarche', label: "L'Atelier (Ma démarche)"},
  {href: '/galerie', label: 'Réalisations'},
]

export default function Navbar() {
  const pathname = usePathname()
  const [cartOpen, setCartOpen] = useState(false)
  const itemsCount = useCartStore((state) => state.getItemsCount())

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
              V
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Valou Atelier
              </p>
              <p className="text-xs text-foreground/60">
                Rénovation vintage & bois sauvé
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-zinc-50"
          >
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">Panier</span>
            {itemsCount > 0 && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                {itemsCount}
              </span>
            )}
          </button>
        </nav>

        <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-3 md:hidden sm:px-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex-1 rounded-full border px-3 py-2 text-center text-xs font-medium transition',
                  isActive
                    ? 'border-black/10 bg-zinc-900 text-white'
                    : 'border-black/10 bg-white text-foreground/70 hover:text-foreground',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

