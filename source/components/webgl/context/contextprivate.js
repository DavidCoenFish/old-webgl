import {assert, assertAlways} from "./../../../assert.js";
import {Uniform} from "./../resource/shader/uniform.js";
import {WebglState} from "./../state/webglstate.js";

/*
	collect as much interaction with the webglContextElement as possible
 */
export class ContextPrivate {
	constructor(in_webContextElement, in_requestExtentionArray) {
		this.webContext = in_webContextElement;

		this.webglState = new WebglState(in_webContextElement);
		this.extentions = {};
		this.dealRequestExtention(in_requestExtentionArray);
	}

	onContextLost(){
		this.webglState.invalidateState();
		return;
	}
	
	onContextRestored(in_webContextElement){
		this.webglState.onContextRestored(in_webContextElement);
		this.webContext = in_webContextElement;
	}
	
	getDrawingBufferWidth(){
		return this.webContext.drawingBufferWidth;
	}
	
	getDrawingBufferHeight(){
		return this.webContext.drawingBufferHeight;
	}
	
	logParamaters(){
		const arrayExtention = this.webContext.getSupportedExtensions();
		console.log("arrayExtention:" + JSON.stringify(arrayExtention));
		const maxCombinedTextureImageUnits = this.webContext.getParameter(this.webContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS); //	GLint
		console.log("maxCombinedTextureImageUnits:" + maxCombinedTextureImageUnits);
		const maxCubeMapTextureSize = this.webContext.getParameter(this.webContext.MAX_CUBE_MAP_TEXTURE_SIZE); //GLint
		console.log("maxCubeMapTextureSize:" + maxCubeMapTextureSize);
		const maxFragmentUniformVectors = this.webContext.getParameter(this.webContext.MAX_FRAGMENT_UNIFORM_VECTORS); //GLint
		console.log("maxFragmentUniformVectors:" + maxFragmentUniformVectors);

		const maxRenderbufferSize = this.webContext.getParameter(this.webContext.MAX_RENDERBUFFER_SIZE); //GLint
		console.log("maxRenderbufferSize:" + maxRenderbufferSize);
		const maxTextureImageUnits = this.webContext.getParameter(this.webContext.MAX_TEXTURE_IMAGE_UNITS); //GLint
		console.log("maxTextureImageUnits:" + maxTextureImageUnits);
		const maxTextureSize = this.webContext.getParameter(this.webContext.MAX_TEXTURE_SIZE); //GLint
		console.log("maxTextureSize:" + maxTextureSize);
		const maxVaryingVectors = this.webContext.getParameter(this.webContext.MAX_VARYING_VECTORS); //GLint
		console.log("maxVaryingVectors:" + maxVaryingVectors);
		const maxVertexAttribs = this.webContext.getParameter(this.webContext.MAX_VERTEX_ATTRIBS); //GLint
		console.log("maxVertexAttribs:" + maxVertexAttribs);
		const maxVertexTextureImageUnits = this.webContext.getParameter(this.webContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS); //GLint
		console.log("maxVertexTextureImageUnits:" + maxVertexTextureImageUnits);
		const maxVertexUniformVectors = this.webContext.getParameter(this.webContext.MAX_VERTEX_UNIFORM_VECTORS); //GLint
		console.log("maxVertexUniformVectors:" + maxVertexUniformVectors);
		const maxViewportDims = this.webContext.getParameter(this.webContext.MAX_VIEWPORT_DIMS); //
		console.log("maxViewportDims:" + JSON.stringify(maxViewportDims));
		const aliasedLineWidthRange = this.webContext.getParameter(this.webContext.ALIASED_LINE_WIDTH_RANGE);
		console.log("aliasedLineWidthRange:" + aliasedLineWidthRange);

		const aliasedPointSizeRange = this.webContext.getParameter(this.webContext.ALIASED_POINT_SIZE_RANGE);
		console.log("aliasedPointSizeRange:" + aliasedPointSizeRange);

		const shaderPrecisionFormatHigh = this.webContext.getShaderPrecisionFormat(this.webContext.FRAGMENT_SHADER, this.webContext.HIGH_FLOAT);
		console.log("shaderPrecisionFormatHigh rangeMin:" + shaderPrecisionFormatHigh.rangeMin + " rangeMax:" + shaderPrecisionFormatHigh.rangeMax + " precision:" + shaderPrecisionFormatHigh.precision);
		const shaderPrecisionFormatMedium = this.webContext.getShaderPrecisionFormat(this.webContext.FRAGMENT_SHADER, this.webContext.MEDIUM_FLOAT);
		console.log("shaderPrecisionFormatMedium rangeMin:" + shaderPrecisionFormatMedium.rangeMin + " rangeMax:" + shaderPrecisionFormatMedium.rangeMax + " precision:" + shaderPrecisionFormatMedium.precision);
		const shaderPrecisionFormatLow = this.webContext.getShaderPrecisionFormat(this.webContext.FRAGMENT_SHADER, this.webContext.LOW_FLOAT);
		console.log("shaderPrecisionFormatLow rangeMin:" + shaderPrecisionFormatLow.rangeMin + " rangeMax:" + shaderPrecisionFormatLow.rangeMax + " precision:" + shaderPrecisionFormatLow.precision);

		const vendor = this.webContext.getParameter(this.webContext.VENDOR); //DOMString
		console.log("vendor:" + vendor);
		const version = this.webContext.getParameter(this.webContext.VERSION); //
		console.log("version:" + version);
		const shadingLanguageVersion = this.webContext.getParameter(this.webContext.SHADING_LANGUAGE_VERSION); //
		console.log("shadingLanguageVersion:" + shadingLanguageVersion);

		return;
	}

