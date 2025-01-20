import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // For deployments under a subpath
  basePath: "/f2expert",
  assetPrefix: "/f2expert",
};

export default nextConfig;
