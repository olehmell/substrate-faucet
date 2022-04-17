const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = function () {
  return [
    ///----------------------------
    {
      target: "node",

      entry: {
        app: "./src/app.js",
      },
      output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name].js",
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: "babel-loader",
          },
          {
            test: /\.html$/,
            loader: "html-loader",
            query: {
              minimize: false,
            },
          },
        ],
      },
      externals: [nodeExternals()],
      plugins: [
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
          },
        }),
      ],
    },
  ];
};
