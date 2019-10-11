let path              = require('path');
let webpack           = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let DashboardPlugin   = require('webpack-dashboard/plugin');

const PORT = 9000;

module.exports = {
  mode: 'development',
  entry: [
    './src/style/main.styl',
    './src/main'
  ],
  output: {
      // publicPath: 'http://0.0.0.0:9000/',
      filename: 'main.js'
  },
  resolve: {
    // alias: {
    //     'react': 'react-lite',
    //     'react-dom': 'react-lite'
    // }
  },
  devtool: 'eval-source-map',
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
        test: /\.(mp4|ico|png|jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        exclude: [ path.resolve(__dirname + '/../src/asset/img/inline') ],
        loader: 'file-loader?name=[path][name].[ext]' // disable hashing
      },
      {
        test: /\.svg$/, 
        include: [ path.resolve(__dirname + '/../src/asset/img/inline') ],
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader?sourceMap=true!postcss-loader!stylus-loader'
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
    contentBase: path.resolve('src'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: PORT
  }
};
