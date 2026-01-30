import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  basePath: '/studybuddy_v2',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
