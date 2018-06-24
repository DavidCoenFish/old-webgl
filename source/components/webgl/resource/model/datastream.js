export class DataStream {
	constructor(
		in_name, 
		in_elementsPerVertex, 
		in_dataArray,
		in_usageFlagOrUndefined,
		in_normaliseOrUndefined
	) {
		this.name = in_name; 
		this.elementsPerVertex = in_elementsPerVertex;
		this.dataArray = in_dataArray;
		this.usageFlag = (undefined === in_usageFlagOrUndefined) ? DataStream.usageFlag.staticDraw : in_usageFlagOrUndefined;
		this.normalise = (undefined === in_normaliseOrUndefined) ? false : in_normaliseOrUndefined;

		return;
	}

	getName(){
		return this.name;
	}
	getElementsPerVertex(){
		return this.elementsPerVertex;
	}
	getDataArray(){
		return this.dataArray;
	}
	getUsageFlag(){
		return this.usageFlag;
	}
	getNormalise(){
		return this.normalise;
	}
}

DataStream.usageFlag = {
	staticDraw: "STATIC_DRAW", //STATIC_DRAW
	dynamicDraw: "DYNAMIC_DRAW", //DYNAMIC_DRAW
	streamDraw: "STREAM_DRAW", //STREAM_DRAW
	staticRead: "STATIC_READ", //STATIC_READ webgl2
	dynamicRead: "DYNAMIC_READ", //DYNAMIC_READ webgl2
	streamRead: "STREAM_READ", //STREAM_READ webgl2
	staticRead: "STATIC_COPY", //STATIC_COPY webgl2
	dynamicCopy: "DYNAMIC_COPY", //DYNAMIC_COPY webgl2
	streamCopy: "STREAM_COPY", //STREAM_COPY webgl2
};
