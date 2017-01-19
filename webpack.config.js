const isProduction = process.env.NODE_ENV === 'production';
const config = isProduction ? require('./webpack/webpack.prod.config.js') : require('./webpack/webpack.dev.config.js');

module.exports = config;
