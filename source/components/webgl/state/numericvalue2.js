export class NumericValue2 {
	constructor(in_updateStateFunction) {
		this.changeId = undefined;
		this.a = undefined;
		this.b = undefined;
		this.updateStateFunction = in_updateStateFunction;
	}

	updateState(in_webglContext, in_changeId, in_a, in_b){
		var update = false;
		if (in_changeId !== this.changeId){
			this.changeId = in_changeId;
			update = true;
		}
		if ((in_a !== this.a) || (in_b !== this.b)){
			this.a = in_a;
			this.b = in_b;
			update = true;
		}
		if (true === update){
			this.updateStateFunction(in_webglContext, in_a, in_b);
		}
		return;
	}
}

export const updateStateBlendFunc = function(in_webglContext, in_sourceBlendingFactor, in_destinationBlendingFactor){
	//console.log("updateStateBlendFunc in_sourceBlendingFactor:" + in_sourceBlendingFactor + " in_destinationBlendingFactor:" + in_destinationBlendingFactor);
	in_webglContext.blendFunc(in_sourceBlendingFactor, in_destinationBlendingFactor);
}
