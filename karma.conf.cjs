module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [
      { pattern: "src/test/**/*.spec.@(js|jsx)", watched: false }
    ],
    preprocessors: {
      "src/test/**/*.spec.@(js|jsx)": ["webpack"]
    },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          { test: /\.css$/, type: "asset/source" },
          { test: /\.(png|svg)$/, type: "asset/resource" },
          {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }]
              ],
              plugins: [["istanbul", {
                include: ["src/componentes/**/*.jsx", "src/paginas/**/*.jsx"],
                exclude: ["**/*.spec.jsx"]
              }]]
            }
          }
        }]
      }
    },
    plugins: [
      "karma-jasmine", "karma-webpack",
      "karma-chrome-launcher", "karma-coverage",
      "karma-spec-reporter"
    ],
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" }
      ]
    },
    customLaunchers: {
      ChromeHeadlessCodespaces: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-dev-shm-usage"]
      }
    },
    browsers: ["ChromeHeadlessCodespaces"],
    singleRun: true
  });
};
