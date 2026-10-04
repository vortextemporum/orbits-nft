import { createMiddleware, createStart } from '@tanstack/react-start'

// Security headers for everything the Worker renders (static assets get
// theirs from public/_headers).
const securityHeaders = createMiddleware().server(async ({ next, pathname }) => {
  const result = await next()
  const { headers } = result.response
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // /generator/* must stay embeddable: marketplaces load it as animation_url
  // in an iframe. Nothing else should be framed by other sites.
  if (!pathname.startsWith('/generator/')) {
    headers.set('Content-Security-Policy', "frame-ancestors 'self'")
  }
  return result
})

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaders],
}))
