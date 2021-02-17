const path = require("path");
require('babel-polyfill')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {
  return {
    devtool: 'cheap-source-map',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index_bundle.js"
    },
    module: {
      rules: [{
              test: /\.(js|ts)x?$/,
              use: [require.resolve('babel-loader')],
              resolve: { extensions: [".js", ".jsx"] },
              exclude: /node_modules/,
          },
          {
              test: /\.css$/,
              use: ["style-loader", "css-loader", "postcss-loader"]
          },
          {
              test: /\.(png|jpe?g|gif)$/i,
              use: [{
                  loader: 'file-loader',
              }]
          }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyPlugin({
          patterns: [
              { from: 'icons', to: path.resolve(__dirname, 'dist') },
              { from: path.resolve(__dirname, 'manifest.json'), to: path.resolve(__dirname, 'dist') },
              { from: path.resolve(__dirname, 'sw.js'), to: path.resolve(__dirname, 'dist') }
          ]
      })
    ]
  }
}