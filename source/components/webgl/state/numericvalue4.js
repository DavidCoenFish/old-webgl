export class NumericValue4 {
	constructor(in_updateStateFunction) {
		this.changeId = undefined;
		this.a = undefined;
		this.b = undefined;
		this.c = undefined;
		this.d = undefined;
		this.updateStateFunction = in_updateStateFunction;
	}

	updateState(in_webglContext, in_changeId, in_a, in_b, in_c, in_d){
		var update = false;
		if (in_changeId !== this.changeId){
			this.changeId = in_changeId;
			update = true;
		}
		if ((in_a !== this.a) || (in_b !== this.b) || (in_c !== this.c) || (in_d !== this.d)){
			this.a = in_a;
			this.b = in_b;
			this.c = in_c;
			this.d = in_d;
			update = true;
		}
		if (true === update){
			this.updateStateFunction(in_webglContext, in_a, in_b, in_c, in_d);
		}
		return;
	}
}

export const updateStateClearColor = function(in_webglContext, in_a, in_b, in_c, in_d){
	//console.log("updateStateClearColor:" + in_a + " " + in_b + " " + in_c + " " + in_d);
	in_webglContext.clearColor(in_a, in_b, in_c, in_d);
	return;
}

export const updateStateViewport = function(in_webglContext, in_a, in_b, in_c, in_d){
	//console.log("updateStateViewport:" + in_a + " " + in_b + " " + in_c + " " + in_d);
	in_webglContext.viewport(in_a, in_b, in_c, in_d);
	return;
}

