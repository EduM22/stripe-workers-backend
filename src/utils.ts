export function toJSON(
  data: Record<string, unknown>,
  config?: ResponseInit,
): Response {
  return new Response(JSON.stringify(data), config)
}

export const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Origin': 'https://stripe-demo.to.rnqvist.com',
}
