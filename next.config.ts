import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const conNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const configuracionNext: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default conNextIntl(configuracionNext);
