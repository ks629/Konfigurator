import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@nexbe/nexbi'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'konfigurator-tjgo.vercel.app' }],
        destination: 'https://konfigurator.nexbe.pl/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
