const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const loadPresets = require('./built-utils/loadPresets');
const modeConfig = mode => require(`./built-utils/webpack.${mode}`)();

module.exports = ({ mode, presets }) => {
	return webpackMerge(
		{
			entry: './src/index.js',
			output: {
				filename: 'bundle.js',
				path: path.join(__dirname, 'public/dist')
			},
			module: {
				rules: [
					{
						test: /\.(jpe?g|png|gif|svg)/,
						use: 'url-loader'
					},
					{
						test: /\.s?css$/,
						use: ['style-loader', 'css-loader', 'sass-loader']
					},
					{
						test: /\.js$/,
						use: 'babel-loader',
						exclude: /node_modules/
					}
				]
			},
			plugins: [new webpack.ProgressPlugin()]
		},
		modeConfig(mode),
		loadPresets(presets)
	);
};
