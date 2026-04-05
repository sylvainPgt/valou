import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page introuvable
        </h1>
        <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
          La page demandée n&apos;existe pas ou a été déplacée. Vérifiez l&apos;adresse
          ou revenez à l&apos;accueil.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:brightness-[0.92]"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/boutique"
            className="inline-flex h-11 items-center justify-center rounded-full border border-secondary/30 bg-background px-6 text-sm font-medium text-foreground transition hover:bg-card"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    </main>
  )
}
