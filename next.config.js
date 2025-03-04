/** @type {import('next').NextConfig} */
const nextConfig = {
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
  transpilePackages: ['@geotab/zenith'],
  webpack: (config) => {
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

    // Handle CSS files
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
