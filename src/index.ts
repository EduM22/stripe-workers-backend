import { Router } from 'itty-router'
import checkoutRouter from './routers/checkout'
import customRouter from './routers/custom'
import { checkOrigin, corsHeaders, requireGlobalSecrets } from './utils'

const router = Router()

router.options('*', (req) => {
  // @ts-expect-error error on req
  const allowedOrigin = checkOrigin(req)
  return new Response('', {
    headers: corsHeaders(allowedOrigin),
  })
})

router.all('/checkout/*', requireGlobalSecrets,  checkoutRouter.handle)
router.all('/custom/*', requireGlobalSecrets, customRouter.handle)

router.all(
  '*',
  (req) => {
    // @ts-expect-error error on req
    const allowedOrigin = checkOrigin(req)
    return new Response('Not Found.', {
      status: 404,
      headers: corsHeaders(allowedOrigin),
    })
  }
)

addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request)),
)
