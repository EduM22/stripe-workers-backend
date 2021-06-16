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


export const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Origin': origin
})
