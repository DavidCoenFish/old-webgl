import { assertAlways } from "../../../../assert";
import { DataStream } from "./datastream.js";
import { DataStreamResource } from "./datastreamresource.js";
import { Model } from "./model.js";

export class ModelResource {
	constructor(
		in_contextPrivate, 
		in_modeEnum,
		in_dataStreamArray, 
		in_elementIndexArrayOrUndefined
	) {
		this.mode = in_contextPrivate.getEnum(in_modeEnum);
		this.elementIndexResource = undefined;
		if (in_elementIndexArrayOrUndefined !== undefined){
			const elementByteSize = in_contextPrivate.getDataArrayByteSize(in_elementIndexArrayOrUndefined);
			const elementType = in_contextPrivate.getDataArrayType(in_elementIndexArrayOrUndefined);
			const usage = in_contextPrivate.getEnum(DataStream.usageFlag.staticDraw);
			const elementIndexBufferObject = ContextHelper.createBuffer(in_elementIndexArrayOrUndefined, in_contextPrivate.getEnum("ELEMENT_ARRAY_BUFFER"), usage);

			this.elementIndexResource = new DataStreamResource(elementIndexBufferObject, elementType, elementByteSize);
		}

		this.dataStreamResourceArray = [];
		for (var index = 0, count = in_dataStreamArray.length; index < count; ++index) {
			const dataStream = in_dataStreamArray[index];
			const dataArray = dataStream.getDataArray();

			const type = in_contextPrivate.getDataArrayType(dataArray);
			const byteSize = in_contextPrivate.getDataArrayByteSize(type);
			const usage = in_contextPrivate.getEnum(dataStream.getUsageFlag());
			const bufferObject = in_contextPrivate.createBuffer(dataArray, in_contextPrivate.getEnum("ARRAY_BUFFER"), usage);

			this.dataStreamResourceArray.push(new DataStreamResource(bufferObject, type, byteSize));

			//console.log("model dataStream.name:" + dataStream.getName() + " type:" + type + " byteSize:" + byteSize + " dataArray.type:" +  typeof(dataArray) + " instanceof Uint8Array:" + (dataArray instanceof Uint8Array));
		}

		return;
	}

	release(in_contextPrivate){
		if (undefined !== this.elementIndexResource){
			in_contextPrivate.deleteBuffer(this.elementIndexResource.getBufferObject());
			this.elementIndexResource = undefined;
		}

		for (var index = 0, count = this.dataStreamResourceArray.length; index < count; ++index) {
			const dataStreamResource = this.dataStreamResourceArray[index];
			in_contextPrivate.deleteBuffer(dataStreamResource.getBufferObject());
		}
		this.dataStreamResourceArray.length = 0;

		return;
	}

	getMode(){
		return this.mode;
	}

	getElementIndexResource(){
		return this.elementIndexResource;
	}

	getDataStreamResourceArray(){
		return this.dataStreamResourceArray;
	}
}