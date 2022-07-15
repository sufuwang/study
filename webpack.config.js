const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: false,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true,
    open: false
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        // use: ['style-loader', 'css-loader']
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        // use: ['style-loader', 'css-loader']
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'babel-loader',
          //   options: { presets: ['@babel/preset-typescript'] }
          // },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(j|t)sx$/,
        use: 'ts-loader'
      }
      // {
      //   test: /\.(j|t)sx$/,
      //   loader: 'babel-loader',
      //   options: {
      //     presets: [
      //       ['@babel/preset-react', { runtime: 'automatic' }],
      //       '@babel/preset-typescript'
      //     ]
      //   }
      // }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.ts', 'jsx', 'tsx']
    }),
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin({
      template: './public/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages')
    }
  }
};
