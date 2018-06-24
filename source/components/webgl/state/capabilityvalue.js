/*
could have used NumericValue1 but value is effectivly a bool
 */
export class CapabilityValue {
	constructor(in_updateStateFunction) {
		this.changeId = undefined;
		this.value = undefined;
		this.updateStateFunction = in_updateStateFunction;
	}

	updateState(in_webglContext, in_changeId, in_value){
		var update = false;
		if (in_changeId !== this.changeId){
			this.changeId = in_changeId;
			update = true;
		}
		if (in_value !== this.value){
			this.value = in_value;
			update = true;
		}
		if (true === update){
			this.updateStateFunction(in_webglContext, in_value);
		}
		return;
	}
}

const updateCapability = function(in_webglContext, in_capability, in_value){
	if (in_value === true){
		in_webglContext.enable(in_capability);
	} else {
		in_webglContext.disable(in_capability);
	}
	return;
}

export const updateCapabilityBlend = function(in_webglContext, in_value){
	//console.log("updateCapabilityBlend in_value:" + in_value);
	updateCapability(in_webglContext, in_webglContext.BLEND, in_value);
	return;
}

export const updateCapabilityCullFace = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.CULL_FACE, in_value);
	return;
}

export const updateCapabilityDepthTest = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.DEPTH_TEST, in_value);
	return;
}

export const updateCapabilityDither = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.DITHER, in_value);
	return;
}

export const updateCapabilityPolygonOffsetFill = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.POLYGON_OFFSET_FILL, in_value);
	return;
}

export const updateCapabilitySampleAlphaToCoverage = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.SAMPLE_ALPHA_TO_COVERAGE, in_value);
	return;
}

export const updateCapabilitySampleCoverage = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.SAMPLE_COVERAGE, in_value);
	return;
}

export const updateCapabilityScissorTest = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.SCISSOR_TEST, in_value);
	return;
}

export const updateCapabilityStencilTest = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.STENCIL_TEST, in_value);
	return;
}

//webgl2
export const updateCapabilityRasterizerDiscard = function(in_webglContext, in_value){
	updateCapability(in_webglContext, in_webglContext.RASTERIZER_DISCARD, in_value);
	return;
}
