import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@local-business-ai/shared"],
};

export default nextConfig;
