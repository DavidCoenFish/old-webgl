import {assert, assertAlways} from "./../../../assert.js";
import {Uniform} from "./../resource/shader/uniform.js";
import {ContextPrivate} from "./contextprivate.js";
import {ResourceManager} from "./../resource/resourcemanager.js";

/*
	collecting into one spot all the knowledge about how to use webgl, 
	and making the leaf classes (shader, model) move towards just being data/ resource holders...?
	see WebglState for setting state

	todo. change ContextHelper into class (Context? Webgl?) with children in_webContext and in_webglState)

 */
export class Context {
	constructor(in_webContextElement, in_requestExtentionArray) {
		this.contextPrivate = new ContextPrivate(in_webContextElement, in_requestExtentionArray);
		this.resourceManager = new ResourceManager(this.contextPrivate);
	}

	onContextLost(){
		this.contextPrivate.onContextLost();
		this.resourceManager.onContextLost();
		return;
	}
	onContextRestored(in_webContextElement){
		this.contextPrivate.onContextRestored(in_webContextElement);
		this.resourceManager.onContextRestored(this.contextPrivate);
		return;
	}

	getDrawingBufferWidth(){
		return this.contextPrivate.getDrawingBufferWidth();
	}
	
	getDrawingBufferHeight(){
		return this.contextPrivate.getDrawingBufferHeight();
	}

	clearColor(in_red, in_green, in_blue, in_alpha){
		this.contextPrivate.clearColor(in_red, in_green, in_blue, in_alpha);
		return;
	}

	clearColorDepth(in_red, in_green, in_blue, in_alpha, in_depth){
		this.contextPrivate.clearColorDepth(in_red, in_green, in_blue, in_alpha, in_depth);
		return;
	}

	setRenderTarget(in_renderTarget){
		this.contextPrivate.setRenderTarget(in_renderTarget);
	}

	setViewport(in_x, in_y, in_width, in_height){
		this.contextPrivate.setViewport(in_x, in_y, in_width, in_height);
	}

	setMaterial(in_material){
		this.contextPrivate.setMaterial(in_material);
	}

	drawModel(in_model, in_firstOrUndefined, in_countOrUndefined){
		this.contextPrivate.drawModel(in_model, in_firstOrUndefined, in_countOrUndefined);
	}

	releaseResource(in_resource) {
		this.resourceManager.releaseResource(in_resource);
		return;
	}

	releaseResourceAll() {
		this.resourceManager.releaseResourceAll();
		return;
	}

	createModel(
		in_mode,
		in_elementCount,
		in_dataStreamArray,
		in_elementIndexArrayOrUndefined) {
		return this.resourceManager.createModel(
			in_mode,
			in_elementCount,
			in_dataStreamArray,
			in_elementIndexArrayOrUndefined
			);
	}

	createShader(
		in_vertexShaderSource, 
		in_fragmentShaderSource,
		in_attributeArray, 
		in_uniformArray){
		return this.resourceManager.createShader(
			in_vertexShaderSource, 
			in_fragmentShaderSource,
			in_attributeArray, 
			in_uniformArray);
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
		return this.resourceManager.createMaterial(
			in_shader,
			in_uniformValueMapOrUndefined, 
			in_textureArrayOrUndefined,
			in_depthEnableOrUndefined,
			in_depthTestFlagOrUndefined,
			in_blendEnableOrUndefined,
			in_blendSourceFlagOrUndefined,
			in_blendDestinationFlagOrUndefined		
			);
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
		return this.resourceManager.createTexture(
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
	}
	
	createRenderTarget(
		in_attachmentArray,
		in_width,
		in_height
		){
		return this.resourceManager.createRenderTarget(
			in_attachmentArray,
			in_width,
			in_height
			);
	}


};
