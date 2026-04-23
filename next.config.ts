import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder imagery from Unsplash during Phase 1C/1D/1E until real
    // assets drop into _assetdump/ and get sorted to public/ in Phase 1H.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
