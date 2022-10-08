import path from "path";
import CopyPlugin from "copy-webpack-plugin"
import * as webpack from "webpack";
import glob from "glob"

let scripts = glob.sync("./src/scripts/**.ts")

let scriptEntries: { [key: string]: string; } = {}
scripts.forEach(pathOfFile => {
  let fileName = path.basename(pathOfFile)
  let entryName = fileName.split(".")[0]
  scriptEntries[entryName] = pathOfFile
})

const webPackConfig: webpack.Configuration = {
  entry: {
    ...scriptEntries,
    content_scripts: path.resolve(__dirname, "..", "src", "content_scripts.ts"),
    background: path.resolve(__dirname, "..", "src", "background.ts")
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
}

export default webPackConfig