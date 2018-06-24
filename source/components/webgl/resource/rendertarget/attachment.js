export class Attachment {
	constructor(
		in_targetEnum, 
		in_attachmentEnum, 
		in_texTargetEnum,
		in_texture
	) {
		this.targetEnum = in_targetEnum; 
		this.attachmentEnum = in_attachmentEnum; 
		this.texTargetEnum = in_texTargetEnum; 
		this.texture = in_texture; 

		return;
	}

	getTargetEnum(){
		return this.targetEnum;
	}

	getAttachmentEnum(){
		return this.attachmentEnum;
	}

	getTexTargetEnum(){
		return this.texTargetEnum;
	}

	getTexture(){
		return this.texture;
	}
}

Attachment.targetEnum = {
	framebuffer: "FRAMEBUFFER",
	//webgl2
	drawFramebuffer: "DRAW_FRAMEBUFFER",
	readFramebuffer: "READ_FRAMEBUFFER",
};

Attachment.attachmentEnum = {
	colorAttachment0: "COLOR_ATTACHMENT0",
	depthAttachment: "DEPTH_ATTACHMENT",
	stencilAttachment: "STENCIL_ATTACHMENT", 
	//WebGL 2
	depthStencilAttachment: "DEPTH_STENCIL_ATTACHMENT",
	colorAttachment1: "COLOR_ATTACHMENT1",
	colorAttachment2: "COLOR_ATTACHMENT2",
	colorAttachment3: "COLOR_ATTACHMENT3",
	colorAttachment4: "COLOR_ATTACHMENT4",
	colorAttachment5: "COLOR_ATTACHMENT5",
	colorAttachment6: "COLOR_ATTACHMENT6",
	colorAttachment7: "COLOR_ATTACHMENT7",
	colorAttachment8: "COLOR_ATTACHMENT8",
	colorAttachment9: "COLOR_ATTACHMENT9",
	colorAttachment10: "COLOR_ATTACHMENT10",
	colorAttachment11: "COLOR_ATTACHMENT11",
	colorAttachment12: "COLOR_ATTACHMENT12",
	colorAttachment13: "COLOR_ATTACHMENT13",
	colorAttachment14: "COLOR_ATTACHMENT14",
	colorAttachment15: "COLOR_ATTACHMENT15",
};

Attachment.textureTargetEnum = {
	texture2d: "TEXTURE_2D",
	textureCubeMapPositiveX: "TEXTURE_CUBE_MAP_POSITIVE_X",
	textureCubeMapNegativeX: "TEXTURE_CUBE_MAP_NEGATIVE_X",
	textureCubeMapPositiveY: "TEXTURE_CUBE_MAP_POSITIVE_Y",
	textureCubeMapNegativeY: "TEXTURE_CUBE_MAP_NEGATIVE_Y",
	textureCubeMapPositiveZ: "TEXTURE_CUBE_MAP_POSITIVE_Z",
	textureCubeMapNegativeZ: "TEXTURE_CUBE_MAP_NEGATIVE_Z",
};
