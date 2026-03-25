import {NextResponse} from 'next/server'
import Stripe from 'stripe'
import {client} from '@/sanity/lib/client'
import {rateLimit} from '@/app/api/_utils/rateLimit'

type CheckoutBody = {
  productIds?: string[]
}

type SanityProduct = {
  _id: string
  name: string
  price: number
  isAvailable?: boolean
  imageUrl?: string | null
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = rateLimit({key: `checkout:${ip}`, limit: 20, windowMs: 60_000})
  if (!rl.ok) {
    return NextResponse.json({error: 'Too many requests.'}, {status: 429})
  }

  if (!stripe) {
    return NextResponse.json(
      {error: 'Missing STRIPE_SECRET_KEY environment variable.'},
      {status: 500},
    )
  }

  let body: CheckoutBody
  try {
    body = (await request.json()) as CheckoutBody
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const productIds = body.productIds ?? []
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json(
      {error: 'productIds is required and must be a non-empty array.'},
      {status: 400},
    )
  }

  const sanitizedIds = productIds.filter(
    (id): id is string => typeof id === 'string' && id.trim().length > 0,
  )
  if (sanitizedIds.length === 0) {
    return NextResponse.json({error: 'No valid product IDs.'}, {status: 400})
  }

  // Quantity comes from repeated IDs in the array; pricing always comes from Sanity.
  const quantityById = sanitizedIds.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1
    return acc
  }, {})
  const uniqueIds = Object.keys(quantityById)

  const products = await client.withConfig({useCdn: false}).fetch<SanityProduct[]>(
    `*[_type == "product" && _id in $ids]{
      _id,
      name,
      price,
      isAvailable,
      "imageUrl": photos[0].asset->url
    }`,
    {ids: uniqueIds},
    {perspective: 'published'},
  )

  if (!products?.length) {
    return NextResponse.json({error: 'No products found.'}, {status: 404})
  }

  const validProducts = products.filter(
    (product) =>
      product.isAvailable !== false &&
      typeof product.price === 'number' &&
      product.price >= 0,
  )
  if (validProducts.length === 0) {
    return NextResponse.json(
      {error: 'No available products for checkout.'},
      {status: 400},
    )
  }

  const requestOrigin = request.headers.get('origin')
  const fallbackOrigin = new URL(request.url).origin
  const baseUrl = requestOrigin ?? fallbackOrigin

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validProducts.map(
    (product) => ({
      quantity: quantityById[product._id] ?? 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          images: product.imageUrl ? [product.imageUrl] : undefined,
        },
      },
    }),
  )

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        productIds: uniqueIds.join(','),
      },
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    })

    return NextResponse.json({url: session.url})
  } catch {
    return NextResponse.json(
      {error: 'Failed to create Stripe checkout session.'},
      {status: 500},
    )
  }
}

