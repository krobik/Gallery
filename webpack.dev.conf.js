const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: baseWebpackConfig.externals.paths.dist,
        hot: true,
        historyApiFallback: true,
        inline: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        /* host: '192.168.0.105', */
        port: 8081,
        /* proxy: {
            '/api/**': {
                target: '192.168.0.105:8000',
                secure: false,
                changeOrigin: true,
                open: true,
            }
        }, */
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        }),
        
        /* new BundleAnalyzerPlugin() */
    ],
});



module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
});