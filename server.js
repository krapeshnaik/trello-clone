var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(
        webpack(config), {
            publicPath: config.output.publicPath,
            noInfo: true
        })
    .listen(3000, '0.0.0.0', function (err, result) {
        if (err) {
            console.log(err);
        }

        console.log('Running at http://localhost:3000');
    });