const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')


const PATHS = {
    src: path.join(__dirname, "./src"),
    dist: path.join(__dirname, "./dist"),
    assets: "assets/"
};





// Pages const for HtmlWebpackPlugin
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
// const PAGES_DIR = PATHS.src
const PAGES_DIR = `${PATHS.src}/tpl/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.njk'))








module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        main: `${PATHS.src}/index.js`
    },
    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: "/"
    },
    module: {
        rules: [
            {
                //JS
                test: /\.js$/,
                loader: "babel-loader",
                exclude: "/node_modules/"
            },
            {
                //CSS
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true
                        },
                    },
                    'css-loader'
                ],
            },
            {
                //SASS
                test: /\.(sass|scss)$/,
                use: [
                    "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true
                        },
                    },
                    {
                        loader: "css-loader",
                        options: { sourceMap: true }
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                //FONTS
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name][contenthash].[ext]',
                    outputPath: `./assets/fonts`
                }
            },
            {
                //PNG/JPG
                test: /\.(png|jpg|)$/,
                use: ['file-loader']
            },
            {
                //HTML
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                //NJK
                test: /\.njk|nunjucks/,
                use: ['html-loader', { // use html-loader or html-withimg-loader to handle inline resource
                    loader: 'nunjucks-webpack-loader', // add nunjucks-webpack-loader
                }]
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        /*  new HtmlWebpackPlugin({
                template: `${PATHS.src}/index.html`,
         }), */

        // Automatic creation any html pages
        // best way to create pages: https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.njk/, '.html')}`
        })),

        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),

        new SVGSpritemapPlugin('src/**/*.svg', {
            output: {
                filename: `${PATHS.assets}/svg-sprite.svg`,
            },
            sprite: {
                prefix: false,
            }
        }),

        new CopyWebpackPlugin([
            {
                from: `${PATHS.src}/static/favicon.ico`,
                to: `${PATHS.dist}`,
            },
            {
                from: `${PATHS.src}/${PATHS.assets}fonts`,
                to: `${PATHS.assets}fonts`
            },
            {
                from: `${PATHS.src}/${PATHS.assets}img`,
                to: `${PATHS.assets}img`
            },

        ]),

    ],
}