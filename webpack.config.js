var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    __DEV__: DEBUG,
};

module.exports = {
    devtool: DEBUG ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: {
        app: './src/router.jsx',
        vendor: ["react", "react-dom", "react-bootstrap", "react-router", "react-intl", "react-router-bootstrap", "intl", "react-intl/locale-data/fr", "react-intl/locale-data/en", "jquery", "bootstrap-datepicker"]
    },
    output: { path: __dirname + "/build", filename: 'bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, './node_modules/react-routing/src'),
                    path.resolve(__dirname, './src'),
                ],
                query: {
                    cacheDirectory: DEBUG,
                    "presets": ["es2015", "stage-0", "react"],
                    "plugins": DEBUG ? ["react-hot-loader/babel"] : []
                }
            },
            {test: /\.css$/,  loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },

            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            {test: /\.json$/, exclude: /node_modules/, loader: 'json'},
            {test: /\.(jpe?g|png|gif|svg)$/i,loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]}
        ]
    },
    cache: DEBUG,
    debug: DEBUG,
    stats: {
        colors: true,
        reasons: DEBUG,
        hash: VERBOSE,
        version: VERBOSE,
        timings: true,
        chunks: VERBOSE,
        chunkModules: VERBOSE,
        cached: VERBOSE,
        cachedAssets: VERBOSE,
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.CommonsChunkPlugin(name="vendor", filename="vendor.bundle.js"),
        ...DEBUG ? [

            new webpack.HotModuleReplacementPlugin(),

        ] : [
            new webpack.DefinePlugin({
              'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.optimize.DedupePlugin(),

            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                beautify: false,
                comments: false,
                compress: {
                    screw_ie8: true,
                    warnings: VERBOSE,
                    drop_console: true,
                },
            }),

            new webpack.optimize.AggressiveMergingPlugin(),
        ]
    ]
};
