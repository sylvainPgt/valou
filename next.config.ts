import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity image CDN served by urlFor() (from @sanity/image-url)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
