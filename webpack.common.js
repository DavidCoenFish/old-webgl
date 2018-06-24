const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sEntry = {
	testhdr: "./source/test/hdr/inpoint.js",
	testlattice: "./source/test/lattice/inpoint.js",
	testpointfov: "./source/test/pointfov/inpoint.js",
	testrendertarget: "./source/test/rendertarget/inpoint.js",
	testsky: "./source/test/sky/inpoint.js",
	testspring: "./source/test/spring/inpoint.js",
	teststatetouniformmap: "./source/test/statetouniformmap/inpoint.js",
	testtexture: "./source/test/texture/inpoint.js",
	testtriangle: "./source/test/triangle/inpoint.js",
	unittest: "./source/test/unittest/inpoint.js",
};

const sPlugins = [];

for (var key in sEntry) {
	if (false === sEntry.hasOwnProperty(key)) {
		continue;
	}
	const value = sEntry[key];
	//https://github.com/jantimon/html-webpack-plugin#configuration
	sPlugins.push(new HtmlWebpackPlugin({
			hash: false,
			filename: key + ".html",
			template: "./source/template/test.html",
			inject: false,
			title: key,
			bundle: "js/" + key + ".bundle.js"
		})
	);
}

module.exports = {
	entry: sEntry,
	output: { filename: "js/[name].bundle.js" },
	plugins: sPlugins,
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			}
		}
		
		]
	}	
};
