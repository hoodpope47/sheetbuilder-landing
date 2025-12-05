import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: "/logos/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/logos/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
