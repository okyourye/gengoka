import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pagesのサブディレクトリに対応
  basePath: isProd ? '/gengoka' : '',
  // Static Exportでは画像最適化が効かないため無効化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
