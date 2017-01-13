const webpack = require('webpack');

const path = require('path');
const _ = require('lodash');

const NODE_ENV = process.env.NODE_ENV;
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = {
  production: NODE_ENV === 'production',
  staging: NODE_ENV === 'staging',
  test: NODE_ENV === 'test',
  development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined',
};

_.assign(env, {
  build: (env.production || env.staging),
});

const extractCSS = new ExtractTextPlugin({
  filename: env.production ? 'urf.[contenthash].css' : 'main.css',
  allChunks: true,
});

module.exports = {
  target: 'web',

  entry: {
    main: './assets/src/entry.js',
  },

  output: {
    path: path.join(__dirname, '/build'),
    publicPath: 'http://localhost:8080/build/',
    filename: '[name].js',
  },

  resolve: {
    modules: [
      'web_modules',
      'node_modules',
      './src/images',
    ],
    extensions: ['.js', '.css', '.svg'],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: env.development,
      __STAGING__: env.staging,
      __PRODUCTION__: env.production,
      __CURRENT_ENV__: `'${(NODE_ENV)}'`,
    }),
    new StyleLintPlugin({
      configFile: './stylelint.config.js',
      files: 'assets/src/**/*.css',
    }),
    extractCSS,
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
  ],

  module: {
    rules: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/, enforce: 'pre' },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?importLoaders=1!postcss-loader',
          publicPath: '',
        }),
      },
      { test: /\.(woff|woff2|eot|ttf|svg|png)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000' },
    ],

    noParse: /\.min\.js/,
  },
};
