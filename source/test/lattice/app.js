import React from "react";
import {combineReducers} from "redux";
import {connect} from "react-redux";

import {WebglApp} from "./../../components/webgl/webglApp.js";
import {Material} from "./../../components/webgl/resource/material/material.js";
import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {StateToUniformMapElement} from "./../../components/statetouniformmap/statetouniformmapelement.js";
import {StateToUniformMap} from "./../../components/statetouniformmap/statetouniformmap.js";

import {StateFactoryTransform} from "./../../components/statetouniformmap/transform/statefactorytransform.js";
import {StateFactoryFloatArray} from "./../../components/statetouniformmap/floatarray/statefactoryfloatarray.js";
import {StateFactoryFloatItem} from "./../../components/statetouniformmap/floatarray/statefactoryfloatitem.js";

export const appStateToUniformFactory = function(){
	const result = new StateToUniformMap([

		new StateFactoryTransform("camera transform", "camera", "u_camera", -100.0, 100.0, 0.1),
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
			"model param", "model", "u_modelScale", 
			[
				new StateFactoryFloatItem("scale", "Scale", 1, 0, 100.0, 0.01),
			]
		),
	]);
	return result;
}

const sVertexShaderSource = `
attribute vec3 a_position;

varying vec2 v_majorAxis;
varying vec2 v_minorAxis;

uniform vec3 u_cameraPos;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraRight;

uniform vec3 u_cameraFovhFovvFar;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;

uniform vec3 u_modelPos;
uniform vec3 u_modelAt;
uniform vec3 u_modelUp;
uniform vec3 u_modelRight;
uniform float u_modelScale;

vec3 getAtomPosition(){
	float x = a_position.x + (mod(a_position.y, 2.0) * 0.5) - (mod(a_position.z, 2.0) * 0.5);
	float y = (a_position.y * 0.86602540378443864676372317075294) + (mod(a_position.z, 2.0) * 0.28867513459481288225457439025098);
	float z = 	a_position.z * 0.81649658092772603273242802490196;
	vec3 pos = u_modelPos + (((u_modelRight * x) + (u_modelUp * y) + (u_modelAt * z)) * u_modelScale);

	return pos;
}

void main() {
	vec3 pos = getAtomPosition();
	vec3 cameraToAtom = pos - u_cameraPos;

	float cameraSpaceX = dot(cameraToAtom, u_cameraRight);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFar.x * 0.5;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float atomRadius = 0.61237243569579452454932101867647 * u_modelScale;

	float screenZRaw = (cameraSpaceLength + atomRadius) / u_cameraFovhFovvFar.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float atomAngle = degrees(asin(clamp(atomRadius / cameraSpaceLength, -1.0, 1.0)));
	float minorAxis = atomAngle / fovHHalf;

	float atomAngleMajor = degrees(atan(atomRadius, cameraSpaceXYLength));
	float majorAxisTemp = sin(radians(atomAngleMajor)) * polarR / fovHHalf;
	float majorAxis = max(minorAxis, majorAxisTemp);

	float pointSize = 1024.0; //arbitary max radius in pixels
	if (atomRadius < cameraSpaceLength){
		pointSize = min(1024.0, majorAxis * width);
	}

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pointSize; //point size is diameter

	v_majorAxis = vec2(cameraSpaceYNorm, cameraSpaceXNorm);
	float mul = majorAxis / minorAxis;
	v_minorAxis = vec2(cameraSpaceXNorm * mul, -cameraSpaceYNorm * mul);
}
`;

const sFragmentShaderSource = `
precision mediump float;
varying vec2 v_majorAxis;
varying vec2 v_minorAxis;
void main() {
	vec2 pointCoord = (gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
	float dist = dot(pointCoord, pointCoord);
	if (1.0 < dist){
		discard;
	}
	vec2 ellipseCoords = vec2(dot(v_majorAxis, pointCoord), dot(v_minorAxis, pointCoord));
	float ellipseDist = dot(ellipseCoords, ellipseCoords);
	if (1.0 < ellipseDist){
		discard;
	}

	gl_FragColor = vec4(gl_PointCoord.x, gl_PointCoord.y, 0.0, 1.0);
}
`;

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

