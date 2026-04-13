import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    // Avoid flaky dev bundler / ENOENT on .next after env reloads or interrupted builds (PackFileCacheStrategy).
    if (dev) {
      config.cache = false;
    }
    const alias = config.resolve?.alias;
    if (alias && typeof alias === "object" && !Array.isArray(alias)) {
      Object.assign(alias, {
        "framer-motion": path.join(
          process.cwd(),
          "node_modules/framer-motion/dist/cjs/index.js"
        ),
        "dequal/lite": path.join(
          process.cwd(),
          "node_modules/dequal/dist/index.js"
        ),
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
