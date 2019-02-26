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
        //     ["import", {
        //       "libraryName": "antd",
        //       "libraryDirectory": "es",
        //       "style": "css" // `style: true` 会加载 less 文件
        //     }]
        //   ]
        // },

      }, {
        test: /\.css$/,
        // exclude: /node_modules|antd\.css|antd\.less/,
        loaders: ['style-loader', {
          loader: 'css-loader',
          options: {
            import: false
          }
        }],

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