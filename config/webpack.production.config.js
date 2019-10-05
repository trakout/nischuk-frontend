const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: [
    // '@babel/polyfill', Nope, include @ top of entrypoint
    './src/style/main.styl',
    './src/main'
  ],
  output: {
      path: path.join(__dirname, '../dist/'),
      publicPath: '/',
      filename: 'main.js'
  },
  resolve: {
      alias: {
          'react': 'react-lite',
          'react-dom': 'react-lite'
      }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: ['raw-loader', 'pug-html-loader']
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.(ico|png|jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: [ path.resolve(__dirname + '/../src/asset/img/inline') ],
        loader: 'file-loader?name=[path][name].[ext]' // disable hashing
      },
      {
        test: /\.svg$/, 
        include: [ path.resolve(__dirname + '/../src/asset/img/inline') ],
        loader: 'svg-inline-loader'
      },
      {
        test: /\.styl$/,
        loader: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false,
            },
          },
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
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
    new webpack.optimize.AggressiveMergingPlugin(),
    // new ExtractTextPlugin('style.css'),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$|\.png$|\.jpg$|\.html$/,
        threshold: 1000,
        minRatio: 0.8
    })
  ],
  devServer: {
    contentBase: "./src"
  }
};
