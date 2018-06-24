import { RenderTargetResource } from "./rendertargetresource.js";

export class RenderTarget {
	constructor(
		in_attachmentArray,
		in_width,
		in_height
	) {
		this.attachmentArray = in_attachmentArray;
		this.width = in_width;
		this.height = in_height;

		this.renderTargetResource = undefined;

		return;
	}

	aquireResource(in_contextPrivate){
		this.releaseResources(in_contextPrivate);
		
		this.renderTargetResource = new RenderTargetResource(
			in_contextPrivate, 
			this.attachmentArray,
			this.width,
			this.height
			);
		return;
	}

	releaseResources(in_contextPrivate){
		if (this.renderTargetResource !== undefined){
			this.renderTargetResource.release(in_contextPrivate);
		}
		this.renderTargetResource = undefined;
		return;
	}

	onContextLost(){
		this.renderTargetResource = undefined;
		return;
	}
	
	getFramebuffer(){
		if (undefined !== this.renderTargetResource){
			return this.renderTargetResource.getFramebuffer();
		}
		return null;
	}

	getWidth(){
		return this.width;
	}

	getHeight(){
		return this.height;
	}

}
