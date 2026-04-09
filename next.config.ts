import type { NextConfig } from "next";

// Note: withSentryConfig removed — Sentry does not yet support Turbopack,
// which is the default bundler in Next.js 16. Wrapping with withSentryConfig
// injects a webpack config that conflicts with Turbopack and fails the build.
// Re-add once https://github.com/getsentry/sentry-javascript/issues/8105 is resolved.

const nextConfig: NextConfig = {
  // Next.js 16: cacheComponents enables Partial Pre-Rendering
  cacheComponents: true,

  // Required: tells Next.js the Turbopack usage is intentional.
  // Without this, any webpack config (e.g. from plugins) causes a hard build error.
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "patriot7six.com" },
    ],
  },

  serverExternalPackages: ["@trigger.dev/sdk"],

  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
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

export default nextConfig;
