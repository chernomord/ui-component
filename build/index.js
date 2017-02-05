const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let webpackConfig = {
    entry: "./src/app.ts",
    output: {
        path: 'dist/',
        filename: "app.js"
    },
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {test: /\.tsx?$/, loader: "ts-loader"}
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'Diary: Local'
    })]
};

webpack(webpackConfig, function (err, stats) {
    // spinner.stop()
    if (err) throw err;
    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            reasons: true,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n')
});
