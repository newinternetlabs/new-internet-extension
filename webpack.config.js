const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

// process.traceDeprecation = true;

module.exports = function (env) {
  console.log(env)
  const [mode, platform, benchmark, firefoxBeta] = env.split(':')
  let version = require('./manifest/common.json').version
  if (firefoxBeta) version += 'beta'

  const config = {
    entry: {
      background_page: './src/background_page/index.js',
      content_script: './src/content_script/index.js',
      content_script_loader: './src/content_script/loader.js',
      popup: './src/pages/popup/index.js',
      options: './src/pages/options/index.js'
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].js.map' // always generate source maps
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {}
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      modules: ['./src', './node_modules']
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CopyWebpackPlugin([
        {
          from: 'static'
        },
        {
          context: 'src/options',
          from: '**/default.json',
          to: 'default_[folder].json'
        },
        {
          context: 'src/options',
          from: '**/config.json',
          to: 'config_[folder].json'
        }
      ]),
      new GenerateJsonPlugin(
        'manifest.json',
        merge(
          require('./manifest/common.json'),
          require(`./manifest/${platform}.json`),
          { version }
        ),
        null,
        2
      )
    ]
  }

  // extension id must be specified in calls to chrome.runtime.connect
  // otherwise clients won't be able to reconnect to background page
  // and background commands will stop working
  const EXTENSION_ID = JSON.stringify(platform === 'chrome' ? '123' : 'abc')

  if (mode === 'prod') {
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        EXTENSION_ID
      })
    ])
  } else {
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        EXTENSION_ID
      })
    ])
  }
  return config
}
