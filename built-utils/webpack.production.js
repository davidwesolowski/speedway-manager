const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			})
		]
	},
	plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })]
});
