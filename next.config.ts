import type { NextConfig } from 'next';
import path from 'node:path';
import { API_HOST } from './src/5_shared/api/const';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@/features'] = path.resolve(__dirname, 'src/3_features');
    config.resolve.alias['@/shared'] = path.resolve(__dirname, 'src/5_shared');
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  sassOptions: {
    additionalData: `
      @use "${path.resolve(__dirname, 'src/5_shared/ds')}" as ds;
      @use "${path.resolve(__dirname, 'src/5_shared/lib')}/style-utils" as utils;
    `
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      new URL(`${API_HOST}/static/**`),
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  /**
   * С turbopack не работает 
   */
  // sassOptions: {
  //   additionalData: `
  //     @use "@ds" as ds;
  //     @use "@ds/colors/primitives" as colorPrimitives;
  //     @use "@lib/style-utils" as utils;
  //   `
  // },
  // webpack: (config, { isServer }) => {
  //   config.resolve.alias['@ds'] = path.resolve(__dirname, 'src/5_shared/ds');
  //   config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/5_shared/lib');
  //   return config;
  // },
};

export default nextConfig;
