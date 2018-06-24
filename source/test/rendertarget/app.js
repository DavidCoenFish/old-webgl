import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";
import {Texture} from "./../../components/webgl/resource/texture/texture.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";
import {RenderTarget} from "./../../components/webgl/resource/rendertarget/rendertarget.js";
import {Attachment} from "./../../components/webgl/resource/rendertarget/attachment.js";

const initialVertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}`;
const initialFragmentShaderSource = `
precision mediump float;
varying vec2 v_uv;
void main() {
	gl_FragColor = vec4(v_uv, 0.0, 1.0);
}`;
const presentationVertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;
const presentationFragmentShaderSource = `
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uv;
void main() {
	vec4 sampleColour = texture2D(u_sampler0, v_uv);
	gl_FragColor = sampleColour;
}
`;

//export const App = class {
export class App {
	constructor(in_props) {
		console.log("App.constructor");
		this.onStart = this.onStart.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	
		return;
	}
	onStart(in_context){
		this.initialTextureColor = in_context.createTexture(
			undefined, 
			16, 
			16,
			Texture.imageFormatEnum.rgba,
			Texture.imageFormatEnum.rgba,
			Texture.typeEnum.unsignedByte,
			Texture.magnificationFilter.nearest,
			Texture.minificationFilter.nearest,
			Texture.wrapEnum.clampToEdge,
			Texture.wrapEnum.clampToEdge
			);
		this.initialRenderTarget = in_context.createRenderTarget(
			[
				new Attachment(
					Attachment.targetEnum.framebuffer,
					Attachment.attachmentEnum.colorAttachment0,
					Attachment.textureTargetEnum.texture2d,
					this.initialTextureColor)
			],
			16,
			16
			);
		this.initialShader = in_context.createShader(
			initialVertexShaderSource, 
			initialFragmentShaderSource,
			["a_position", "a_uv"], 
			[]
			);
		this.initialMaterial = in_context.createMaterial(this.initialShader);
		this.initialModel = in_context.createModel(
			Model.modeEnum.triangles,
			3,
			[
				new DataStream(
					"a_position", 
					2, 
					new Int8Array([
						-1, -1,
						-1, 1,
						1, -1
						]),
					),
				new DataStream(
					"a_uv", 
					2, 
					new Uint8Array([
						0, 1,
						0, 0,
						1, 1
						]),
					)
			]
			);

		this.presentationShader = in_context.createShader(
			presentationVertexShaderSource, 
			presentationFragmentShaderSource,
			["a_position", "a_uv"], 
			[new Uniform("u_sampler0", Uniform.type.int1)]
			);
		this.presentationMaterial = in_context.createMaterial(
			this.presentationShader,
			{
				"u_sample0" : new UniformValue(0, false)
			},
			[this.initialTextureColor]
			);

		this.presentationModel = in_context.createModel(
			Model.modeEnum.triangles,
			6,
			[
				new DataStream(
					"a_position", 
					2, 
					new Int8Array([
						-1, 0, //-1,
						-1, 1,
						1, 0,
						1,1,
						1,0,
						-1,1
						]),
					),
				new DataStream(
					"a_uv", 
					2, 
					new Uint8Array([
						0, 1,
						0, 0,
						1, 1,
						1, 0,
						1, 1,
						0, 0
						]),
					),
			]
			);
	}

	onUpdate(in_context, in_timestamp){
		in_context.setRenderTarget(this.initialRenderTarget);
		in_context.clearColor(0.5, 0.5, 0.5, 1.0);
		in_context.setMaterial(this.initialMaterial)
		in_context.drawModel(this.initialModel);

		in_context.setRenderTarget(undefined);
		in_context.clearColor(0.0, 0.0, 0.0, 1.0);
		in_context.setMaterial(this.presentationMaterial)
		in_context.drawModel(this.presentationModel);

		return false;
	}
}
