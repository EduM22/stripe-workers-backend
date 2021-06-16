export function toJSON(
  data: Record<string, unknown>,
  config?: ResponseInit,
): Response {
  return new Response(JSON.stringify(data), config)
}

const allowedOrigins = [
  'https://stripe-workers-frontend.pages.dev',
  'http://localhost:3000',
  'https://stripe-demo.to.rnqvist.com'
]

export const checkOrigin = (request: Request) : string => {
  const origin = request.headers.get("Origin")
  // @ts-expect-error error on allowedOrigin
  const foundOrigin = allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin))
  return foundOrigin ? foundOrigin : allowedOrigins[2]
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Origin': origin
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const requireGlobalSecrets = () => {
  //@ts-expect-error secret not shown
  if (!globalThis.STRIPE_PUBLISHABLE_KEY || !globalThis.DOMAIN || !globalThis.STRIPE_SECRET_KEY) {
    return new Response('Secrets not defined', { status: 500 })
  }
}
