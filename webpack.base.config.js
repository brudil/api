var webpack = require('webpack');

var path = require('path');
var _ = require('lodash');

var NODE_ENV = process.env.NODE_ENV;
var postcssImport = require('postcss-import');

var env = {
  production: NODE_ENV === 'production',
  staging: NODE_ENV === 'staging',
  test: NODE_ENV === 'test',
  development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined'
};

_.assign(env, {
  build: (env.production || env.staging)
});

module.exports = {
  target: 'web',

  entry: './server/static/src/entry.js',

  output: {
    path: path.join(__dirname, '/build'),
    pathInfo: true,
    publicPath: 'http://localhost:8080/build/',
    filename: 'bundle.js'
  },

  resolve: {
    modulesDirectories: [
      'web_modules',
      'node_modules',
      './src/images'
    ],
    extentions: ['js', 'scss', 'svg']
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
      __CURRENT_ENV__: '\'' + (NODE_ENV) + '\''
    })
  ],

  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/},
      {test: /\.css/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.svg$/, loader: 'file'}
    ],

    noParse: /\.min\.js/
  },
  postcss: function (webpack) {
    return [
      require('postcss-cssnext'),
      postcssImport({
        addDependencyTo: webpack
      })
    ];
  }

};