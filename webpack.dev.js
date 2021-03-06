const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPluginVersion = require('./modules/webpackpluginversion.js');

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const sku = "dev";
const skuLong = "development";

module.exports = merge(common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './output/' + sku + '/'
	},
	plugins: [
		new CleanWebpackPlugin(['output/' + sku]),
		new CopyWebpackPlugin([{ from: './source/static' }]),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(skuLong)
			}
		}),
		new WebpackPluginVersion({"product":"webgl","sku":sku}),
	],
	output: {
		path: path.resolve(__dirname, 'output', sku)
	},
	stats: {
		colors: true
	},
});
