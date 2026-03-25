import {NextRequest, NextResponse} from 'next/server'

function unauthorized(realm = 'Secure Area') {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
    },
  })
}

function withNoIndex(res: NextResponse) {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  return res
}

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl

  // Protect Sanity Studio route
  if (
    pathname === '/atelier-7k3p' ||
    pathname.startsWith('/atelier-7k3p/') ||
    pathname === '/studio' ||
    pathname.startsWith('/studio/')
  ) {
    const user = process.env.STUDIO_USER
    const pass = process.env.STUDIO_PASSWORD

    // If not configured, still prevent indexing
    if (!user || !pass) {
      return withNoIndex(unauthorized('Studio'))
    }

    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Basic ')) return withNoIndex(unauthorized('Studio'))

    const base64Credentials = auth.slice('Basic '.length)
    let decoded = ''
    try {
      decoded = atob(base64Credentials)
    } catch {
      return withNoIndex(unauthorized('Studio'))
    }

    const sep = decoded.indexOf(':')
    const givenUser = sep >= 0 ? decoded.slice(0, sep) : ''
    const givenPass = sep >= 0 ? decoded.slice(sep + 1) : ''

    if (givenUser !== user || givenPass !== pass) {
      return withNoIndex(unauthorized('Studio'))
    }

    return withNoIndex(NextResponse.next())
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/atelier-7k3p/:path*', '/studio/:path*'],
}

