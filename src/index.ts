import { Router } from 'itty-router'
import { Stripe } from 'stripe-workers'

const router = Router()

const stripe = new Stripe('')

router.get('/todos', () => new Response('Todos Index!'))

router.post('/create-payment-intent', async request => {
  //@ts-expect-error
  const { currency, paymentMethodType }: { currency: string, paymentMethodType: string } = await request.json()
    // Create a PaymentIntent with the order amount and currency.
    let params = {
      amount: 1999,
      currency,
      payment_method_types: [paymentMethodType],
    };

    // If this is for an ACSS payment, we add payment_method_options to create
    // the Mandate.
    if(paymentMethodType === 'acss_debit') {
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

    try {
      const paymentIntent = await stripe.paymentIntents.create(params);
      return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }))
    } catch (e) {

      return new Response(JSON.stringify({ error: {
        message: e.message,
      } }), { status: 400 })
    }
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
)