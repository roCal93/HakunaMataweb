import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const scriptSrc = [
  "'self'",
  "'unsafe-inline'", // requis pour Next HMR / __NEXT_DATA__
  isDev ? "'unsafe-eval'" : undefined,
].filter(Boolean).join(' ');

const nextConfig: NextConfig = {
  // Optimisations de production
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Optimisations de bundle
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  async headers() {
    const csp = [
      `default-src 'self'`,
      `img-src 'self' https:`,
      `script-src ${scriptSrc}`,
      `style-src 'self' 'unsafe-inline'`,
      `object-src 'none'`,
      `frame-ancestors 'none'`
    ].join('; ');
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Cache-Control pour permettre bfcache
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Pas de cache-control:no-store pour les pages
      {
        source: '/:locale(fr|en)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      }
    ];
  }
};

export default nextConfig;