var webpack = require('webpack');
var config = require('./webpack.base.config.js');

var SaveAssetsJson = require('assets-webpack-plugin');

config.bail = true;
config.debug = false;
config.profile = false;
config.devtool = '#source-map';

config.output = {
  path: './assets/dist',
  pathInfo: true,
  publicPath: '/assets/',
  filename: '[name].[hash].min.js',
};

config.plugins = config.plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: '"production"' },
  }),
  new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
  new SaveAssetsJson({
    path: './assets/dist/',
    filename: 'assets.json',
  }),
]);


module.exports = config;

