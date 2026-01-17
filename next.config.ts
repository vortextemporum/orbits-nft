import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Cloudflare Pages compatibility
  images: {
    unoptimized: true,
  },

  // Enable experimental features for edge runtime
  experimental: {
    // Allow server actions
  },

  // Headers for CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
        ],
      },
    ];
  },
};

export default nextConfig;