const generateLatticeFilter = function(in_sideLength, in_filterCallback){
	var arrayData = [];
	for (var x = 0; x < in_sideLength; ++x){
		for (var y = 0; y < in_sideLength; ++y){
			for (var z = 0; z < in_sideLength; ++z){
				if (true === in_filterCallback(in_sideLength, x, y, z)){
					arrayData.push(x);
					arrayData.push(y);
					arrayData.push(z);
				}
			}
		}
	}

	//return arrayData;
	const result = new Uint8Array(arrayData);
	return result;
}

const filterSolid = function(in_sideLength, in_x, in_y, in_z){
	return true;
}

const filterCallbackFactory = function(in_step){
	return function(in_sideLength, in_x, in_y, in_z){
		if (((0 === (in_y % in_step)) || (in_y === in_sideLength - 1)) &&
			((0 === (in_z % in_step)) || (in_z === in_sideLength - 1))){
				return true;
		}

		if (((0 === (in_x % in_step)) || (in_x === in_sideLength - 1)) &&
			((0 === (in_z % in_step)) || (in_z === in_sideLength - 1))){
				return true;
		}

		if (((0 === (in_x % in_step)) || (in_x === in_sideLength - 1)) &&
			((0 === (in_y % in_step)) || (in_y === in_sideLength - 1))){
				return true;
		}

		return false;	
	}
}

//export class App {
export const AppInner = class extends React.Component{
	constructor(in_props) {
		//console.log("App.constructor");
		super(in_props);
		this.onStart = this.onStart.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.localUniforMap = {};
		
		return;
	}
	onStart(in_context){
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			["a_position"], 
			[
				new Uniform("u_cameraPos", Uniform.type.float3),
				new Uniform("u_cameraAt", Uniform.type.float3),
				new Uniform("u_cameraUp", Uniform.type.float3),
				new Uniform("u_cameraRight", Uniform.type.float3),
				new Uniform("u_cameraFovhFovvFar", Uniform.type.float3),

				new Uniform("u_viewportWidthHeightWidthhalfHeighthalf", Uniform.type.float4),

				new Uniform("u_modelPos", Uniform.type.float3),
				new Uniform("u_modelAt", Uniform.type.float3),
				new Uniform("u_modelUp", Uniform.type.float3),
				new Uniform("u_modelRight", Uniform.type.float3),
				new Uniform("u_modelScale", Uniform.type.float1)
			]
			);
		const bufferWidth = in_context.getDrawingBufferWidth();
		const bufferHeight = in_context.getDrawingBufferHeight();

		this.localUniforMap["u_viewportWidthHeightWidthhalfHeighthalf"] = new UniformValue(new Float32Array([bufferWidth, bufferHeight, bufferWidth * 0.5, bufferHeight * 0.5]));

		this.material = in_context.createMaterial(
			this.shader, 
			this.props.uniformValueMap,
			undefined,
			true,
			Material.depthTestFlag.less
			);

		const pointGeometry = generateLatticeFilter(256, filterCallbackFactory(16));
		//const pointGeometry = generateLatticeFilter(1, filterSolid);
		console.log("geometry point count:" + (pointGeometry.length / 3));

		this.model = in_context.createModel(
			Model.modeEnum.points,
			pointGeometry.length / 3,
			[
				new DataStream("a_position", 3, pointGeometry)
			]
			);
	}

	onUpdate(in_context, in_timestamp){
		const localUniformMap = Object.assign({}, this.localUniforMap, this.props.uniformValueMap);
		this.material.setUniformValueMap(localUniformMap);

		in_context.clearColor(0.5, 0.5, 0.5, 1.0);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);

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
