import path from "path";

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "dist"),
    library: "commandify",
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
};
