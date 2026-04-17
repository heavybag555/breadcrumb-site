const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid picking a parent lockfile as the workspace root (breaks node_modules resolution in Turbopack).
  turbopack: {
    root: path.join(__dirname),
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

module.exports = nextConfig
