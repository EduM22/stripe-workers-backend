import { Router } from 'itty-router'
import { corsHeaders, toJSON } from '../utils'

import { createSession, getSession } from '../services/stripe'

const router = Router({ base: '/checkout' })

router.get('/config', () => {
  return toJSON(
    {
      //@ts-expect-error secret not shown
      publishableKey: globalThis.STRIPE_PUBLISHABLE_KEY,
      unitAmount: 1999,
      currency: 'usd',
    },
    {
      headers: corsHeaders,
    },
  )
})

router.get('/checkout-session', async (req) => {
  try {
    //@ts-expect-error sessionId not found on query obj
    const { sessionId } = req.query

    const session = await getSession(sessionId)
    return toJSON(session, {
      headers: corsHeaders,
    })
  } catch (e) {
    return toJSON(
      {
        error: {
          message: e.message,
        },
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})

router.post('/create-checkout-session', async () => {
  try {
    const { id } = await createSession()

    return toJSON(
      {
        sessionId: id,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (e) {
    console.log(e)
    return toJSON(
      {
        error: {
          message: e.message,
        },
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})

export default router
