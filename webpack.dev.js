const path = require("path");
require('babel-polyfill');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = () => {
  return {
      devtool: 'inline-eval-source-map',
      entry: ['babel-polyfill', './src/index.js'], // точки входа
      output: {
          path: path.join(__dirname, "/dist"), // пишем в папку dist
          filename: "index_bundle.js"
      },
      stats: 'errors-warnings',
      module: { //правила для типов файлов
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
          new HtmlWebpackPlugin({ //добавляем скрипты и стили в html
              template: "./src/index.html"
          }),
          new CopyPlugin({ //копируем файлы иконок, манифест и сервис воркер
              patterns: [
                  { from: 'icons', to: path.resolve(__dirname, 'dist', 'icons') },
                  { from: path.resolve(__dirname, 'manifest.json'), to: path.resolve(__dirname, 'dist') },
                  { from: path.resolve(__dirname, 'sw.js'), to: path.resolve(__dirname, 'dist') }
              ]
          })
      ],
      devServer: { //при локальной разработке используем dev server вебпака
          contentBase: path.join(__dirname, 'dist'),
          compress: true,
          port: 8080,
          writeToDisk: true,
          publicPath: "/",
          historyApiFallback: true,
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
              "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
          }
      }
  }
}