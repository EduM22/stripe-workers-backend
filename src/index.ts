import { Router } from 'itty-router'
import checkoutRouter from './routers/checkout'
import customRouter from './routers/custom'
import { corsHeaders } from './utils'

const router = Router()

router.options('*', () => {
  return new Response('', {
    headers: corsHeaders
  })
})

router.all('/checkout/*', checkoutRouter.handle)
router.all('/custom/*', customRouter.handle)

router.all('*', () => new Response('Not Found.', { 
  status: 404,
  headers: corsHeaders
}))

addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request)),
)
