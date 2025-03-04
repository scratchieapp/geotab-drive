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
  // Disable ESLint during build (we'll handle it in development)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure pages to use client-side rendering
  experimental: {
    // This will make all pages client-side rendered by default
    runtime: 'edge',
  },
  webpack: (config, { isServer }) => {
    // Handle font and SVG files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    });

    // Handle CSS warnings
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            // Suppress CSS warnings
            ignoreWarnings: true,
          },
        },
      ],
    });

    // Handle window is not defined error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        os: false,
        url: false,
        assert: false,
        buffer: false,
        process: false,
        util: false,
      };
    }

    // Add externals for client-side only modules
    if (isServer) {
      config.externals = [...(config.externals || []), 'window'];
    }

    return config;
  },
};

module.exports = nextConfig;
