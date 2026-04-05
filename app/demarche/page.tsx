import Image from 'next/image'
import Link from 'next/link'

const heroImage =
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80'

export default function DemarchePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
            L&apos;atelier
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ma démarche, du bois sauvé aux finitions saines
          </h1>
          <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            luctus, nunc non fringilla iaculis, arcu nisi vulputate mauris, sed
            vestibulum erat ligula at purus.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/boutique"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:brightness-[0.92]"
            >
              Découvrir la boutique
            </Link>
            <Link
              href="/galerie"
              className="inline-flex h-11 items-center justify-center rounded-full border border-secondary/25 bg-background px-6 text-sm font-medium text-foreground transition hover:bg-card"
            >
              Voir les réalisations
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-secondary/10 bg-secondary/10 shadow-soft">
          <div className="relative aspect-[4/3]">
            <Image
              src={heroImage}
              alt="Atelier, bois et outils"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-secondary/10 bg-card p-8 shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight">Mon Histoire</h2>
            <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              euismod, massa et fermentum volutpat, nisi nisl luctus velit, sed
              convallis neque magna id neque. Integer varius semper felis.
            </p>
          </div>

          <div className="rounded-3xl border border-secondary/10 bg-card p-8 shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight">Mes Engagements</h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70 sm:text-base">
              <li className="flex gap-3">
                <span className="mt-0.5">•</span>
                <span>Lorem ipsum : peintures et finitions plus saines.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5">•</span>
                <span>Lorem ipsum : bois sauvé et matériaux récupérés.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5">•</span>
                <span>Lorem ipsum : réparation avant remplacement.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5">•</span>
                <span>Lorem ipsum : pièces uniques, restaurées avec soin.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

