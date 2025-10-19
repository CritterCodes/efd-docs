/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb'],
  images: {
    domains: [
      'localhost',
      'efd-docs.vercel.app',
      'efd-docs.engelfineredesign.com'
    ]
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3002',
    ECOSYSTEM_VERSION: process.env.ECOSYSTEM_VERSION || '1.0.0'
  }
}

module.exports = nextConfig