/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убираем статический экспорт для поддержки API роутов
  // output: 'export',
  // distDir: 'out',

  // Оптимизация бандла
  experimental: {},

  // Сжатие
  compress: true,

  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },

  // Оптимизация для продакшена
  poweredByHeader: false,

  // TypeScript конфигурация - исключаем cloudflare-worker
  typescript: {
    ignoreBuildErrors: false,
  },

  // Webpack оптимизации
  webpack: (config, { dev }) => {
    // Исключаем папку cloudflare-worker из обработки
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/cloudflare-worker/**'],
    };

    // Исключаем cloudflare-worker из TypeScript проверки
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /cloudflare-worker/,
      use: 'ignore-loader',
    });

    if (!dev) {
      // Оптимизация для продакшена
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
