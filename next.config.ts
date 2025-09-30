import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export and Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // React configuration
  reactStrictMode: true,
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Skip API routes during static export
  generateBuildId: async () => {
    return 'static-build-' + Date.now();
  },
};

export default nextConfig;
