const path = require('path');

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.feature$/,
        use: [
          {
            loader: "@badeball/cypress-cucumber-preprocessor/webpack",
            options: {
              configFile: path.resolve(__dirname, "cypress.config.js")
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};