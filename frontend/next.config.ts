import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },
};

export default nextConfig;
