const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = function () {
  const configs = require("./webpack.development.js")();

  configs.forEach(function (config) {
    config.plugins.push(new CleanWebpackPlugin());
  });

  return configs;
};
