import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wyłącz ESLint i TypeScript errors podczas buildu na Vercel
  // (lokalnie nadal działają przez npm run lint / tsc)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
