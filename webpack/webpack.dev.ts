import path from "path";
import CopyPlugin from "copy-webpack-plugin"
import * as webpack from "webpack";

import commonWebpack from "./webpack.config"
const webPackConfig: webpack.Configuration = {
    ...commonWebpack,
    mode: "development",
    devtool: 'inline-source-map',
    optimization: {
        minimizer: undefined
    }
}

export default webPackConfig