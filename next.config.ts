import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* other config options here */
  // output: "export",  // Removed static export to enable SSR/hybrid mode
};

export default nextConfig;

