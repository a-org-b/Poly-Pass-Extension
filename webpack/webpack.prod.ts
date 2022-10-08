import path from "path";
import CopyPlugin from "copy-webpack-plugin"
import * as webpack from "webpack";
import commonWebpack from "./webpack.config"

const webPackConfig: webpack.Configuration = {
    ...commonWebpack,
    mode: "production",
}

export default webPackConfig