const path = require('path');

module.exports = {
    entry: {
        index: './index.js',
    },

    output: {
        filename: '[name]_bundle.js',
        path: path.resolve(__dirname, './docs')
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