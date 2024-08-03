import withBundleAnalyzer from "@next/bundle-analyzer"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default bundleAnalyzer(nextConfig)
