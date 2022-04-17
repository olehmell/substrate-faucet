
const webpack = require('webpack');

module.exports = (argv) => {

    console.log("Webpack args: ", argv);

    const configs = [
        require('./webpack/server'),
    ];

    configs.forEach(config => {
        if (argv.mode === 'development') {
            config.devtool = 'source-map';
        }

        if (argv.mode === 'production') {
            config.plugins.push(new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }));
        }

    });

    return configs;
};