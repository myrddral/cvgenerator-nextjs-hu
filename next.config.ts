import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"
import createNextIntlPlugin from "next-intl/plugin"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
  typedRoutes: true,
  images: {
    // CV profile pictures are served from Convex file storage.
    remotePatterns: [{ protocol: "https", hostname: "**.convex.cloud" }],
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default withNextIntl(bundleAnalyzer(nextConfig))
