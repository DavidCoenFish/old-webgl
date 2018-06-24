import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {App, appReducer} from "./app.js";

const ReduxStore = createStore(appReducer);
const versionString = "__webpack_plugin_version__" + " NODE_ENV:" + process.env.NODE_ENV;
console.log("versionString:" + versionString);

ReactDOM.render(
	React.createElement(Provider, {"store" : ReduxStore}, 
		React.createElement(App, {
			"version" : versionString
		})), 
	document.getElementById("root")
);
