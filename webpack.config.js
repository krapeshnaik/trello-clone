var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [{
            test: [/\.js?$/, /\.jsx?$/],
            loaders: ['babel-loader'],
            include: path.join(__dirname, 'src')
        },
        {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        },
        {
            test: /\.png$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug: true,
                    },
                },
            ],
        }
        ]
    }
}