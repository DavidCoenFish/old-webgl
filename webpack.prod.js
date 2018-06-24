const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPluginVersion = require('./modules/webpackpluginversion.js');

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const sku = "prod";
const skuLong = "production";

module.exports = merge(common, {
	plugins: [
		new CleanWebpackPlugin([path.resolve(__dirname, "output", sku)]),
		new CopyWebpackPlugin([{ from:'./source/static'}]),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(skuLong)
			}
		}),
		new WebpackPluginVersion({"product":"webgl","sku":sku}),
		new webpack.optimize.UglifyJsPlugin({compress: { warnings: false}, output: { comments: false}}),
	],
	output: {
		path: path.resolve(__dirname, 'output', 'prod')
	},
});