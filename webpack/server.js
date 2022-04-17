const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const Dotenv = require('dotenv-webpack')

require('dotenv').config()

module.exports = {
  target: "node",
  devtool: "source-map",
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: {
    app: "./src/app.js",
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: path.join(__dirname, '.env'),
      systemvars: true // Required by Docker
    }),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
