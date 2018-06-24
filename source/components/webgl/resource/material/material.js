import { MaterialResource } from "./materialresource.js";

export class Material {
	constructor(
		in_shader, 
		in_uniformValueMapOrUndefined, 
		in_textureArrayOrUndefined,
		in_depthEnableOrUndefined,
		in_depthTestFlagOrUndefined,
		in_blendEnableOrUndefined,
		in_blendSourceFlagOrUndefined,
		in_blendDestinationFlagOrUndefined,
		) {
		this.shader = in_shader;
		this.uniformValueMap = (undefined === in_uniformValueMapOrUndefined) ? {} : in_uniformValueMapOrUndefined;
		this.textureArray = in_textureArrayOrUndefined;
		this.depthEnable = (undefined === in_depthEnableOrUndefined) ? false : in_depthEnableOrUndefined;
		this.depthTestFlag = (undefined === in_depthTestFlagOrUndefined) ? Material.depthTestFlag.none : in_depthTestFlagOrUndefined;
		this.blendEnable = (undefined === in_blendEnableOrUndefined) ? false : in_blendEnableOrUndefined;
		this.blendSourceFlag = (undefined === in_blendSourceFlagOrUndefined) ? Material.blendFlag.one : in_blendSourceFlagOrUndefined;
		this.blendDestinationFlag = (undefined === in_blendDestinationFlagOrUndefined) ? Material.blendFlag.zero : in_blendDestinationFlagOrUndefined;

		this.materialResource = undefined;
	}

	aquireResource(in_contextPrivate){
		this.materialResource = new MaterialResource(
			in_contextPrivate, 
			this.depthTestFlag,
			this.blendSourceFlag,
			this.blendDestinationFlag
			);
		return;
	}

	releaseResources(in_contextPrivate){
		this.modelResource = undefined;
		return;
	}

	onContextLost(){
		this.modelResource = undefined;
		return;
	}


	getShader() {
		return this.shader;
	}

	getUniformValueMap() {
		return this.uniformValueMap;
	}

	setUniformValueMap(in_uniformValueMap) {
		this.uniformValueMap = in_uniformValueMap;
		return;
	}

	getDepthEnable() {
		return this.depthEnable;
	}

	getDepthTest() {
		if(undefined !== this.materialResource){
			return this.materialResource.getDepthTest();
		}
		return undefined;
	}

	getBlendEnable() {
		return this.blendEnable;
	}

	getBlendSource() {
		if(undefined !== this.materialResource){
			return this.materialResource.getBlendSource();
		}
		return undefined;
	}

	getBlendDestination() {
		if(undefined !== this.materialResource){
			return this.materialResource.getBlendDestination();
		}
		return undefined;
	}

	getTextureArray() {
		return this.textureArray;
	}

	setTextureArray(in_textureArray) {
		this.textureArray = in_textureArray;
		return;
	}
	
}

Material.depthTestFlag = {
	less : "LESS",
	lessOrEqual : "LEQUAL",
	greater : "GREATER",
	always : "ALWAYS",
};

Material.blendFlag = {
	zero : "ZERO",
	one : "ONE",
	srcColor : "SRC_COLOR",
	oneMinusSrcColor : "ONE_MINUS_SRC_COLOR",
	srcAlpha : "SRC_ALPHA",
	oneMinusSrcAlpha : "ONE_MINUS_SRC_ALPHA",
	dstAlpha : "DST_ALPHA",
	oneMinusDstAlpha : "ONE_MINUS_DST_ALPHA",
	dstColor : "DST_COLOR", //src only
	oneMinusDstColor : "ONE_MINUS_DST_COLOR", //src only
	srcAlphaSaturate : "SRC_ALPHA_SATURATE" //src only
};
