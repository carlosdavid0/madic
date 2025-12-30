import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io", // Microlink Image Preview
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com", // AWS S3 (formato: bucket.s3.region.amazonaws.com)
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com", // AWS S3 (formato alternativo)
      },
      {
        protocol: "https",
        hostname: "s3.*.amazonaws.com", // AWS S3 (formato alternativo)
      },
    ],
    unoptimized: false, // Otimização de imagens habilitada
  },
};

export default nextConfig;
