/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "storage.googleapis.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  distDir: ".next",
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  webpack: (config, { isServer }) => {
    // Disable all warnings
    config.ignoreWarnings = [/.*/];
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  // Disable static optimization
  staticPageGenerationTimeout: 1000,
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  reactStrictMode: false,
  swcMinify: false,
  trailingSlash: true,
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  assetPrefix: "",
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig
