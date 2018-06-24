import React from "react";
import {combineReducers} from "redux";
import {connect} from "react-redux";

import {StateToUniformMapElement} from "./../../components/statetouniformmap/statetouniformmapelement.js";
import {StateToUniformMap} from "./../../components/statetouniformmap/statetouniformmap.js";

import {StateFactoryTransform} from "./../../components/statetouniformmap/transform/statefactorytransform.js";
import {StateFactoryFloatArray} from "./../../components/statetouniformmap/floatarray/statefactoryfloatarray.js";
import {StateFactoryFloatItem} from "./../../components/statetouniformmap/floatarray/statefactoryfloatitem.js";
import {LayoutPlaceHolder} from "./../../components/layoutplaceholder/layoutplaceholder.js";
import { StateFactoryEularToAtUpRight } from "../../components/statetouniformmap/eulartoatupright/statefactoryeulartoatupright";
import { StateFactoryVector3 } from "../../components/statetouniformmap/vector3/statefactoryvector3";

export const appStateToUniformFactory = function(){
	const result = new StateToUniformMap([
		new StateFactoryTransform("displayNameTransform", "stateNameBaseTransform", "Transform", -100.0, 100.0),
		//new StateFactoryFloatArray(
		//	"displayName", "stateNameBase", "uniformMapName", 
		//	[
		//		new StateFactoryFloatItem("a", "a", 50, 0, 100),
		//		new StateFactoryFloatItem("b", "b", 50, 0, 100),
		//		new StateFactoryFloatItem("c", "c", 50, -10000.0, 10000.0)
		//	]
		//),
		//new StateFactoryEularToAtUpRight("model rotation", "model.rot", "model"),
		//new StateFactoryVector3("model position", "model.pos", "model.pos", -10.0, 10.0, 0.1),
	]);
	return result;
}
const appMapState = function(in_state, in_props){
	const uniformMap = in_props.stateToUniformMap.convertStateToUniforMap(in_state);
	return {
		"uniformValueMap" : uniformMap
	}
}
// also use the AppMenu to add dispatch functions using app state information via the props (else we could pass it around as function params)
const appMapDispatch = function(in_dispatch, in_props){
	return {
		"onSetValue" : function(in_key, in_value){ in_dispatch({"type":"setValue", "key" : in_key, "value" : in_value });},
	}
}

//export class App {
export const AppInner = class extends React.Component{
	constructor(in_props) {
		//console.log("App.constructor");
		super(in_props);
		
		return;
	}

	render(){
		console.log("App uniformValueMap:" + JSON.stringify(this.props.uniformValueMap));

		return React.createElement("div", {
				"style" : {
					"display": "flex"
				}
			},
			React.createElement(LayoutPlaceHolder, {
				"width" : "640px",
				"height" : "455px",
				"backgroundColor" : "#777",
			}), 
			React.createElement(StateToUniformMapElement, {
				"stateToUniformMap" : this.props.stateToUniformMap
			})
		)
	}
}

export const App = connect(appMapState, appMapDispatch)(AppInner);
