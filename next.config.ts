import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vihpclpbkwveikawfkkr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
