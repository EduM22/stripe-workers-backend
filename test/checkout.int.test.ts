/**
 * @jest-environment jsdom
 */

import makeServiceWorkerEnv from 'service-worker-mock'

import router from '../src/routers/checkout'

export const testRouter = (request: Request): Promise<Response> => {
  return router.handle(request)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var global: any

let SESSION_ID = ''

describe('/checkout - run tests', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('/config - GET : OK', async () => {
    const response = await testRouter(
      new Request('/checkout/config', { method: 'GET' }),
    )
    expect(response.status).toEqual(200)
    const data = await response.json()

    expect(data.publishableKey).toEqual(global.STRIPE_PUBLISHABLE_KEY)
    expect(data.unitAmount).toEqual(1999)
    expect(data.currency).toEqual('usd')
  })

  test('/checkout-session - GET : FAIL NOT FOUND', async () => {
    const response = await testRouter(
      new Request('/checkout/checkout-session?sessionId=1', { method: 'GET' }),
    )
    expect(response.status).toEqual(400)
    const data = await response.json()

    expect(data.error.message).toEqual('Invalid checkout.session id: 1')
  })

  test('/create-checkout-session - POST : OK', async () => {
    const response = await testRouter(
      new Request('/checkout/create-checkout-session', { method: 'POST' }),
    )
    expect(response.status).toEqual(200)
    const data = await response.json()

    SESSION_ID = data.sessionId
  })

  test('/checkout-session - GET : OK', async () => {
    const response = await testRouter(
      new Request(`/checkout/checkout-session?sessionId=${SESSION_ID}`, {
        method: 'GET',
      }),
    )
    expect(response.status).toEqual(200)
    const data = await response.json()

    expect(data.amount_total).toEqual(1999)
    expect(data.currency).toEqual('usd')
  })
})
