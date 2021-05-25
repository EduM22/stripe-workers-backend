import { Router } from 'itty-router'
import { Stripe } from 'stripe-workers'
import { corsHeaders, toJSON } from '../utils'

const router = Router({ base: '/checkout' })

//@ts-expect-error
const stripe = new Stripe(globalThis.STRIPE_SECRET_KEY)

router.get('/config', () => {
  return toJSON({
    //@ts-expect-error
    publishableKey: globalThis.STRIPE_PUBLISHABLE_KEY,
    unitAmount: 1999,
    currency: 'usd',
  }, {
    headers: corsHeaders
  })
})

router.get('/checkout-session', async (req) => {
  //@ts-expect-error
  const { sessionId } = req.query

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return toJSON(session, {
    headers: corsHeaders
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
  }, {
    headers: corsHeaders
  })
})

export default router
