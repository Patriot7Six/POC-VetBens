import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  experimental: {
    // Next.js 16: experimental.ppr was renamed to cacheComponents
    // This enables Partial Pre-Rendering for instant navigation
    cacheComponents: true,

    // agentDevTools removed — not yet available in this Next.js build
    // Re-add when confirmed stable: https://nextjs.org/docs/app/api-reference/config/next-config-js
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "patriot7six.com" },
    ],
  },

  serverExternalPackages: ["@trigger.dev/sdk"],

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// Sentry is disabled during local dev with Turbopack — it doesn't support it yet.
// It will fully activate in production builds (npm run build).
const isTurbopackDev =
  process.env.npm_lifecycle_script?.includes("--turbopack");

export default isTurbopackDev
  ? nextConfig
  : withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    });
