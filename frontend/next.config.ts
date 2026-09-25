import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://catalogoperfumes.com/**')],
  },
};

export default nextConfig;
