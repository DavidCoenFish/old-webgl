export class ShaderValue {
	constructor(in_updateStateFunction) {
		this.changeId = undefined;
		this.shader = undefined;
	}

	updateState(in_webglContext, in_changeId, in_shader){
		var update = false;
		if (in_changeId !== this.changeId){
			this.changeId = in_changeId;
			update = true;
		}
		if (in_shader !== this.shader) {
			this.shader = in_shader;
			update = true;
		}
		if (true === update){
			const programHandle = (this.shader !== undefined) ? this.shader.getProgramHandle() : 0;
			in_webglContext.useProgram(programHandle);
		}
		return;
	}

	getAttributeMap(){
		if (undefined !== this.shader){
			return this.shader.getAttributeMap();
		}
		return undefined;
	}
}
