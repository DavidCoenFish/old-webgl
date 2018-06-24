export class NumericValue1 {
	constructor(in_updateStateFunction) {
		this.changeId = undefined;
		this.a = undefined;
		this.updateStateFunction = in_updateStateFunction;
	}

	updateState(in_webglContext, in_changeId, in_a){
		var update = false;
		if (in_changeId !== this.changeId){
			this.changeId = in_changeId;
			update = true;
		}
		if (in_a !== this.a){
			this.a = in_a;
			update = true;
		}
		if (true === update){
			this.updateStateFunction(in_webglContext, in_a);
		}
		return;
	}
}

//value clamped between 0 and 1, default 1
export const updateStateClearDepth = function(in_webglContext, in_a){
	in_webglContext.clearDepth(in_a);
}

//int of default 0
export const updateStateClearStencil = function(in_webglContext, in_a){
	in_webglContext.clearStencil(in_a);
}

export const updateStateFrontFace = function(in_webglContext, in_mode){
	in_webglContext.frontFace(in_mode);
}

export const updateStateCullFace = function(in_webglContext, in_mode){
	in_webglContext.cullFace(in_mode);
}

export const updateStateDepthFunc = function(in_webglContext, in_mode){
	in_webglContext.depthFunc(in_mode);
}
