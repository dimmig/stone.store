/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      "images.unsplash.com",
      "unsplash.com",
      "images.pexels.com",
      "storage.googleapis.com",
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
};
