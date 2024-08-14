const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    libraryTarget: "window",
    library: 'GroupNode'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "@xyflow/react": "@xyflow/react",
  },
};
