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
    // Handle font and SVG files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

module.exports = nextConfig;
