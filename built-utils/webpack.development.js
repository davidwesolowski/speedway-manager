const path = require('path');

module.exports = () => ({
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../public'),
        historyApiFallback: true,
        publicPath: '/dist'
    }
});