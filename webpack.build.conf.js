const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const PATHS = {
    src: path.join(__dirname, "./src"),
    dist: path.join(__dirname, "./dist"),
    assets: "assets/"  //"assets/"
};

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        filename: `${PATHS.assets}js/[name][chunkhash].js`,
        path: PATHS.dist,
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `${PATHS.src}/index.html`,
            minify: {
                collapseWhitespace: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name][chunkhash].css`
        }),
        /* new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }) */

        /* new BundleAnalyzerPlugin() */
    ]
})



module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig)
})