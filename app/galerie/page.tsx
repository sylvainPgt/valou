import Image from 'next/image'
import Link from 'next/link'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80',
    alt: 'Bois restauré et finition mate',
  },
  {
    src: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80',
    alt: 'Détail de meuble rénové',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
    alt: 'Atelier et matières',
  },
  {
    src: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80',
    alt: 'Texture de bois et lumière',
  },
  {
    src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Outils et savoir-faire',
  },
  {
    src: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Ambiance artisanat',
  },
]

export default function GaleriePage() {
  return (
    <main className="bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Réalisations
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
            Un portfolio visuel des plus belles restaurations — indépendamment de
            la vente.
          </p>
          <div className="pt-2">
            <Link
              href="/demarche"
              className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
            >
              Découvrir ma démarche
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <figure
              key={img.src}
              className="group overflow-hidden rounded-3xl border border-secondary/10 bg-card shadow-soft"
            >
              <div className="relative aspect-[4/3] bg-secondary/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="px-5 py-4 text-sm text-foreground/70">
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}

