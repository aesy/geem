const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    context: path.join(process.cwd(), 'src'),
    entry: {
        app: './index.ts'
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.js'],
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
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                }
            }, {
                test: /\.(js|ts)$/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.(css|scss)$/,
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
                test: /\.(png|jpg|jpeg|gif|mp3|wav)$/,
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
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.[hash].css' }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true
        })
    ]
};
