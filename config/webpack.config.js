var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin   = require('webpack-dashboard/plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    './src/style/main.styl',
    './src/main',
    'webpack-dev-server/client?http://localhost:9000'
  ],
  output: {
      publicPath: 'http://0.0.0.0:9000/',
      filename: 'main.js'
  },
  resolve: {
      // alias: {
      //     'react': 'react-lite',
      //     'react-dom': 'react-lite'
      // }
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
        include: path.join(__dirname, '../src'),
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
        test: /\.(ico|png|jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=[path][name].[ext]' // disable hashing
      },
      {
        test: /\.styl$/,
        loader: 'style!css?sourceMap!autoprefixer!stylus-loader'
      }
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
    hot: true,
    contentBase: "./src"
  }
};
