const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const loadPresets = require('./built-utils/loadPresets');
const modeConfig = mode => require(`./built-utils/webpack.${mode}`)();

module.exports = ({ mode, presets }) => {
	return webpackMerge(
		{
			entry: './src/index.tsx',
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
						test: /\.tsx?$/,
						use: 'ts-loader',
						exclude: /node_modules/
					}
				]
			},
			resolve: {
				extensions: ['.tsx', '.ts', '.jsx', '.js']
			},
			plugins: [new webpack.ProgressPlugin()]
		},
		modeConfig(mode),
		loadPresets(presets)
	);
};
