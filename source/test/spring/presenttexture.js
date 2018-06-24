import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {geometryFactoryQuadPosUv} from "./geometryfactoryquadposuv.js";

const sVertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShaderSource = `
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uv;
void main() {
	vec4 sampleColour = texture2D(u_sampler0, v_uv);
	gl_FragColor = sampleColour;
}
`;

export class PresentTexture {
	constructor(in_context) {
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			["a_position", "a_uv"], 
			[	
				new Uniform("u_sampler0", Uniform.type.int1)
			]
			);
		this.material = in_context.createMaterial(
			this.shader,
			{
				"u_sampler0" : new UniformValue(new Int32Array([0]), false)
			}
			);


		const left = (((640.0 - 160.0) / 640.0) * 2.0) - 1.0;
		const right = (((640.0 - 0.0) / 640.0) * 2.0) - 1.0;
		const aspect = 455.0 / 640.0;
		const top = ((((160.0 / aspect)) / 640.0) * 2.0) - 1.0;
		const bottom = (((455.0 - 455.0) / 455.0) * 2.0) - 1.0;

		this.model = geometryFactoryQuadPosUv(in_context, left, right, top, bottom);

		return;
	}
	
	update(in_context, in_texture){
		in_context.setRenderTarget(undefined);
		this.material.setTextureArray([in_texture]);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);

		return;
	}
}