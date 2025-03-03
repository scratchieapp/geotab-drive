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
};
