import {Material} from "./material/material.js";
import {Model} from "./model/model.js";
import {Shader} from "./shader/shader.js";
import {RenderTarget} from "./rendertarget/rendertarget.js";
import {Texture} from "./texture/texture.js";

export class ResourceManager {
	constructor(in_contextPrivate) {
		this.contextPrivate = in_contextPrivate;
		this.resourceArray = [];
	}

	onContextLost() {
		console.log("ResourceManager.onContextLost this.resourceArray.length:" + this.resourceArray.length);
		for (var index = 0, count = this.resourceArray.length; index < count; ++index) {
			var item = this.resourceArray[index];
			item.onContextLost();
		}
		return;
	}

	onContextRestored() {
		for (var index = 0, count = this.resourceArray.length; index < count; ++index) {
			var item = this.resourceArray[index];
			item.aquireResource(this.contextPrivate);
		}
		return;
	}

	releaseResource(in_resource) {
		in_resource.releaseResources(this.contextPrivate);
		const index = this.resourceArray.indexOf(in_resource);
		if (index !== -1){
			this.resourceArray.splice(index, 1);
		}
		return;
	}

	releaseResourceAll() {
		for (var index = 0, count = this.resourceArray.length; index < count; ++index) {
			var item = this.resourceArray[index];
			item.releaseResources(this.contextPrivate);
		}
		this.resourceArray.length = 0;
		return;
	}

	createModel(
		in_mode,
		in_elementCount,
		in_dataStreamArray,
		in_elementIndexArrayOrUndefined) {
		const model = new Model(in_mode, in_elementCount, in_dataStreamArray, in_elementIndexArrayOrUndefined);
		model.aquireResource(this.contextPrivate);
		this.resourceArray.push(model);
		return model;
	}

	createShader(
		in_vertexShaderSource, 
		in_fragmentShaderSource,
		in_attributeArray, 
		in_uniformArray){
		const shader = new Shader(in_vertexShaderSource, in_fragmentShaderSource, in_attributeArray, in_uniformArray);
		shader.aquireResource(this.contextPrivate);
		this.resourceArray.push(shader);
		return shader;
	}

	createMaterial(
		in_shader,
		in_uniformValueMapOrUndefined, 
		in_textureArrayOrUndefined,
		in_depthEnableOrUndefined,
		in_depthTestFlagOrUndefined,
		in_blendEnableOrUndefined,
		in_blendSourceFlagOrUndefined,
		in_blendDestinationFlagOrUndefined		
		){
		const material = new Material(
			in_shader,
			in_uniformValueMapOrUndefined, 
			in_textureArrayOrUndefined,
			in_depthEnableOrUndefined,
			in_depthTestFlagOrUndefined,
			in_blendEnableOrUndefined,
			in_blendSourceFlagOrUndefined,
			in_blendDestinationFlagOrUndefined		
			);
		material.aquireResource(this.contextPrivate);
		this.resourceArray.push(material);
		return material;
	}

	createTexture(
		in_data, 
		in_width, 
		in_height,
		in_internalFormatOrUndefined,
		in_formatOrUndefined,
		in_typeOrUndefined,
		in_magFilterOrUndefined,
		in_minFilterOrUndefined,
		in_wrapSOrUndefined,
		in_wrapTOrUndefined){
		const texture = new Texture(
			in_data, 
			in_width, 
			in_height,
			in_internalFormatOrUndefined,
			in_formatOrUndefined,
			in_typeOrUndefined,
			in_magFilterOrUndefined,
			in_minFilterOrUndefined,
			in_wrapSOrUndefined,
			in_wrapTOrUndefined
			);
		texture.aquireResource(this.contextPrivate);
		this.resourceArray.push(texture);
		return texture;
	}
	
	createRenderTarget(
		in_attachmentArray,
		in_width,
		in_height
		){
		const renderTarget = new RenderTarget(
			in_attachmentArray,
			in_width,
			in_height
			);
		renderTarget.aquireResource(this.contextPrivate);
		this.resourceArray.push(renderTarget);
		return renderTarget;
	}

}
