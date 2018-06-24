import { assertAlways } from "../../../../assert";

export class ShaderResource {
	constructor(
		in_contextPrivate, 
		in_vertexShaderSource,
		in_fragmentShaderSource,
		in_attributeArray, 
		in_uniformArray
	){
		this.vertexShaderHandle = in_contextPrivate.loadVertexShader(in_vertexShaderSource);
		this.fragmentShaderHandle = in_contextPrivate.loadFragmentShader(in_fragmentShaderSource);
		this.attributeMap = {};
		this.uniformMap = {};
		this.programHandle = in_contextPrivate.createProgram(this.vertexShaderHandle, this.fragmentShaderHandle, in_attributeArray, in_uniformArray, this.attributeMap, this.uniformMap);
	}

	release(in_contextPrivate){
		if (0 !== this.programHandle){
			in_contextPrivate.destroyProgram(this.programHandle);
			this.programHandle = 0;
		}
		if (0 !== this.vertexShaderHandle){
			in_contextPrivate.deleteShader(this.vertexShaderHandle);
			this.vertexShaderHandle = 0;
		}
		if (0 !== this.fragmentShaderHandle){
			in_contextPrivate.deleteShader(this.fragmentShaderHandle);
			this.fragmentShaderHandle = 0;
		}
		return;
	}

	getAttributeMap(){
		return this.attributeMap;
	}

	getUniformMap(){
		return this.uniformMap;
	}

	getProgramHandle(){
		return this.programHandle;
	}
}
