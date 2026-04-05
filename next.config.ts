import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/dog/**',
      },
    ],
  },
}

export default nextConfig
