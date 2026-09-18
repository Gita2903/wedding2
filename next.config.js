const createNextIntlPlugin = require('next-intl/plugin');

// Ini otomatis nyari file src/i18n/request.ts atau i18n/request.ts
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

module.exports = withNextIntl(nextConfig);
