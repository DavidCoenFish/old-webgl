import {ShaderResource} from "./shaderresource.js";

/*
rather than require to be told of context lost, do we get told the contextState changeID? ie, active shader is via contextState?

 */

export class Shader {
	constructor(
		in_vertexShaderSource, 
		in_fragmentShaderSource,
		in_attributeArray, // array of attribute names
		in_uniformArray // array of Uniform
	) {
		this.vertexShaderSource = in_vertexShaderSource;
		this.fragmentShaderSource = in_fragmentShaderSource;
		this.attributeArray = in_attributeArray;
		this.uniformArray = in_uniformArray;

		this.shaderResource = undefined;

		return;
	}

	aquireResource(in_contextPrivate){
		this.releaseResources(in_contextPrivate);
		this.shaderResource = new ShaderResource(
			in_contextPrivate, 
			this.vertexShaderSource,
			this.fragmentShaderSource,
			this.attributeArray,
			this.uniformArray
			);
		return;
	}

	//allow client to manually release resource once finished with them
	//not for dealing with lose of context
	releaseResources(in_contextPrivate){
		if (this.shaderResource !== undefined){
			this.shaderResource.release(in_contextPrivate);
		}
		this.shaderResource = undefined;
	}

	onContextLost(){
		console.log("shader onContextLost");
		this.shaderResource = undefined;
	}

	getAttributeMap(){
		if (undefined === this.shaderResource){
			return {};
		}
		return this.shaderResource.getAttributeMap();
	}

	getUniformArray(){
		return this.uniformArray;
	}

	getUniformMap(){
		if (undefined === this.shaderResource){
			return {};
		}
		return this.shaderResource.getUniformMap();
	}

	getProgramHandle(){
		if (undefined === this.shaderResource){
			return 0;
		}
		return this.shaderResource.getProgramHandle();
	}
}

