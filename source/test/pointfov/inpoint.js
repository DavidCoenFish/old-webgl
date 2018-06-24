import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {App, appStateToUniformFactory} from "./app.js";

const stateToUniformMap = appStateToUniformFactory();

const ReduxStore = createStore(stateToUniformMap.reducerFactory());
const versionString = "__webpack_plugin_version__" + " NODE_ENV:" + process.env.NODE_ENV;
console.log("versionString:" + versionString);

ReactDOM.render(
	React.createElement(Provider, {"store" : ReduxStore}, 
		React.createElement(App, {
			"version" : versionString,
			"stateToUniformMap" : stateToUniformMap
		})), 
	document.getElementById("root")
);
