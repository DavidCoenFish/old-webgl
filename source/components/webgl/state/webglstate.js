import {NumericValue1, updateStateClearDepth, updateStateClearStencil, updateStateFrontFace, updateStateCullFace, updateStateDepthFunc } from "./numericvalue1.js";
import {NumericValue2, updateStateBlendFunc} from "./numericvalue2.js";
import {NumericValue4, updateStateClearColor, updateStateViewport} from "./numericvalue4.js";
import {CapabilityValue, updateCapabilityBlend, updateCapabilityCullFace, updateCapabilityDepthTest, updateCapabilityDither, updateCapabilityPolygonOffsetFill, updateCapabilitySampleAlphaToCoverage, updateCapabilitySampleCoverage, updateCapabilityScissorTest, updateCapabilityStencilTest, updateCapabilityRasterizerDiscard} from "./capabilityvalue.js";
import {ShaderValue} from "./shadervalue.js";

/*
webGl state changes are expensive, so cache the values that we assign to the state on the webglContext
loss of context will cause all state to be invalidated...
 */
export class WebglState {
	constructor(in_webContextElement) {
		this.webContext = in_webContextElement;

		this.changeId = 0; //rather than have a dirty bool in each item
		
		this.viewport = new NumericValue4(updateStateViewport);

		this.clearColor = new NumericValue4(updateStateClearColor);
		this.clearDepth = new NumericValue1(updateStateClearDepth);
		this.clearStencil = new NumericValue1(updateStateClearStencil);

		this.frontFace = new NumericValue1(updateStateFrontFace);
		this.cullFace = new NumericValue1(updateStateCullFace);
		this.blendFunc = new NumericValue2(updateStateBlendFunc);
		this.depthFunc = new NumericValue1(updateStateDepthFunc);

		this.capabilityBlend = new CapabilityValue(updateCapabilityBlend);
		this.capabilityCullFace = new CapabilityValue(updateCapabilityCullFace);
		this.capabilityDepthTest = new CapabilityValue(updateCapabilityDepthTest);
		this.capabilityDither = new CapabilityValue(updateCapabilityDither);
		this.capabilityPolygonOffsetFill = new CapabilityValue(updateCapabilityPolygonOffsetFill);
		this.capabilitySampleAlphaToCoverage = new CapabilityValue(updateCapabilitySampleAlphaToCoverage);
		this.capabilitySampleCoverage = new CapabilityValue(updateCapabilitySampleCoverage);
		this.capabilityScissorTest = new CapabilityValue(updateCapabilityScissorTest);
		this.capabilityStencilTest = new CapabilityValue(updateCapabilityStencilTest);
		this.capabilityRasterizerDiscard = new CapabilityValue(updateCapabilityRasterizerDiscard);

		this.shaderValue = new ShaderValue();
	}

	// on context lost, we invalidate the state
	invalidateState() {
		this.changeId += 1;
		return;
	}

	onContextRestored(in_webContextElement){
		this.webContext = in_webContextElement;
	}

	// allow resources to not have to be told of context lost? perfer dumb
	//getStateChangeId(){
	//	return this.changeId;
	//}

	setViewport(in_x, in_y, in_width, in_height) {
		this.viewport.updateState(this.webContext, this.changeId, in_x, in_y, in_width, in_height);
		return;
	}

	setClearColor(in_red, in_green, in_blue, in_alpha) {
		this.clearColor.updateState(this.webContext, this.changeId, in_red, in_green, in_blue, in_alpha);
		return;
	}

	setClearDepth(in_value){
		this.clearDepth.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	setClearStencil(in_value){
		this.clearStencil.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	setShader(in_shader){
		this.shaderValue.updateState(this.webContext, this.changeId, in_shader);
		return;
	}

	getShaderAttributeMap(){
		if (this.shaderValue !== undefined){
			return this.shaderValue.getAttributeMap();
		}
		return {};
	}

	//true/false
	setCapabilityBlend(in_value){
		this.capabilityBlend.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	//true/false
	setCapabilityCullFace(in_value){
		this.capabilityCullFace.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	//true/false
	setCapabilityDepthTest(in_value){
		this.capabilityDepthTest.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	//true/false
	setCapabilityStencilTest(in_value){
		this.capabilityStencilTest.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	setFrontFace(in_value){
		this.frontFace.updateState(this.webContext, this.changeId, in_value);
		return;
	}

	setCullFace(in_value){
		this.cullFace.updateState(this.webContext, this.changeId, in_value);
		return;
	}
	setBlendFunc(in_sourceBlendingFactor, in_destinationBlendingFactor){
		this.blendFunc.updateState(this.webContext, this.changeId, in_sourceBlendingFactor, in_destinationBlendingFactor);
		return;
	}
	setDepthFunc(in_value){
		this.depthFunc.updateState(this.webContext, this.changeId, in_value);
		return;
	}

}
