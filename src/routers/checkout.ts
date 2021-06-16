import { Router } from 'itty-router'
import { checkOrigin, corsHeaders, toJSON } from '../utils'

import { createSession, getSession } from '../services/stripe'

const router = Router({ base: '/checkout' })

router.get('/config', (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  return toJSON(
    {
      //@ts-expect-error secret not shown
      publishableKey: globalThis.STRIPE_PUBLISHABLE_KEY,
      unitAmount: 1999,
      currency: 'usd',
    },
    {
      headers: corsHeaders(allowedOrigin),
    },
  )
})

router.get('/checkout-session', async (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  try {
    //@ts-expect-error sessionId not found on query obj
    const { sessionId } = req.query

    const session = await getSession(sessionId)
    return toJSON(session, {
      headers: corsHeaders(allowedOrigin),
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
        headers: corsHeaders(allowedOrigin),
      },
    )
  }
})

router.post('/create-checkout-session', async (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  try {
    const { id } = await createSession()

    return toJSON(
      {
        sessionId: id,
      },
      {
        headers: corsHeaders(allowedOrigin),
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
        headers: corsHeaders(allowedOrigin),
      },
    )
  }
})

export default router
