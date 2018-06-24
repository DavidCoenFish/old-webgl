export class DataStreamResource {
	constructor(
		in_bufferObject,
		in_type,
		in_byteSize
	) {
		this.bufferObject = in_bufferObject; 
		this.type = in_type;
		this.byteSize = in_byteSize;
		return;
	}

	getBufferObject(){
		return this.bufferObject;
	}

	getType(){
		return this.type;
	}

	getByteSize(){
		return this.byteSize;
	}

}
