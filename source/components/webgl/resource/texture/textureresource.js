import { assertAlways } from "../../../../assert";

export class TextureResource {
	constructor(
		in_contextPrivate, 
		in_data,
		in_width,
		in_height,
		in_internalFormat,
		in_format,
		in_type, 
		in_magFilter,
		in_minFilter,
		in_wrapS,
		in_wrapT
	) {
		this.webglTexture = in_contextPrivate.createTexture(
			in_data, 
			in_width, 
			in_height, 
			in_internalFormat, 
			in_format, 
			in_type, 
			in_magFilter, 
			in_minFilter, 
			in_wrapS,
			in_wrapT
			);

		return;
	}

	release(in_contextPrivate){
		if (undefined !== this.webglTexture){
			in_contextPrivate.deleteTexture(this.webglTexture);
			this.webglTexture = undefined;
		}
		return;
	}

	getWebglTexture(){
		return this.webglTexture;
	}
}