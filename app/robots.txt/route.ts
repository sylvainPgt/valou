export async function GET() {
  const body = [
    'User-agent: *',
    'Disallow: /studio',
    'Disallow: /atelier-7k3p',
    'Disallow: /api',
    'Allow: /',
    '',
    'Sitemap: /sitemap.xml',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Cache a bit but keep it flexible during development
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

