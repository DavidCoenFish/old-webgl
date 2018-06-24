import React from "react";
import {combineReducers} from "redux";
import {connect} from "react-redux";

import {WebglApp} from "./../../components/webgl/webglApp.js";
import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {StateToUniformMap} from "./../../components/statetouniformmap/statetouniformmap.js";
import {StateFactoryTransform} from "./../../components/statetouniformmap/transform/statefactorytransform.js";
import {StateFactoryFloatArray} from "./../../components/statetouniformmap/floatarray/statefactoryfloatarray.js";
import {StateFactoryFloatItem} from "./../../components/statetouniformmap/floatarray/statefactoryfloatitem.js";
import {StateToUniformMapElement} from "./../../components/statetouniformmap/statetouniformmapelement.js";


import {PresentTexture} from "./presenttexture.js";
import {Assets} from "./assets.js";
import {RenderLattice} from "./renderlattice.js";
import {UpdateVelocity} from "./updatevelocity.js";
import {UpdatePosition} from "./updateposition.js";

export const appStateToUniformFactory = function(){
	const result = new StateToUniformMap([

		new StateFactoryTransform("camera transform", "camera", "u_camera", -100.0, 100.0, 0.1, 0.0, 0.0, -5.0),
		new StateFactoryFloatArray(
			"camera param", "camera", "u_cameraFovhFovvFar", 
			[
				new StateFactoryFloatItem("horizontal fov", "Fovh", 211.0, 0, 360.0, 0.01),
				new StateFactoryFloatItem("vertical fov", "Fovv", 150.0, 0, 180.0, 0.01),
				new StateFactoryFloatItem("far plane", "Far", 7000.0, 0, 10000.0)
			]
		),

		new StateFactoryTransform("model transform", "model", "u_model", -100.0, 100.0, 0.1),
		new StateFactoryFloatArray(
			"model param", "model", "u_modelScaleDensitySpringconstantSpringdampen", 
			[
				new StateFactoryFloatItem("scale", "Scale", 1, 0, 10, 0.01),
				new StateFactoryFloatItem("density", "Density", 1.06, 0.5, 2, 0.01),
				new StateFactoryFloatItem("spring constant", "SpringConstant", 218.6, 0, 1000.0, 0.1),
				new StateFactoryFloatItem("spring dampen", "SpringDampen", 50.0, 0, 1000.0, 0.1)
			]
		),
	]);
	return result;
}


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
		this.onStart = this.onStart.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		
		this.oldTimeStamp = undefined;

		this.localUniforMap = {};
		this.uniformValueTimeDelta = new UniformValue(new Float32Array([0.0]), false);
		this.localUniforMap["u_timeDelta"] = this.uniformValueTimeDelta;

		return;
	}

	onStart(in_context){

		const bufferWidth = in_context.getDrawingBufferWidth();
		const bufferHeight = in_context.getDrawingBufferHeight();
		this.localUniforMap["u_viewportWidthHeightWidthhalfHeighthalf"] = new UniformValue(new Float32Array([bufferWidth, bufferHeight, bufferWidth * 0.5, bufferHeight * 0.5]));

		this.assets = new Assets(in_context, this.props.uniformValueMap);
		this.presentTexture = new PresentTexture(in_context);

		this.updateVelocity = new UpdateVelocity(in_context);
		this.updatePosition = new UpdatePosition(in_context);

		this.renderLattice = new RenderLattice(in_context);

		return;
	}

	onUpdate(in_context, in_timestamp){
		var timeDelta = 0.0;
		if (this.oldTimeStamp !== undefined){
			timeDelta = (in_timestamp - this.oldTimeStamp) / 1000.0;
		}
		this.oldTimeStamp = in_timestamp;

		this.uniformValueTimeDelta.getValue()[0] = timeDelta;
		//this.uniformValueTimeDelta.getValue()[0] = 0.0;

		const uniformValueMap = Object.assign({}, this.localUniforMap, this.props.uniformValueMap);

		this.updateVelocity.run(in_context, timeDelta, uniformValueMap, this.assets.getRenderTargetVelocity(), this.assets.getModel(), this.assets.getTexturePositionOld(), this.assets.getTextureVelocityOld());
		this.updatePosition.run(in_context, timeDelta, uniformValueMap, this.assets.getRenderTargetPosition(), this.assets.getModel(), this.assets.getTextureVelocity(), this.assets.getTexturePositionOld());
		this.renderLattice.run(in_context, uniformValueMap, this.assets.getModel(), this.assets.getTexturePosition());
		this.presentTexture.update(in_context, this.assets.getTexturePosition()); //getTextureVelocity());

		this.assets.setIndexToIndexOld();

		return true;
	}

	render(){
		return React.createElement("div", {
				"style" : {
					"display": "flex"
				}
			},
			React.createElement(WebglApp, {
				"width" : 640,
				"height" : 455,
				"requestExtentionArray" : ["OES_texture_float"],
				"onStart" : this.onStart,
				"onUpdate" : this.onUpdate,
				"version" : this.props.version,
				"webglContextAttributes" : {
					"depth" : true
				}
				}), 
			React.createElement(StateToUniformMapElement, {
				"stateToUniformMap" : this.props.stateToUniformMap
			})
		)
	}
}

export const App = connect(appMapState, appMapDispatch)(AppInner);
