const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  entry: {
    bundle: path.resolve(__dirname, 'src/.dev/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  
  // No devServer for production
  
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
  ],
  
  // Production optimizations
  optimization: {
    minimize: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
    }
  }
}; 