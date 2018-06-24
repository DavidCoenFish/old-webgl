import { Attachment } from "./attachment.js";

export class RenderTargetResource {
	constructor(
		in_contextPrivate, 
		in_attachmentArray,
		in_width,
		in_height
	) {
		this.framebuffer = in_contextPrivate.createFramebuffer(in_attachmentArray);
		return;
	}

	release(in_contextPrivate){
		if (this.framebuffer !== undefined){
			in_contextPrivate.deleteFramebuffer(this.framebuffer);
			this.framebuffer = undefined;
		}
		return;
	}

	getFramebuffer(){
		return this.framebuffer;
	}
}