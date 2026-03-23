import {NextResponse} from 'next/server'
import Stripe from 'stripe'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '@/sanity/env'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const sanityWriteToken = process.env.SANITY_WRITE_TOKEN

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    })
  : null

const sanityWriteClient = sanityWriteToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: sanityWriteToken,
    })
  : null

export async function POST(request: Request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json(
      {error: 'Missing Stripe webhook configuration.'},
      {status: 500},
    )
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      {error: 'Missing SANITY_WRITE_TOKEN environment variable.'},
      {status: 500},
    )
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json(
      {error: 'Missing Stripe signature header.'},
      {status: 400},
    )
  }

  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret,
    )
  } catch {
    return NextResponse.json({error: 'Invalid webhook signature.'}, {status: 400})
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const productIdsString = session.metadata?.productIds ?? ''
    const productIds = productIdsString
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0)

    if (productIds.length > 0) {
      const uniqueIds = [...new Set(productIds)]
      const transaction = sanityWriteClient.transaction()

      for (const productId of uniqueIds) {
        transaction.patch(productId, {
          set: {isAvailable: false},
        })
      }

      await transaction.commit()
    }
  }

  return NextResponse.json({received: true})
}

