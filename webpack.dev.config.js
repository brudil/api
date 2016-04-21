var webpack = require('webpack');
var config = require('./webpack.base.config.js');

if (process.env.NODE_ENV !== 'test') {
  config.entry = {
    main: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      config.entry.main
    ],
    player: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      config.entry.player
    ]
};
}

config.devtool = 'eval-source-map';

config.plugins = config.plugins.concat([
  new webpack.NoErrorsPlugin()
]);

config.module.loaders = config.module.loaders.concat([
  {test: /\.js?$/, loaders: ['babel-loader'], exclude: /node_modules/}
]);

module.exports = config;
