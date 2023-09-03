const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        main: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name]_bundle.js",
    },
    devServer: {
        historyApiFallback: true,
        // contentBase: path.resolve(__dirname, "./dist"),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    module: {
        rules: [
            // JavaScript
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                type: "asset/inline",
            },
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"), // template file
            filename: "index.html", // output file
        }),
        new CopyPlugin({
            patterns: [
                { from: "./public", to: "." },
                // "/public",
            ],
        }),
    ],
};
