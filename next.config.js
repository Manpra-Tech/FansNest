const path = require('path');

const siteUrl = process.env.SITE_URL || (process.env.DOMAIN ? `https://${process.env.DOMAIN}` : '');
const apiEndpoint = process.env.API_ENDPOINT || process.env.API_SERVER_ENDPOINT || (siteUrl ? `${siteUrl}/api` : 'http://localhost:4612');

/**
 * @type { import('next').NextConfig }
 */
const nextConfig = {
  compress: true,
  // react 18 about strict mode https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  reactStrictMode: false,
  distDir: '.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  images: {
    minimumCacheTTL: 300,
    remotePatterns: [{
        protocol: 'https',
        hostname: `**.${process.env.DOMAIN}`
      },
      {
        protocol: 'https',
        hostname: '**.xscripts.info'
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com'
      }
    ],
    domains: ['localhost']
  },
  rewrites() {
    return {
      afterFiles: [{
        // default landing page is login page
        source: '/',
        destination: '/auth/login'

      }]
    };
  },
  optimizeFonts: true,
  poweredByHeader: false,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: process.env.API_SERVER_ENDPOINT || apiEndpoint
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: apiEndpoint,
    MAX_SIZE_IMAGE: process.env.MAX_SIZE_IMAGE || 5,
    MAX_SIZE_FILE: process.env.MAX_SIZE_FILE || 100,
    MAX_SIZE_TEASER: process.env.MAX_SIZE_TEASER || 200,
    MAX_SIZE_VIDEO: process.env.MAX_SIZE_VIDEO || 2000,
    HASH_PW_CLIENT: process.env.HASH_PW_CLIENT || true,
    DOMAIN: process.env.DOMAIN || (siteUrl ? new URL(siteUrl).hostname : 'localhost'),
    SITE_URL: siteUrl || 'http://localhost:4610'
  }
};

module.exports = nextConfig;
