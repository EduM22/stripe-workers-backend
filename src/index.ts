import { Router } from 'itty-router'
import checkoutRouter from './routers/checkout'
import customRouter from './routers/custom'

const router = Router()

router.all('/checkout/*', checkoutRouter.handle)
router.all('/custom/*', customRouter.handle)

router.all('*', () => new Response('Not Found.', { status: 404 }))

addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request)),
)
