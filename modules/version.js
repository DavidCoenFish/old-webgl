const Util = require("./util.js");

/*
./data/[product]_[sku].json
{
	"sku" : [sku],
	"major" : [versionMajor],
	"minor" : [versionMinor],
	"a" : [yyyymmdd],
	"b" : [build count]
}
*/

const GetVersionFilePath = function(in_product, in_sku){
	return "./data/version_" + in_product + "_" + in_sku + ".json";
}

module.exports.IncrementVersionPromice = function(in_product, in_sku, in_versionMajor, in_versionMinor){
	var versionString;
	const filePath = GetVersionFilePath(in_product, in_sku);
	return Util.readFilePromise(filePath).then(function(input){
		//console.log("read file:" + input);
		var result = {};
		try {
			result = JSON.parse(input);
		} catch (error) {
			console.log("file parse error:" + error);
			result = {};
		}
		return result;
	}, function(error){
		console.log("error reading file error:" + error);
		return {};
	}).then(function(input){
		var result = {};
		result["sku"] = in_sku;
		result["major"] = in_versionMajor;
		result["minor"] = in_versionMinor;
		var date = new Date();
		result["a"] = date.getFullYear().toString() + (date.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits:2}) + date.getDate().toLocaleString(undefined, {minimumIntegerDigits:2});
		buildCount = input["b"];
		if (typeof buildCount === "number"){
			buildCount += 1;
		} else {
			buildCount = 0;
		}
		result["b"] = buildCount;

		versionString = MakeVersionString(result);
	
		return result;
	}).then(function(input){
		var version = JSON.stringify(input);
		//console.log("write version:" + version + " on path:" + filePath);
		return Util.writeFilePromise(filePath, version);
	}).then(function(input){
		return versionString;
	});
}

const MakeVersionString = function(in_input){
	return in_input.sku + " " + in_input.major + "." + in_input.minor + "." + in_input.a + "." + in_input.b;
}

module.exports.GetVersionStringPromice = function(in_product, in_sku){
	const filePath = GetVersionFilePath(in_product, in_sku);
	return Util.readFilePromise(filePath).then(function(input){
		//console.log("read file:" + input);
		var result = {};
		try {
			result = JSON.parse(input);
		} catch (error) {
			console.log("file parse error:" + error);
			result = {};
		}
		return result;
	}).then(function(input){
		return MakeVersionString(input);
	}).fail(function(input){
		return undefined;
	});
}
