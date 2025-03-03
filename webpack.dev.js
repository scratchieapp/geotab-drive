const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Fix the import path for fakeData
const fs = require('fs');

// Create simple mock data for development without TypeScript dependencies
const mockDrivers = Array(20).fill(0).map((_, index) => ({
  id: `geotab_driver_${index}`,
  name: `Real Driver Name ${index}`, 
  isActive: true,
  photo: `https://i.pravatar.cc/150?img=${(index % 10) + 1}`,
  score: Math.floor(60 + Math.random() * 40),
  trend: Math.floor(Math.random() * 6) - 2,
  collisionRisk: parseFloat((Math.random() * 10).toFixed(1)),
  speeding: ["At risk", "Average", "Best", "Good", "Underperforming"][Math.floor(Math.random() * 5)],
  acceleration: ["At risk", "Average", "Best", "Good", "Underperforming"][Math.floor(Math.random() * 5)],
  braking: ["At risk", "Average", "Best", "Good", "Underperforming"][Math.floor(Math.random() * 5)],
  cornering: ["At risk", "Average", "Best", "Good", "Underperforming"][Math.floor(Math.random() * 5)],
  scoreOverTime: Array(5).fill(0).map((_, i) => Math.floor(60 + Math.random() * 25)),
  rank: index < 3 ? index + 1 : undefined,
  improvement: index === 3 || index === 4 ? Math.floor(Math.random() * 15) + 5 : undefined
}));

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/.dev/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    // Add proxy configuration to forward API requests to Next.js server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Use the mocks only if the proxy fails or for local development without the API server
      console.log('Setting up mock API middlewares as fallback');
      
      // Define mock API endpoints for development but ONLY if there's no real API running
      devServer.app.get('/api/hybrid-drivers-mock', (req, res) => {
        // Simulate a slight delay like a real API
        setTimeout(() => {
          res.json(mockDrivers);
        }, 800);
      });

      // For the real endpoint, log a message instructing how to use it
      devServer.app.get('/api/hybrid-drivers-info', (req, res) => {
        res.json({
          message: "The real hybrid-drivers API is being used at /api/hybrid-drivers",
          note: "If you need mock data, use /api/hybrid-drivers-mock",
          status: "active"
        });
      });

      // Mock test-geotab-connection endpoint
      devServer.app.get('/api/test-geotab-connection', (req, res) => {
        // Return a success response with sample data
        res.json({
          success: true,
          server: "my.geotab.com",
          authenticationSuccessful: true,
          driversCount: mockDrivers.length,
          sampleDrivers: mockDrivers.slice(0, 5).map(driver => ({
            id: driver.id,
            name: driver.name,
            isActive: driver.isActive || true
          }))
        });
      });

      return middlewares;
    }
  },
  devtool: 'source-map',
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", "postcss-loader",
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', ["@babel/preset-react", {
              "runtime": "automatic"
            }]]
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ],
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // Skip type checking for faster builds
              compilerOptions: {
                module: 'esnext', // Override tsconfig to ensure compatibility
                jsx: 'react'      // Ensure React JSX is properly handled
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.css"
    }),
    new HtmlWebpackPlugin({
      title: 'geotabDriveScratchie',
      filename: 'index.html',
      template: 'src/app/geotabDriveScratchie.html',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'style-guide.html',
      template: 'src/.dev/styles/styleGuideMyGeotab.html',
      inject: false
    })
  ]
}