import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";
import {Texture} from "./../../components/webgl/resource/texture/texture.js";
import {Material} from "./../../components/webgl/resource/material/material.js";
import {RenderTarget} from "./../../components/webgl/resource/rendertarget/rendertarget.js";
import {Attachment} from "./../../components/webgl/resource/rendertarget/attachment.js";


const sVertexShaderSource = `
attribute vec4 a_positionWeight;
attribute vec3 a_uv;

varying vec3 v_position;

uniform vec3 u_modelPos;
uniform vec3 u_modelAt;
uniform vec3 u_modelUp;
uniform vec3 u_modelRight;
uniform vec4 u_modelScaleDensitySpringconstantSpringdampen;

vec3 getAtomPosition(){
	float x = a_positionWeight.x + (mod(a_positionWeight.y, 2.0) * 0.5) - (mod(a_positionWeight.z, 2.0) * 0.5);
	float y = (a_positionWeight.y * 0.86602540378443864676372317075294) + (mod(a_positionWeight.z, 2.0) * 0.28867513459481288225457439025098);
	float z = 	a_positionWeight.z * 0.81649658092772603273242802490196;
	float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
	vec3 pos = u_modelPos + (((u_modelRight * x) + (u_modelUp * y) + (u_modelAt * z)) * modelScale);
	return pos;
}

void main() {
	vec3 pos = getAtomPosition();
	gl_Position = vec4((a_uv.x - 0.5) * 2.0, (a_uv.y - 0.5) * 2.0, 0.0, 1.0);
	gl_PointSize = 1.0;
	v_position = pos;
}
`;

const sFragmentShaderSource = `
precision mediump float;
varying vec3 v_position;
void main() {
	gl_FragColor = vec4(v_position, 1.0);
}
`;

		/* 

0,2,1		1,2,1		2,2,1
	  \		/	  \		/	  \
		0,1,1		1,1,1		2,1,1
	  /		\	  /		\	  /
0,0,1		1,0,1		2,0,1
	
	0,2,0		1,2,0		2,2,0
		  \		/	  \		/	  \
			0,1,0	-	1,1,0	-	2,1,0
		  /		\	  /		\	  /
	0,0,0	-	1,0,0	-	2,0,0
		*/

