/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: process.env.ENVIRONMENT,
};

module.exports = nextConfig;
