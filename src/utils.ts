export function toJSON(data: object, config?: ResponseInit) {
  return new Response(JSON.stringify(data), config)
}