const generateUvHash = function(in_x, in_y, in_z){
	return "" + in_x + "_" + in_y + "_" + in_z;
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

const filterPair = function(in_sideLength, in_x, in_y, in_z){
	if ((0 === in_x) && (0 === in_y) && (0 === in_z)){
		return true;
	}
	if ((1 === in_x) && (0 === in_y) && (0 === in_z)){
		return true;
	}
	return false;
}

const fliterWeightSolid = function(in_sideLength, in_x, in_y, in_z){
	return 1.0;
}

const fliterWeightPair = function(in_sideLength, in_x, in_y, in_z){
	if ((0 === in_x) && (0 === in_y) && (0 === in_z)){
		return 0.0;
	}
	return 1.0;
}

//var gDebugMessageHash = "";
const addLinkUvWeight = function(in_linkUvWeightData, in_x, in_y, in_z, in_uvHashmap){
	var u = 0.0;
	var v = 0.0;
	var w = 0.0;
	const hash = generateUvHash(in_x, in_y, in_z);
	const data = in_uvHashmap[hash];
	if (data !== undefined){
		u = data[0];
		v = data[1];
		w = 1;
		//console.log(" link uv found for:" + gDebugMessageHash + " and " + hash);
	}
	in_linkUvWeightData.push(u);
	in_linkUvWeightData.push(v);
	in_linkUvWeightData.push(w);
	return;
}

/*
result object
{
	positionWeightData,
	uvData,
	linkUvWeightData,
	textureSize,
}
 */
const generateGeometryData = function(in_length, in_filterCallback, in_fliterWeightCallback){
	var result = {};

	const positionData = generateLatticeFilter(in_length, in_filterCallback);
	const vertexCount = positionData.length / 3;

	var positionWeightData = [];
	for (var index = 0; index < vertexCount; ++index){
		const x = positionData[(index * 3) + 0];
		const y = positionData[(index * 3) + 1];
		const z = positionData[(index * 3) + 2];
		positionWeightData.push(x);
		positionWeightData.push(y);
		positionWeightData.push(z);
		//const weight = (index === 0) ? 0.0 : 1.0;
		const weight = in_fliterWeightCallback(in_length, x, y, z);
		positionWeightData.push(weight);
	}
	result.positionWeightData = new Uint8Array(positionWeightData);

	result.textureSize = (vertexCount !== 0) ? Math.pow(2, Math.ceil(Math.log2(Math.sqrt(vertexCount)))) : 1;

	const textureUVnudge = 0.5 / result.textureSize;
	var uvHashmap = {};
	var uvData = [];
	for (var index = 0; index < vertexCount; ++index){
		const x = positionData[(index * 3) + 0];
		const y = positionData[(index * 3) + 1];
		const z = positionData[(index * 3) + 2];
		const hash = generateUvHash(x, y, z);
		const indexMod = index % result.textureSize;
		const uvX = (indexMod / result.textureSize) + textureUVnudge;
		const uvY = (((index - indexMod) / result.textureSize) / result.textureSize) + textureUVnudge;

		uvHashmap[hash] = [uvX, uvY];
		uvData.push(uvX);
		uvData.push(uvY);
	}
	result.uvData = new Float32Array(uvData);

	var linkUvWeight0Data = [];
	var linkUvWeight1Data = [];
	var linkUvWeight2Data = [];
	var linkUvWeight3Data = [];
	var linkUvWeight4Data = [];
	var linkUvWeight5Data = [];
	var linkUvWeight6Data = [];
	var linkUvWeight7Data = [];
	var linkUvWeight8Data = [];
	var linkUvWeight9Data = [];
	var linkUvWeight10Data = [];
	var linkUvWeight11Data = [];
	for (var index = 0; index < vertexCount; ++index){
		const x = positionData[(index * 3) + 0];
		const y = positionData[(index * 3) + 1];
		const z = positionData[(index * 3) + 2];
		//gDebugMessageHash = generateUvHash(x, y, z);

		//do the middle 6
		const yEven = (0 === (y % 2));
		addLinkUvWeight(linkUvWeight0Data, x + ((yEven) ? -1 : 0), y - 1, z, uvHashmap);
		addLinkUvWeight(linkUvWeight1Data, x + ((yEven) ? 0 : 1), y - 1, z, uvHashmap);
		addLinkUvWeight(linkUvWeight2Data, x - 1, y, z, uvHashmap);
		addLinkUvWeight(linkUvWeight3Data, x + 1, y, z, uvHashmap);
		addLinkUvWeight(linkUvWeight4Data, x + ((yEven) ? -1 : 0), y + 1, z, uvHashmap);
		addLinkUvWeight(linkUvWeight5Data, x + ((yEven) ? 0 : 1), y + 1, z, uvHashmap);

		const zEven = (0 === (z % 2));
		//do top,bottom even
		if (true === zEven){
			addLinkUvWeight(linkUvWeight6Data, x + ((yEven) ? 0 : 1), y - 1, z + 1, uvHashmap);
			addLinkUvWeight(linkUvWeight7Data, x, y, z + 1, uvHashmap);
			addLinkUvWeight(linkUvWeight8Data, x + 1, y, z + 1, uvHashmap);

			addLinkUvWeight(linkUvWeight9Data, x + ((yEven) ? 0 : 1), y - 1, z - 1, uvHashmap);
			addLinkUvWeight(linkUvWeight10Data, x, y, z - 1, uvHashmap);
			addLinkUvWeight(linkUvWeight11Data, x + 1, y, z - 1, uvHashmap);
		} else {
			addLinkUvWeight(linkUvWeight6Data, x + ((yEven) ? -1 : 0), y + 1, z + 1, uvHashmap);
			addLinkUvWeight(linkUvWeight7Data, x - 1, y, z + 1, uvHashmap);
			addLinkUvWeight(linkUvWeight8Data, x, y, z + 1, uvHashmap);

			addLinkUvWeight(linkUvWeight9Data, x + ((yEven) ? -1 : 0), y + 1, z - 1, uvHashmap);
			addLinkUvWeight(linkUvWeight10Data, x - 1, y, z - 1, uvHashmap);
			addLinkUvWeight(linkUvWeight11Data, x, y, z - 1, uvHashmap);
		}
	}
	result.linkUvWeight0Data = new Float32Array(linkUvWeight0Data);
	result.linkUvWeight1Data = new Float32Array(linkUvWeight1Data);
	result.linkUvWeight2Data = new Float32Array(linkUvWeight2Data);
	result.linkUvWeight3Data = new Float32Array(linkUvWeight3Data);
	result.linkUvWeight4Data = new Float32Array(linkUvWeight4Data);
	result.linkUvWeight5Data = new Float32Array(linkUvWeight5Data);
	result.linkUvWeight6Data = new Float32Array(linkUvWeight6Data);
	result.linkUvWeight7Data = new Float32Array(linkUvWeight7Data);
	result.linkUvWeight8Data = new Float32Array(linkUvWeight8Data);
	result.linkUvWeight9Data = new Float32Array(linkUvWeight9Data);
	result.linkUvWeight10Data = new Float32Array(linkUvWeight10Data);
	result.linkUvWeight11Data = new Float32Array(linkUvWeight11Data);

	return result;
}

const makeTexture = function(in_context, in_textureSize){
	return in_context.createTexture(
		undefined, 
		in_textureSize, 
		in_textureSize,
		Texture.imageFormatEnum.rgba,
		Texture.imageFormatEnum.rgba,
		Texture.typeEnum.float,
		Texture.magnificationFilter.nearest,
		Texture.minificationFilter.nearest,
		Texture.wrapEnum.clampToEdge,
		Texture.wrapEnum.clampToEdge
		);
}

const makeRenderTarget = function(in_context, in_textureSize, in_texture){
	return in_context.createRenderTarget(
		[
			new Attachment(
				Attachment.targetEnum.framebuffer,
				Attachment.attachmentEnum.colorAttachment0,
				Attachment.textureTargetEnum.texture2d,
				in_texture
				)
		],
		in_textureSize,
		in_textureSize
		);
}

export class Assets {
	constructor(in_context, in_uniformValueMap) {
		this.oldNewIndex = 0;

		//const geometryData = generateGeometryData(3, filterSolid, fliterWeightSolid);
		const geometryData = generateGeometryData(2, filterPair, fliterWeightPair);

		//console.log("geometryData:" + JSON.stringify(geometryData));

		this.model = in_context.createModel(
			Model.modeEnum.points,
			geometryData.positionWeightData.length / 4,
			[
				new DataStream("a_positionWeight", 4, geometryData.positionWeightData),
				new DataStream("a_uv", 2, geometryData.uvData), // the uv for this vertex
				new DataStream("a_linkUvw0", 3, geometryData.linkUvWeight0Data), //the uv and weight of each link, weight zero indicates link not in use 
				new DataStream("a_linkUvw1", 3, geometryData.linkUvWeight1Data),
				new DataStream("a_linkUvw2", 3, geometryData.linkUvWeight2Data),
				new DataStream("a_linkUvw3", 3, geometryData.linkUvWeight3Data),
				new DataStream("a_linkUvw4", 3, geometryData.linkUvWeight4Data),
				new DataStream("a_linkUvw5", 3, geometryData.linkUvWeight5Data),
				new DataStream("a_linkUvw6", 3, geometryData.linkUvWeight6Data),
				new DataStream("a_linkUvw7", 3, geometryData.linkUvWeight7Data),
				new DataStream("a_linkUvw8", 3, geometryData.linkUvWeight8Data),
				new DataStream("a_linkUvw9", 3, geometryData.linkUvWeight9Data),
				new DataStream("a_linkUvw10", 3, geometryData.linkUvWeight10Data),
				new DataStream("a_linkUvw11", 3, geometryData.linkUvWeight11Data),
			],
			);

		var tempTexture = undefined;

		this.texturePosition = [];
		this.renderTargetPosition = [];
		tempTexture = makeTexture(in_context, geometryData.textureSize);
		this.texturePosition.push(tempTexture);
		this.renderTargetPosition.push(makeRenderTarget(in_context, geometryData.textureSize, tempTexture));
		tempTexture = makeTexture(in_context, geometryData.textureSize);
		this.texturePosition.push(tempTexture);
		this.renderTargetPosition.push(makeRenderTarget(in_context, geometryData.textureSize, tempTexture));

		this.textureVelocity = [];
		this.renderTargetVelocity = [];
		tempTexture = makeTexture(in_context, geometryData.textureSize);
		this.textureVelocity.push(tempTexture);
		this.renderTargetVelocity.push(makeRenderTarget(in_context, geometryData.textureSize, tempTexture));
		tempTexture = makeTexture(in_context, geometryData.textureSize);
		this.textureVelocity.push(tempTexture);
		this.renderTargetVelocity.push(makeRenderTarget(in_context, geometryData.textureSize, tempTexture));

		this.resetPositionShader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			[
				"a_positionWeight", "a_uv", 
			], 
			[
				new Uniform("u_modelPos", Uniform.type.float3),
				new Uniform("u_modelAt", Uniform.type.float3),
				new Uniform("u_modelUp", Uniform.type.float3),
				new Uniform("u_modelRight", Uniform.type.float3),
				new Uniform("u_modelScaleDensitySpringconstantSpringdampen", Uniform.type.float4)
			]
			);
		this.resetPositionMaterial = in_context.createMaterial(
			this.resetPositionShader,
			in_uniformValueMap
			);

		this.reset(in_context, in_uniformValueMap);

		return;
	}

	getModel(){
		return this.model;
	}

	getRenderTargetPosition(){
		return this.renderTargetPosition[this.oldNewIndex];
	}

	getRenderTargetPositionOld(){
		return this.renderTargetPosition[this.oldNewIndex ^ 1];
	}

	getTexturePosition(){
		return this.texturePosition[this.oldNewIndex];
	}

	getTexturePositionOld(){
		return this.texturePosition[this.oldNewIndex ^ 1];
	}

	getRenderTargetVelocity(){
		return this.renderTargetVelocity[this.oldNewIndex];
	}

	getRenderTargetVelocityOld(){
		return this.renderTargetVelocity[this.oldNewIndex ^ 1];
	}

	getTextureVelocity(){
		return this.textureVelocity[this.oldNewIndex];
	}

	getTextureVelocityOld(){
		return this.textureVelocity[this.oldNewIndex ^ 1];
	}

	reset(in_context, in_uniformValueMap){
		console.log("reset");
		this.oldNewIndex = 0;
		for (var index = 0; index < 2; ++index){
			in_context.setRenderTarget(this.renderTargetVelocity[index]);
			in_context.clearColor(0.0, 0.0, 0.0, 1.0);

			//and set the position texture
			in_context.setRenderTarget(this.renderTargetPosition[index]);
			in_context.clearColor(0.0, 0.0, 0.0, 1.0);
			this.resetPositionMaterial.setUniformValueMap(in_uniformValueMap);

			in_context.setMaterial(this.resetPositionMaterial)
			in_context.drawModel(this.model);
		}
	}

	setIndexToIndexOld(){
		this.oldNewIndex ^= 1;
	}

}
