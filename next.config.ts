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
}

export default bundleAnalyzer(nextConfig)
