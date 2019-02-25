const path = require('path')
const webpack = require('webpack')
const paths = require('./paths');
const isEnvProduction = true
module.exports = {
  devtool: '#source-map',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: 'rc_ipc_ui.js',
    publicPath: '/dist/',
    library: 'rc-ipc-ui',
    libraryTarget: 'umd', //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appBuildSrc,
        loader: require.resolve('babel-loader'),
        // options: {
        //   plugins: [
        //     ['import', { libraryName: 'antd', style: true }],
        //   ],
        //   // This is a feature of `babel-loader` for webpack (not Babel itself).
        //   // It enables caching results in ./node_modules/.cache/babel-loader/
        //   // directory for faster rebuilds.
        //   cacheDirectory: true,
        // },

      }, {
        test: /\.css$/,
        // exclude: /node_modules|antd\.css/,
        loaders: ['style-loader', 'css-loader'],
        // exclude: path.join(__dirname, '../src/style.css')
      }
    ],
  },
  externals: {
    'react': 'umd react',
    'react-dom': 'umd react-dom',
    'antd': 'umd antd'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin({ quiet: true }),
  ],

}