import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 2: Docker self-hosted deploy. "standalone" emits a minimal
  // runtime bundle (.next/standalone/server.js) that the Dockerfile
  // copies into the runtime image.
  output: "standalone",
};

export default nextConfig;
