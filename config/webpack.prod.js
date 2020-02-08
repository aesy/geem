const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = Merge(CommonConfig, {
    optimization: {
        minimize: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin()
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ]
});
