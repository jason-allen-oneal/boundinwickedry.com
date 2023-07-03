/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    const webpack = require("webpack");

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g|png|jpe?g|gif|svg|mp4)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('file-loader'),
          options: {
            limit: config.inlineImageLimit,
            publicPath: `_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
  reactStrictMode: false,
  images: { disableStaticImages: true }
};

module.exports = nextConfig;
