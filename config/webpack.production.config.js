var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    'babel-polyfill',
    './src/style/main.styl',
    './src/main'
  ],
  output: {
      path: path.join(__dirname, '../dist/'),
      publicPath: '/',
      filename: 'main.js'
  },
  debug: false,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: "pug-html-loader"
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src'),
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'react'
          ]
        }
      },
      {
        test: /\.(png|jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=./asset/[hash].[ext]' // disable hashing
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract("css!autoprefixer!stylus-loader")
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('style.css')
  ],
  devServer: {
    contentBase: "./src"
  }
};
