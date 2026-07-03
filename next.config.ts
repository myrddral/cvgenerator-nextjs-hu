import type { NextConfig } from 'next'
import withBundleAnalyzer from "@next/bundle-analyzer"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
  typedRoutes: true,
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

export default bundleAnalyzer(nextConfig)
