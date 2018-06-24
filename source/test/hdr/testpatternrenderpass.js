import {Texture} from "./../../components/webgl/resource/texture/texture.js";
import {Attachment} from "./../../components/webgl/resource/rendertarget/attachment.js";

import {geometryFactoryQuadPosUv} from "./geometryfactoryquadposuv.js";

const sVertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}`;

const sFragmentShaderSourceHDRColourTest = `
precision mediump float;
varying vec2 v_uv;
void main() {
	float cellX = floor(v_uv.x * 4.0);
	float fractX = fract(v_uv.x * 4.0);
	float cellY = floor((1.0 - v_uv.y) * 5.0);
	float fractY = fract((1.0 - v_uv.y) * 5.0);
	float index = cellX + (cellY * 4.0);

	//float light = fractX;
	float light = pow(10.0, (-7.0 + index) + fractX);
	float subCellY = floor(fractY * 4.0);

	float redMul = min(1.0, step(3.0, subCellY) + (1.0 - step(1.0, subCellY)));
	float greenMul = min(1.0, step(3.0, subCellY) + ((1.0 - step(2.0, subCellY)) * step(1.0, subCellY)));
	float blueMul = min(1.0, step(3.0, subCellY) + ((1.0 - step(3.0, subCellY)) * step(2.0, subCellY)));

	float gridMul = 1.0 - step(0.95, abs(fractX - 0.5) + abs(fractY - 0.5));

	gl_FragColor = vec4(light * redMul * gridMul, light * greenMul * gridMul, light * blueMul * gridMul, 1.0);
}`;

export class TestPatternRenderPass {
	constructor(in_context) {
		this.textureColor = in_context.createTexture(
			undefined, 
			512, 
			512,
			Texture.imageFormatEnum.rgba,
			Texture.imageFormatEnum.rgba,
			Texture.typeEnum.float,
			Texture.magnificationFilter.nearest,
			Texture.minificationFilter.nearest,
			Texture.wrapEnum.clampToEdge,
			Texture.wrapEnum.clampToEdge
			);
		this.renderTarget = in_context.createRenderTarget(
			[
				new Attachment(
					Attachment.targetEnum.framebuffer,
					Attachment.attachmentEnum.colorAttachment0,
					Attachment.textureTargetEnum.texture2d,
					this.textureColor
					)
			],
			512,
			512
			);
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSourceHDRColourTest,
			["a_position", "a_uv"], 
			[]
			);
		this.material = in_context.createMaterial(this.shader);

		this.model = geometryFactoryQuadPosUv(in_context);

		return;
	}
	
	update(in_context, in_timestamp, in_uniformValueMap){
		in_context.setRenderTarget(this.renderTarget);
		in_context.clearColor(0.5, 0.5, 0.5, 1.0);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);
		return;
	}

	getOutputTextureColour(){
		return this.textureColor;
	}
}