import { Router } from 'itty-router'
import { checkOrigin, corsHeaders, toJSON } from '../utils'
import { createPaymentIntent } from '../services/stripe'

const router = Router({ base: '/custom' })

router.get('/config', (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  return toJSON(
    {
      //@ts-expect-error secret not shown
      publishableKey: globalThis.STRIPE_PUBLISHABLE_KEY,
    },
    {
      headers: corsHeaders(allowedOrigin),
    },
  )
})

router.post('/create-payment-intent', async (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  try {
    //@ts-expect-error .json() not on req
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
      //@ts-expect-error ts no like assign
      params.payment_method_options = {
        acss_debit: {
          mandate_options: {
            payment_schedule: 'sporadic',
            transaction_type: 'personal',
          },
        },
      }
    }

    const paymentIntent = await createPaymentIntent(params)

    // Send publishable key and PaymentIntent details to client
    return toJSON(
      {
        clientSecret: paymentIntent.client_secret,
      },
      {
        headers: corsHeaders(allowedOrigin),
      },
    )
  } catch (e) {
    return toJSON(
      {
        error: {
          message: e.message,
        },
      },
      {
        status: 400,
        headers: corsHeaders(allowedOrigin),
      },
    )
  }
})

export default router
