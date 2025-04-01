import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      }
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
