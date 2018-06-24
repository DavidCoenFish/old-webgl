import React from "react";
import ReactDOM from "react-dom";
import {App} from "./app.js";
import {WebglApp} from "./../../components/webgl/webglApp.js";

const app = new App();

ReactDOM.render(
	React.createElement(WebglApp, {
		"width" : 512,
		"height" : 384,
		"onStart": app.onStart,
		"onUpdate": app.onUpdate,
		"version" : "__webpack_plugin_version__" + " NODE_ENV:" + process.env.NODE_ENV,
		}), 
	document.getElementById("root")
);

