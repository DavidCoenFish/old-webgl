const Version = require("./version.js");
const Util = require("./util.js");

const replaceToken = "__webpack_plugin_version__";

function WebpackVersionPlugin(in_options) {
	this.m_options = in_options;
}

/*
	TODO: fix bug. inf waiting loop if version data file is locked?
 */

WebpackVersionPlugin.prototype.apply = function (compiler) {
	var product = this.m_options.product;
	var sku = this.m_options.sku;

	compiler.plugin("emit", function (compilation, callback) {
		console.log("WebpackVersionPlugin pre IncrementVersionPromice time:" + (new Date).toLocaleTimeString());
		Version.IncrementVersionPromice(product, sku, 0, 0).then(function (in_input) {
			const version = in_input;
			console.log("WebpackVersionPlugin emit version:" + version + " time:" + (new Date).toLocaleTimeString());

			for (var basename in compilation.assets) {
				let replaced = 0;

				const asset = compilation.assets[basename];
				const originalSource = asset.source();
				if (!originalSource || typeof originalSource.replace !== 'function') {
					continue;
				}
				const modFile = originalSource.replace(replaceToken, (tag) => {
					replaced += 1;
					return version;
				});

				asset.source = () => modFile;
				//console.log(`InjectByTag : match : ${basename} : replaced : ${replaced}`);
			}
			callback();
		});
	});
};

module.exports = WebpackVersionPlugin;