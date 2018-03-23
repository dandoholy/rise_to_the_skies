var path = require('path');

module.exports = {
  entry: "./lib/fiery_tower.js",
  output: {
    filename: "./lib/bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js", '.jsx', "*"]
  }
};
