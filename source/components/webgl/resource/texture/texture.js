import { TextureResource } from "./textureresource.js";
/*
*/
export class Texture {
	constructor(
		in_data, 
		in_width, 
		in_height,
		in_internalFormatOrUndefined,
		in_formatOrUndefined,
		in_typeOrUndefined,
		in_magFilterOrUndefined,
		in_minFilterOrUndefined,
		in_wrapSOrUndefined,
		in_wrapTOrUndefined
	) {
		this.data = in_data;
		this.width = in_width;
		this.height = in_height;
		this.internalFormat = (undefined === in_internalFormatOrUndefined) ? Texture.imageFormatEnum.rbga : in_internalFormatOrUndefined;
		this.format = (undefined === in_formatOrUndefined) ? Texture.imageFormatEnum.rbga : in_formatOrUndefined;
		this.type = (undefined === in_typeOrUndefined) ? Texture.typeEnum.unsignedByte : in_typeOrUndefined;
		this.magFilter = (undefined === in_magFilterOrUndefined) ? Texture.magnificationFilter.linear : in_magFilterOrUndefined;
		this.minFilter = (undefined === in_minFilterOrUndefined) ? Texture.minificationFilter.linear : in_minFilterOrUndefined;
		this.wrapS = (undefined === in_wrapSOrUndefined) ? Texture.wrapEnum.repeat : in_wrapSOrUndefined;
		this.wrapT = (undefined === in_wrapTOrUndefined) ? Texture.wrapEnum.repeat : in_wrapTOrUndefined;

		this.textureResource = undefined;

		return;
	}

	aquireResource(in_contextPrivate){
		this.releaseResources();
		
		this.textureResource = new TextureResource(
			in_contextPrivate, 
			this.data,
			this.width,
			this.height,
			this.internalFormat,
			this.format,
			this.type,
			this.magFilter,
			this.minFilter,
			this.wrapS,
			this.wrapT
			);
		return;
	}

	releaseResources(in_contextPrivate){
		if (this.textureResource !== undefined){
			this.textureResource.release(in_contextPrivate);
		}
		this.textureResource = undefined;
		return;
	}

	onContextLost(){
		this.textureResource = undefined;
		return;
	}
	
	getWebglTexture(){
		if (this.textureResource !== undefined){
			return this.textureResource.getWebglTexture();
		}
		return undefined;
	}

}

Texture.imageFormatEnum = {
	alpha: "ALPHA", //Discards the red, green and blue components and reads the alpha component.
	rgb: "RGB", //Discards the alpha components and reads the red, green and blue components.
	rgba: "RGBA", //Red, green, blue and alpha components are read from the color buffer.
	luminace: "LUMINANCE", //Each color component is a luminance component, alpha is 1.0.
	luminaceAlpha: "LUMINANCE_ALPHA", //Each component is a luminance/alpha component.

	//When using the WEBGL_depth_texture extension:
	depthComponent: "DEPTH_COMPONENT",
	depthStencil: "DEPTH_STENCIL",

	//When using the EXT_sRGB extension:
	sRgbExt: "SRGB_EXT",
	sRgbAlphaExt: "SRGB_ALPHA_EXT",

	//When using a WebGL 2 context, the following values are available additionally:
	r8: "R8",
	r16f: "R16F",
	r32f: "R32F",
	r8ui: "R8UI",
	rg8: "RG8",
	rg16f: "RG16F",
	rg32f: "RG32F",
	rg8ui: "RG8UI",
	rg16ui: "RG16UI",
	rg32ui: "RG32UI",
	rgb8: "RGB8",
	srgb8: "SRGB8",
	rgb565: "RGB565",
	r11fG11fB10f: "R11F_G11F_B10F",
	rgb9e5: "RGB9_E5",
	rgb16f: "RGB16F",
	rgb32f: "RGB32F",
	rgb8ui: "RGB8UI",
	rgba8: "RGBA8",
	srgb8Aplha8: "SRGB8_APLHA8",
	rgb5a1: "RGB5_A1",
	rgb10a2: "RGB10_A2",
	rgba4: "RGBA4",
	rgba16f: "RGBA16F",
	rgba32f: "RGBA32F",
	rgba8ui: "RGBA8UI",
};

Texture.typeEnum = {
	unsignedByte: "UNSIGNED_BYTE",//: 8 bits per channel for gl.RGBA
	unsignedShort565: "UNSIGNED_SHORT_5_6_5",//: 5 red bits, 6 green bits, 5 blue bits.
	unsignedShort4444: "UNSIGNED_SHORT_4_4_4_4",//: 4 red bits, 4 green bits, 4 blue bits, 4 alpha bits.
	unsignedShort5551: "UNSIGNED_SHORT_5_5_5_1",//: 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
	//When using the WEBGL_depth_texture extension:
	unsignedShort: "UNSIGNED_SHORT",
	unsignedInt: "UNSIGNED_INT",
	//ext.UNSIGNED_INT_24_8_WEBGL",
	//When using the OES_texture_float extension:
	float: "FLOAT",
	//When using the OES_texture_half_float extension:
	//HALF_FLOAT_OES",

	//webgl2
	byte: "BYTE",
	unsignedShort: "UNSIGNED_SHORT",
	short: "SHORT",
	unsignedInt: "UNSIGNED_INT",
	int: "INT",
	halfFloat: "HALF_FLOAT",
	float: "FLOAT",
	unsignedInt2101010rev: "UNSIGNED_INT_2_10_10_10_REV",
	unsignedInt10f11f11frev: "UNSIGNED_INT_10F_11F_11F_REV",
	unsignedInt5999rev: "UNSIGNED_INT_5_9_9_9_REV",
	unsignedInt248: "UNSIGNED_INT_24_8",
	float32unsignedInt248rev: "FLOAT_32_UNSIGNED_INT_24_8_REV",
};


Texture.magnificationFilter = {
	linear: "LINEAR", //def
	nearest: "NEAREST"
};

Texture.minificationFilter = {
	linear: "LINEAR",
	nearest: "NEAREST",

	nearestMipmapNearest: "NEAREST_MIPMAP_NEAREST",
	linearMipmapNearest: "LINEAR_MIPMAP_NEAREST",
	nearestMipmapLinear: "NEAREST_MIPMAP_LINEAR", //def but causess error on dell laptop
	linearMipmapLinear: "LINEAR_MIPMAP_LINEAR",
};

Texture.wrapEnum = {
	repeat: "REPEAT", //def
	clampToEdge: "CLAMP_TO_EDGE",
	mirroredRepeat: "MIRRORED_REPEAT",
};

//https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE