import { ModelResource } from "./modelresource.js";

export class Model {
	constructor(
		in_modeEnum,
		in_elementCount,
		in_dataStreamArray,
		in_elementIndexArrayOrUndefined
	) {
		this.modeEnum = in_modeEnum;
		this.elementCount = in_elementCount;
		this.dataStreamArray = in_dataStreamArray;
		this.elementIndexArrayOrUndefined = in_elementIndexArrayOrUndefined;

		this.modelResource = undefined;

		return;
	}

	aquireResource(in_contextPrivate){
		this.releaseResources(in_contextPrivate);
		
		this.modelResource = new ModelResource(
			in_contextPrivate, 
			this.modeEnum,
			this.dataStreamArray,
			this.elementIndexArrayOrUndefined
			);
		return;
	}

	releaseResources(in_contextPrivate){
		if (this.modelResource !== undefined){
			this.modelResource.release(in_contextPrivate);
		}
		this.modelResource = undefined;
		return;
	}

	onContextLost(){
		this.modelResource = undefined;
		return;
	}
	
	getMode(){
		if (undefined !== this.modelResource){
			return this.modelResource.getMode();
		}
		return undefined;
	}
	
	getElementCount(){
		return this.elementCount;
	}

	getElementIndexResource(){
		if (undefined !== this.modelResource){
			return this.modelResource.getElementIndexResource();
		}
		return undefined;
	}

	getDataStreamArray(){
		return this.dataStreamArray;
	}
	
	getDataStreamResourceArray(){
		if (undefined !== this.modelResource){
			return this.modelResource.getDataStreamResourceArray();
		}
		return undefined;
	}
}

Model.modeEnum = {
	points : "POINTS",
	lines : "LINES",
	lineLoop : "LINE_LOOP",
	lineStrip : "LINE_STRIP",
	triangles : "TRIANGLES",
	triangleStrip : "TRIANGLE_STRIP",
};






