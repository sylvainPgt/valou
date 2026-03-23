import { sanityFetch } from '@/sanity/lib/live'
import ShopClient from '@/components/ShopClient'

const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    isAvailable,
    "imageUrl": photos[0].asset->url
  }
`

type ProductCard = {
  _id: string
  name: string
  price: number
  isAvailable: boolean
  imageUrl?: string | null
}

export default async function Home() {
  const { data } = (await sanityFetch({
    query: PRODUCTS_QUERY,
    perspective: 'published',
  })) as { data: ProductCard[] }

  const products = data ?? []

  return <ShopClient products={products} />
}
