import { Router } from 'itty-router'
import { Stripe } from 'stripe-workers'
import { corsHeaders, toJSON } from '../utils'

const router = Router({ base: '/custom' })

const stripe = new Stripe(STRIPE_SECRET_KEY)

router.get('/config', (req) => {
  return toJSON({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  }, {
    headers: corsHeaders
  })
})

router.post('/create-payment-intent', async (req) => {
  //@ts-expect-error
  const { paymentMethodType, currency } = await req.json()

  // Each payment method type has support for different currencies. In order to
  // support many payment method types and several currencies, this server
  // endpoint accepts both the payment method type and the currency as
  // parameters.
  //
  // Some example payment method types include `card`, `ideal`, and `alipay`.
  const params = {
    payment_method_types: [paymentMethodType],
    amount: 1999,
    currency: currency,
  }

  // If this is for an ACSS payment, we add payment_method_options to create
  // the Mandate.
  if (paymentMethodType === 'acss_debit') {
    //@ts-expect-error
    params.payment_method_options = {
      acss_debit: {
        mandate_options: {
          payment_schedule: 'sporadic',
          transaction_type: 'personal',
        },
      },
    }
  }

  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  try {
    const paymentIntent = await stripe.paymentIntents.create(params)

    // Send publishable key and PaymentIntent details to client
    return toJSON({
      clientSecret: paymentIntent.client_secret,
    }, {
      headers: corsHeaders
    })
  } catch (e) {
    return toJSON(
      {
        error: {
          message: e.message,
        },
      },
      { status: 400 },
    )
  }
})

export default router
