console.log("Client build");
const configPath = process.argv[2];
console.log(" configPath:" + configPath);
const config = require("./" + configPath);

const Webpack = require("webpack");
//console.log("process.env.NODE_ENV:" + JSON.stringify(process.env.NODE_ENV));

//Compiler.run(function(in_err, in_stats){

const Compiler = Webpack(config, function(in_err, in_stats){
	console.log("in_err:" + in_err + " in_stats:" + in_stats);
	process.exit(0);
});
