import React from "react";
import {combineReducers} from "redux";
import {connect} from "react-redux";

import {WebglApp} from "./../../components/webgl/webglApp.js";
import {Material} from "./../../components/webgl/resource/material/material.js";
import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";
import {UniformValueMapEdit} from "./../../components/uniformvaluemapedit/uniformvaluemapedit.js";
import {TestPatternRenderPass} from "./testpatternrenderpass.js";
import {PresentPass} from "./presentpass.js";

const compareUniformValue = function(in_lhs, in_rhs){
	if (in_lhs.length !== in_rhs.length){
		return false;
	}
	for (var forIndex = 0, forCount = in_lhs.length; forIndex < forCount; ++forIndex) {
		const lhs = in_lhs[forIndex];
		const rhs = in_rhs[forIndex];
		if (lhs !== rhs){
			return false;
		}
	}
	return true;
}

const uniformValueMapReducer = function(in_state, in_action){
	if (in_state === undefined){
		return { 
			"u_adaptationLog10" : new UniformValue(new Float32Array([0.0])),
			"u_invrangeLog10" : new UniformValue(new Float32Array([0.33333333]))
		}
	}

	switch (in_action.type){
		case "setValue": // in_action.type, in_action.key, in_action.value, 
			//console.log("uniformValueMapReducer.setValue");
			const uniformValue = in_state[in_action.key];
			const value = uniformValue.getValue();
			if (false === compareUniformValue(value, in_action.value)){
				var result = Object.assign({}, in_state);
				result[in_action.key] = new UniformValue(in_action.value);
				return result;
			}
			break;
		default:
			break;
	}

	return in_state;
}

export const appReducer = combineReducers({
	"uniformValueMap" : uniformValueMapReducer
});

const appMapState = function(in_state, in_props){
	return {
		"uniformValueMap" : in_state.uniformValueMap
	}
}

// also use the AppMenu to add dispatch functions using app state information via the props (else we could pass it around as function params)
const appMapDispatch = function(in_dispatch, in_props){
	return {
		"onSetValue" : function(in_key, in_value){ in_dispatch({"type":"setValue", "key" : in_key, "value" : in_value });},
	}
}

export const AppInner = class extends React.Component{
	constructor(in_props) {
		//console.log("App.constructor");
		super(in_props);
		this.onStart = this.onStart.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		
		return;
	}
	onStart(in_context){
		//console.log("App.onStart");
		this.testPatternRenderPass = new TestPatternRenderPass(in_context);
		this.presentPass = new PresentPass(in_context, this.testPatternRenderPass.getOutputTextureColour());
	}

	onUpdate(in_context, in_timestamp){
		this.testPatternRenderPass.update(in_context, in_timestamp, this.props.uniformValueMap);
		this.presentPass.update(in_context, in_timestamp, this.props.uniformValueMap);
		return true;
	}

	render(){
		//console.log("App.render");
		return React.createElement("div", {
				"style" : {
					"display": "flex"
				}
			},
			React.createElement(WebglApp, {
				"width" : 512,
				"height" : 512,
				"requestExtentionArray" : ["OES_texture_float"],
				"onStart" : this.onStart,
				"onUpdate" : this.onUpdate,
				"version" : this.props.version,
				}), 
			React.createElement(UniformValueMapEdit, { 
				"uniformValueMap" : this.props.uniformValueMap, 
				"onSetValue" : this.props.onSetValue 
				})
		)
	}
}

export const App = connect(appMapState, appMapDispatch)(AppInner);
