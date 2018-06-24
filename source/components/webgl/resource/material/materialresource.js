export class MaterialResource {
	constructor(
		in_contextPrivate, 
		in_depthTestFlag,
		in_blendSourceFlag,
		in_blendDestinationFlag,
	) {
		this.depthTest = in_contextPrivate.getEnum(in_depthTestFlag);
		this.blendSource = in_contextPrivate.getEnum(in_blendSourceFlag);
		this.blendDestination = in_contextPrivate.getEnum(in_blendDestinationFlag);

		return;
	}

	getDepthTest(){
		return this.depthTest;
	}

	getBlendSource(){
		return this.blendSource;
	}

	getBlendDestination(){
		return this.blendDestination;
	}

}