	getEnum(in_enumKey){
		return this.webContext[in_enumKey];
	}

	dealRequestExtention(in_requestExtentionArray){
		if (in_requestExtentionArray === undefined){
			return;
		}
		console.log("in_requestExtentionArray:" + JSON.stringify(in_requestExtentionArray));
		for (var forIndex = 0, forCount = in_requestExtentionArray.length; forIndex < forCount; ++forIndex) {
			const requestExtention = in_requestExtentionArray[forIndex];
			const extention = this.webContext.getExtension(requestExtention);
			if (null === extention){
				console.error("requested extention not found:" + requestExtention);
			} else {
				this.extentions[requestExtention] = extention;
				console.log("requested extention found:" + requestExtention);
			}
		}

		return;
	}

	loadVertexShader(in_shaderSource){
		return loadShader(this.webContext, in_shaderSource, this.webContext.VERTEX_SHADER);
	}

	loadFragmentShader(in_shaderSource){
		return loadShader(this.webContext, in_shaderSource, this.webContext.FRAGMENT_SHADER);
	}

	deleteShader(in_shaderHandle){
		this.webContext.deleteShader(in_shaderHandle);
		return;
	}

	createProgram(in_shaderVertexHandle, in_shaderFragmentHandle, in_attributeArray, in_uniformArray, out_attributeMap, out_uniformMap){
		const programHandle = this.webContext.createProgram();
		if ((0 == programHandle) || (undefined == programHandle))
			return 0;
		
		this.webContext.attachShader(programHandle, in_shaderVertexHandle);
		this.webContext.attachShader(programHandle, in_shaderFragmentHandle);
		
		for (var index = 0, count = in_attributeArray.length; index < count; ++index){
			var key = in_attributeArray[index];
			//console.info("attribute key:" + key + " index:" + index);
			this.webContext.bindAttribLocation(programHandle, index, key);
		}

		this.webContext.linkProgram(programHandle);
		const linked = this.webContext.getProgramParameter(programHandle, this.webContext.LINK_STATUS);

		if (!linked) {
			this.webContext.deleteProgram(programHandle);
			return 0;
		}

		//attributeArray
		for (var index = 0, count = in_attributeArray.length; index < count; ++index){
			var key = in_attributeArray[index];
			out_attributeMap[key] = this.webContext.getAttribLocation(programHandle, key);
		}

		//uniformArray
		for (var index = 0, count = in_uniformArray.length; index < count; ++index){
			var key = in_uniformArray[index].getName();
			out_uniformMap[key] = this.webContext.getUniformLocation(programHandle, key);
			//var test = this.m_webGL.getUniform(programHandle, uniform.m_location);
		}	
			
		return programHandle;

	}

