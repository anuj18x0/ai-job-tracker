import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // If BACKEND_URL isn't explicitly set, fallback to localhost:5000 for local dev proxy
    const destination = process.env.NEXT_PUBLIC_BACKEND_URL;
    return [
      {
        source: '/api/:path*',
        destination: `${destination}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
