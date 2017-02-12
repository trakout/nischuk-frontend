var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin   = require('webpack-dashboard/plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/theme/main.styl',
    './src/main',
    'webpack-dev-server/client?http://localhost:9000'
  ],
  output: {
      publicPath: '/',
      filename: 'main.js'
  },
  debug: true,
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: "pug-html-loader"
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'react',
            'react-hmre'
          ]
        }
      },
      {
        test: /\.styl$/,
        loader: "style!css!autoprefixer!stylus-loader"
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new DashboardPlugin()
  ],
  devServer: {
    contentBase: "./src"
  }
};
