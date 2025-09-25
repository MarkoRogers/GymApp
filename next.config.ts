/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone',
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