	destroyProgram(in_programHandle){
		this.webContext.deleteProgram(in_programHandle);
		return;
	}
	
	createBuffer(in_arrayData, in_bufferObjectType, in_usage){
		const bufferObject = this.webContext.createBuffer();
		this.webContext.bindBuffer(in_bufferObjectType, bufferObject);
		this.webContext.bufferData(in_bufferObjectType, in_arrayData, in_usage);
		return bufferObject;
	}

	updateBuffer(in_bufferObject, in_arrayData, in_bufferObjectType, in_type){
		this.webContext.bindBuffer(in_bufferObjectType, bufferObject);
		this.webContext.bufferData(in_bufferObjectType, in_arrayData, in_type);
		return;
	}

	deleteBuffer(in_bufferObject){
		this.webContext.deleteBuffer(in_bufferObject);
		return;
	}

	clearColor(in_red, in_green, in_blue, in_alpha){
		this.webglState.setClearColor(in_red, in_green, in_blue, in_alpha);
		this.webContext.clear(this.webContext.COLOR_BUFFER_BIT);
		return;
	}

	clearColorDepth(in_red, in_green, in_blue, in_alpha, in_depth){
		this.webglState.setClearColor(in_red, in_green, in_blue, in_alpha);
		this.webglState.setClearDepth(in_depth);
		this.webContext.clear(this.webContext.COLOR_BUFFER_BIT | this.webContext.DEPTH_BUFFER_BIT);
		return;
	}

	setMaterial(in_materialOrUndefined){
		//console.log("setMaterial");

		const shader = (in_materialOrUndefined !== undefined) ? in_materialOrUndefined.getShader() : undefined;
		this.webglState.setShader(shader);

		if ((in_materialOrUndefined !== undefined) && (shader !== undefined)){
			const shaderUniformArray = shader.getUniformArray();
			const shaderUniformMap = shader.getUniformMap();
			const materialUniformMap = in_materialOrUndefined.getUniformValueMap();

			for (var forIndex = 0, forCount = shaderUniformArray.length; forIndex < forCount; ++forIndex) {
				const item = shaderUniformArray[forIndex];
				const name = item.getName();
				const type = item.getType();
				if ((name in shaderUniformMap) && (name in materialUniformMap)){
					const position = shaderUniformMap[name];
					const uniformValue = materialUniformMap[name];
					const value = uniformValue.getValue();
					//console.log("setMaterial name:" + name + " value:" + value + " position:" + position);
					setUniformValue(this.webContext, type, position, value);
				} else {
					throw new Error("setMaterial item from shader uniform missing from materialUniformMap name:" + name);
					console.log("setMaterial item from shader uniform missing from materialUniformMap name:" + name);
				}
			}
		}

		//texture
		const textureArray = (in_materialOrUndefined !== undefined) ? in_materialOrUndefined.getTextureArray() : undefined; 
		if (undefined !== textureArray){
			for (var index = 0, count = textureArray.length; index < count; ++index){
				var texture = textureArray[index];
				if (undefined === texture){
					deactivateTexture(this.webContext, index);
					continue;
				}
				const webglTexture = texture.getWebglTexture();
				activateTexture(this.webContext, index, webglTexture);
				// the "u_sampler0"... uniforms should already be set to the correct index of the texture in the shader
			}
		}

		const depthEnable = (in_materialOrUndefined !== undefined) ? in_materialOrUndefined.getDepthEnable() : false;
		this.webglState.setCapabilityDepthTest(depthEnable);
		if (true === depthEnable){
			const depthTest = in_materialOrUndefined.getDepthTest();
			this.webglState.setDepthFunc(depthTest);		
		}

		const blendEnable = (in_materialOrUndefined !== undefined) ? in_materialOrUndefined.getBlendEnable() : false;
		this.webglState.setCapabilityBlend(blendEnable);
		if (true === blendEnable){
			const blendSource = in_materialOrUndefined.getBlendSource();
			const blendDestination = in_materialOrUndefined.getBlendDestination();
			this.webglState.setBlendFunc(blendSource, blendDestination);
		}

		return;
	}

