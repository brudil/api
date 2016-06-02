var webpack = require('webpack');

var path = require('path');
var _ = require('lodash');

var NODE_ENV = process.env.NODE_ENV;
var postcssImport = require('postcss-import');
var styleLintPlugin = require('stylelint-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

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

  entry: {
    main: './assets/src/entry.js',
  },

  output: {
    path: path.join(__dirname, '/build'),
    pathInfo: true,
    publicPath: 'http://localhost:8080/build/',
    filename: '[name].js',
  },

  resolve: {
    modulesDirectories: [
      'web_modules',
      'node_modules',
      './src/images',
    ],
    extentions: ['js', 'css', 'svg'],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
      __CURRENT_ENV__: '\'' + (NODE_ENV) + '\'',
    }),
    new styleLintPlugin({
      files: 'assets/src/**/*.css',
    }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
  ],

  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader', {
        publicPath: '',
      })},
      { test: /\.(woff|woff2|eot|ttf|svg|png)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000' },
    ],

    noParse: /\.min\.js/,
  },
  postcss: function (webpack) {
    return [
      postcssImport({
        addDependencyTo: webpack,
      }),
      require('postcss-cssnext'),
      require('lost'),
      require('postcss-brand-colors'),
    ];
  }

};
