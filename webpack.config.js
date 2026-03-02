// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const CopyPlugin = require("copy-webpack-plugin");
const gameRoot = process.cwd();
const Webpack = require("webpack");

// get git info from command line
const commitHash = require("child_process")
  .execSync("git describe --tags --long")
  .toString()
  .trim();

// the path(s) that should be cleaned
const pathsToClean = ["build"];

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: false,
};

const config = {
  // bundle javascript
  entry: {
    main: `${gameRoot}/src/index.js`,
    impressum: `${gameRoot}/src/impressum.js`,
  },
  output: {
    path: `${gameRoot}/build`,
    filename: "[name].js",
  },
  resolve: { symlinks: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ["/node_modules/", "/build_tools/"],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {},
          },
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: {
          loader: "svg-url-loader",
          options: {},
        },
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      __COMMIT_HASH__: JSON.stringify(commitHash),
    }),
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ["node ./build_tools/prepareSvg.js"],
        blocking: true,
        parallel: false,
      },
    }),
    new CleanWebpackPlugin({ pathsToClean, cleanOptions }),
    new MiniCssExtractPlugin({
      filename: "struktogramm.css",
      chunkFilename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      title: "Struktog.",
      template: "./src/index.html",
      chunks: ["main"],
      meta: {
        viewport: "width=device-width, initial-scale=1, user-scalable=no",
        "msapplication-TileColor": "#2d89ef",
        "theme-color": "#ffffff",
      },
    }),
    new HtmlWebpackPlugin({
      title: "Impressum – Struktog.",
      template: "./src/index.html", // reuse the same base HTML template
      chunks: ["impressum"], // only inject impressum.js
      filename: "impressum.html", // output filename
      meta: {
        viewport: "width=device-width, initial-scale=1, user-scalable=no",
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: "robots.txt", to: "./" },
        { from: "*", to: "./build/" },
        "./src/assets/examples/",
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  devServer: {
    port: 8081,
    static: {
      watch: {
        ignored: /node_modules/,
      },
    },
    open: true,
  },
};

module.exports = (env, argv) => {
  if (!argv || !argv.mode) {
    config.mode = "development";
  }
  if (!argv || !argv.mode || argv.mode === "development") {
    config.devtool = "source-map";
  }
  return config;
};
