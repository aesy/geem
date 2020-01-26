const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: path.join(process.cwd(), 'src'),
    entry: {
        app: './index.js'
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    resolve: {
        modules: [
            path.join(process.cwd(), 'src', 'scripts'),
            path.join(process.cwd(), 'src', 'assets'),
            path.join(process.cwd(), 'node_modules')
        ]
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                }
            }, {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: [ ':src' ]
                        }
                    }
                ]
            }, {
                test: /\.(css|scss$)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }, {
                test: /\.(ico|png|jpg|jpeg|gif|svg|mp4|mov|mp3|ogg|avi)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]',
                            outputPath: 'media/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([ 'dist' ], { root: process.cwd() }),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true
        })
    ]
};