	drawModel(in_model, in_firstOrUndefined, in_countOrUndefined){
		//setup data
		const attributeMap = this.webglState.getShaderAttributeMap();
		const dataStreamArray = in_model.getDataStreamArray();
		const dataStreamResourceArray = in_model.getDataStreamResourceArray();
		for (var index = 0, forCount = dataStreamArray.length; index < forCount; ++index) {
			const dataStream = dataStreamArray[index];
			const dataStreamResource = dataStreamResourceArray[index];
			const name = dataStream.getName();
			if (!(name in attributeMap)) continue;
			const position = attributeMap[name];
			this.webContext.bindBuffer(this.webContext.ARRAY_BUFFER, dataStreamResource.getBufferObject());
			this.webContext.enableVertexAttribArray(position);

			const elementsPerVertex = dataStream.getElementsPerVertex();
			const type = dataStreamResource.getType();
			const normalise = dataStream.getNormalise();
			const stride = 0;
			const offset = 0;
			this.webContext.vertexAttribPointer(position, elementsPerVertex, type, normalise, stride, offset);
		};
		const elementIndexResource = in_model.getElementIndexResource();
		if (undefined !== elementIndexResource){
			this.webContext.bindBuffer(this.webContext.ELEMENT_ARRAY_BUFFER, elementIndexResource.getBufferObject());
		}

		//draw
		const mode = in_model.getMode();
		const first = (in_firstOrUndefined === undefined) ? 0 : in_firstOrUndefined;
		const count = (in_countOrUndefined === undefined) ? in_model.getElementCount() : in_countOrUndefined;
		if (undefined !== elementIndexResource){
			const elementByteSize = elementIndexResource.getByteSize();
			const elementType = elementIndexResource.getType();
			
			this.webContext.drawElements(mode, count, elementType, first * elementByteSize);
		} else {
			this.webContext.drawArrays(mode, first, count);
		}

		//teardown data
		for (var index = 0, forCount = dataStreamArray.length; index < forCount; ++index) {
			const dataStream = dataStreamArray[index];
			const name = dataStream.getName();
			if (!(name in attributeMap)) continue;
			const position = attributeMap[name];
			this.webContext.disableVertexAttribArray(position);
		}

		return;

	}

