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
  reactStrictMode: false,
  // Output as a standalone app
  output: 'standalone',
  // Disable unnecessary features
  swcMinify: false, // Disable minification to help debug
  // Add webpack configuration to handle @geotab/zenith properly
  transpilePackages: ['@geotab/zenith', 'react-chartjs-2', 'chart.js'],
  // Disable ESLint during build (we'll handle it in development)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add support for CSS
  css: {
    loaderOptions: {
      ignoreWarnings: true, // Ignore CSS warnings
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Handle font and SVG files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    });
    
    // Add externals for window and document
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'window',
        'document',
        'localStorage',
        'sessionStorage'
      ];
    }

    // For client-side, add fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
