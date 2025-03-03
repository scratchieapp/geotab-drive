module.exports = {
  // Enable API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Ensure we can serve static assets from public
  reactStrictMode: true,
  // Output as a standalone app
  output: 'standalone',
  // Disable unnecessary features
  swcMinify: true,
  // Add webpack configuration to handle @geotab/zenith properly
  webpack: (config, { isServer }) => {
    // Handle CSS, SASS, and less files from @geotab/zenith
    config.module.rules.push({
      test: /\.(css|scss|sass|less)$/,
      use: ['style-loader', 'css-loader'],
    });

    // Handle font and svg files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[hash:8].[ext]',
        },
      },
    });

    return config;
  },
};
