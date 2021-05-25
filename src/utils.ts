export function toJSON(data: object, config?: ResponseInit) {
  return new Response(JSON.stringify(data), config)
}

export const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Origin': 'https://stripe-demo.to.rnqvist.com'
}
