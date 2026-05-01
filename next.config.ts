import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blindscrafter.com",
      },
    ],
  },
};
export default nextConfig;