	createTexture(in_data, in_width, in_height, in_internalFormat, in_format, in_type, in_magFilter, in_minFilter, in_wrapS, in_wrapT){
		const webglTexture = this.webContext.createTexture();

		//console.log("textureImage2DInternal in_width:" + in_width + " in_height:" + in_height + " in_internalFormat:" + in_internalFormat + " in_format:" + in_format + " in_type:" + in_type);
		this.webContext.bindTexture(this.webContext.TEXTURE_2D, webglTexture);
		const internalFormat = this.webContext[in_internalFormat];
		const format = this.webContext[in_format];
		const type = this.webContext[in_type];
		this.webContext.texImage2D(
			this.webContext.TEXTURE_2D,		//GLenum target, 
			0,							//GLint level, 
			internalFormat,				//GLenum internalformat, 
			in_width,					//GLsizei width, 
			in_height,					//GLsizei height, 
			0,							//GLint border, 
			format,						//GLenum format, 
			type,						//GLenum type, 
			(undefined === in_data) ? null : in_data //ArrayBufferView? pixels
			);
		const magFilter = this.webContext[in_magFilter];
		const minFilter = this.webContext[in_minFilter];
		const wrapS = this.webContext[in_wrapS];
		const wrapT = this.webContext[in_wrapT];

		//console.log("textureImage2DInternal in_magFilter:" + in_magFilter + " in_minFilter:" + in_minFilter + " in_wrapS:" + in_wrapS + " in_wrapT:" + in_wrapT);
		//console.log("textureImage2DInternal magFilter:" + magFilter + " minFilter:" + minFilter + " wrapS:" + wrapS + " wrapT:" + wrapT);

		this.webContext.texParameteri(this.webContext.TEXTURE_2D, this.webContext.TEXTURE_MAG_FILTER, magFilter);
		this.webContext.texParameteri(this.webContext.TEXTURE_2D, this.webContext.TEXTURE_MIN_FILTER, minFilter);
		this.webContext.texParameteri(this.webContext.TEXTURE_2D, this.webContext.TEXTURE_WRAP_S, wrapS);
		this.webContext.texParameteri(this.webContext.TEXTURE_2D, this.webContext.TEXTURE_WRAP_T, wrapT);

		this.webContext.bindTexture(this.webContext.TEXTURE_2D, null);

		return webglTexture;
	}

	deleteTexture(in_webglTexture){
		this.webContext.deleteTexture(in_webglTexture);
		return;
	}

	createFramebuffer(in_attachmentArray){
		const framebuffer = this.webContext.createFramebuffer();
		this.webContext.bindFramebuffer(this.webContext.FRAMEBUFFER, framebuffer);

		for (var forIndex = 0, forCount = in_attachmentArray.length; forIndex < forCount; ++forIndex) {
			const item = in_attachmentArray[forIndex];

			const target = this.webContext[item.getTargetEnum()];
			const attachment = this.webContext[item.getAttachmentEnum()];
			const texTarget = this.webContext[item.getTexTargetEnum()];
			const texture = item.getTexture();
			const webglTexture = (undefined !== texture) ? texture.getWebglTexture() : undefined;
			const level = 0;
			this.webContext.framebufferTexture2D(
				target,
				attachment,
				texTarget,
				webglTexture,
				level
				);
		}

		const frameBufferStatus = this.webContext.checkFramebufferStatus(this.webContext.FRAMEBUFFER);
		if (this.webContext.FRAMEBUFFER_COMPLETE !== frameBufferStatus){
			assertAlways("failed to create frame buffer:" + frameBufferStatus);
		}

		this.webContext.bindFramebuffer(this.webContext.FRAMEBUFFER, null);
		return framebuffer;
	}

	deleteFramebuffer(in_framebuffer){
		this.webContext.deleteFramebuffer(in_framebuffer);
		return;
	}

	setRenderTarget(in_renderTarget){
		var frameBuffer = null;
		var bufferWidth = 0;
		var bufferHeight = 0;

		if (undefined !== in_renderTarget){
			bufferWidth = in_renderTarget.getWidth();
			bufferHeight = in_renderTarget.getHeight();
			frameBuffer = in_renderTarget.getFramebuffer();
		} else {
			bufferWidth = this.webContext.drawingBufferWidth;
			bufferHeight = this.webContext.drawingBufferHeight;
		}

		this.webglState.setViewport(0, 0, bufferWidth, bufferHeight);
		this.webContext.bindFramebuffer(this.webContext.FRAMEBUFFER, frameBuffer);

		return;
	}

	setViewport(in_x, in_y, in_width, in_height){
		this.webglState.setViewport(in_x, in_y, in_width, in_height);
	}
	

	deleteFramebuffer(in_framebuffer){
		this.webContext.deleteFramebuffer(in_framebuffer);
		return;
	}

