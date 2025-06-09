import type { NextConfig } from 'next';
import path from 'node:path';
import { HOST } from '@/shared/api/const';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `
      @use "${path.resolve(__dirname, 'src/5_shared/ds')}" as ds;
      @use "${path.resolve(__dirname, 'src/5_shared/lib')}/style-utils" as utils;
    `
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '194.226.121.220',
        port: '8020',
        pathname: '/**',
      },
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
