const path = require('path');

module.exports = {
    entry: {
        main: './index.js',
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../DIR/TO/OUTPUT')
    },

    module: {
        rules: [
        {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: [
                ['@babel/preset-react', { targets: "defaults" }]
                ]
            }
            }
        },

        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        },
        ]
    }
}