	//return the open gl data type to match a the array type
	getDataArrayType(in_dataArray){
		if (in_dataArray !== undefined){
			if (in_dataArray instanceof Float32Array){
				return this.webContext.FLOAT;
			} else if (in_dataArray instanceof Int32Array){
				return this.webContext.INT;
			} else if (in_dataArray instanceof Uint32Array){
				return this.webContext.UNSIGNED_INT;
			} else if (in_dataArray instanceof Int16Array){
				return this.webContext.SHORT;
			} else if (in_dataArray instanceof Uint16Array){
				return this.webContext.UNSIGNED_SHORT;
			} else if (in_dataArray instanceof Int8Array){
				return this.webContext.BYTE;
			} else if (in_dataArray instanceof Uint8Array){
				return this.webContext.UNSIGNED_BYTE;
			}
		}
		console.error("attempt at determining the appropriate webgl array type for an " + typeof(in_dataArray));
		return undefined;
	}

	getDataArrayByteSize(in_dataArrayType){
		switch (in_dataArrayType){
			default:
				break;
			case this.webContext.FLOAT:
			case this.webContext.INT:
			case this.webContext.UNSIGNED_INT:
				return 4;
			case this.webContext.SHORT:
			case this.webContext.UNSIGNED_SHORT:
				return 2;
			case this.webContext.BYTE:
			case this.webContext.UNSIGNED_BYTE:
				return 1;
		}
		return undefined;
	}
};

const loadShader = function(in_webContext, in_shaderSource, in_type){
	var shaderHandle = in_webContext.createShader(in_type);	
	if (shaderHandle == 0) {
		return shaderHandle;
	}
		
	in_webContext.shaderSource(shaderHandle, in_shaderSource);
	in_webContext.compileShader(shaderHandle);

	const compiled = in_webContext.getShaderParameter(shaderHandle, in_webContext.COMPILE_STATUS);		

	var errorInfo = "";
	if (!compiled) {
		errorInfo = in_webContext.getShaderInfoLog(shaderHandle);

		// If the compilation failed, delete the shader.
		in_webContext.deleteShader(shaderHandle);

		shaderHandle = 0;
	}

	if (shaderHandle === 0){
		assertAlways("Error creating shader: " + errorInfo);
	}
	
	return shaderHandle;
}

const setUniformValue = function(in_webContext, in_type, in_position, in_value){
	switch(in_type){
		default:
			console.log("unknown type in setUniformValue type:" + in_type);
			break;
		case Uniform.type.float1:
			in_webContext.uniform1fv(in_position, in_value);
			break;
		case Uniform.type.float2:
			in_webContext.uniform2fv(in_position, in_value);
			break;
		case Uniform.type.float3:
			in_webContext.uniform3fv(in_position, in_value);
			break;
		case Uniform.type.float4:
			in_webContext.uniform4fv(in_position, in_value);
			break;
		case Uniform.type.int1:
			in_webContext.uniform1iv(in_position, in_value);
			break;
		case Uniform.type.int2:
			in_webContext.uniform2iv(in_position, in_value);
			break;
		case Uniform.type.int3:
			in_webContext.uniform3iv(in_position, in_value);
			break;
		case Uniform.type.int4:
			in_webContext.uniform4iv(in_position, in_value);
			break;
		case Uniform.type.matrix2:
			in_webContext.uniformMatrix2fv(in_position, false, in_value);
			break;
		case Uniform.type.matrix3:
			in_webContext.uniformMatrix3fv(in_position, false, in_value);
			break;
		case Uniform.type.matrix4: 
			in_webContext.uniformMatrix4fv(in_position, false, in_value);
			break;
	}
	return;
}

const activateTexture = function(in_webContext, in_index, in_webglTexture){
	in_webContext.activeTexture(in_webContext.TEXTURE0 + in_index);
	in_webContext.bindTexture(in_webContext.TEXTURE_2D, in_webglTexture);
	return;
}

const deactivateTexture = function(in_webContext, in_index){
	in_webContext.activeTexture(in_webContext.TEXTURE0 + in_index);
	in_webContext.bindTexture(in_webContext.TEXTURE_2D, undefined);
	return;
}

