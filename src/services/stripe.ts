import { Stripe } from 'stripe-workers'
import {
  CheckoutSessionsResponse,
  PaymentIntentsResponse,
} from 'stripe-workers/dist/types/types'

//@ts-expect-error secret not shown
const stripe = new Stripe(globalThis.STRIPE_SECRET_KEY)

export async function getSession(
  sessionId: string,
): Promise<CheckoutSessionsResponse> {
  return stripe.checkout.sessions.retrieve(sessionId)
}

export async function createSession(): Promise<CheckoutSessionsResponse> {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 1999,
        },
        quantity: 1,
      },
    ],
    //@ts-expect-error secret not shown
    success_url: `${globalThis.DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    //@ts-expect-error secret not shown
    cancel_url: `${globalThis.DOMAIN}/canceled.html`,
  })
}

export async function createPaymentIntent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  params: any,
): Promise<PaymentIntentsResponse> {
  return stripe.paymentIntents.create(params)
}
