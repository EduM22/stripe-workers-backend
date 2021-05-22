import { Router } from 'itty-router'
import { Stripe } from 'stripe-workers'
import { toJSON } from '../utils'

const router = Router({ base: '/checkout' })

const stripe = new Stripe(STRIPE_SECRET_KEY)

router.get('/config', () => {
  toJSON({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    unitAmount: 1999,
    currency: 'usd',
  })
})

router.get('/checkout-session', async (req) => {
  //@ts-expect-error
  const { sessionId } = req.query

  console.log(sessionId)

  //const session = await stripe.checkout.sessions.retrieve(sessionId);
  return toJSON({
    id: 'hello',
  })
})

router.post('/create-checkout-session', async (req) => {
  // Create new Checkout Session for the order
  // Other optional params include:
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'aaa'],
    mode: 'payment',
    line_items: [
      {
        amount: 1999,
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}/canceled.html`,
  })

  return toJSON({
    sessionId: session.id,
  })
})

export default router
