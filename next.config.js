const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid picking a parent lockfile as the workspace root (breaks node_modules resolution in Turbopack).
  turbopack: {
    root: path.join(__dirname),
    // `through2` (pulled in by @sanity/client → get-it) requires 'string_decoder/'
    // with a trailing slash that Turbopack doesn't resolve. Alias the folder
    // specifier to the folder of the real package so the Studio bundles
    // under Turbopack. Turbopack requires both sides to end with '/' when
    // the key ends with '/'.
    resolveAlias: {
      'string_decoder/': 'string_decoder/',
    },
  },
  // Keep the Next cache off iCloud File Provider (this repo lives on Desktop).
  distDir: process.env.NODE_ENV === 'development' ? '.next.nosync' : '.next',
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
