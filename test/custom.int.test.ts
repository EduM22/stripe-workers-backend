/**
 * @jest-environment jsdom
 */

import makeServiceWorkerEnv from 'service-worker-mock'

import router from '../src/routers/custom'

export const testRouter = (request: Request): Promise<Response> => {
  return router.handle(request)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var global: any

describe('/custom - run tests', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('/config - GET : OK', async () => {
    const response = await testRouter(
      new Request('/custom/config', { method: 'GET' }),
    )
    expect(response.status).toEqual(200)
    const data = await response.json()

    expect(data.publishableKey).toEqual(global.STRIPE_PUBLISHABLE_KEY)
  })

  test('/create-payment-intent - POST : OK', async () => {
    const response = await testRouter(
      new Request('/custom/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethodType: 'card',
          currency: 'usd',
        }),
      }),
    )
    expect(response.status).toEqual(200)
  })
})
