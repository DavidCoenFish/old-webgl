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
uniform float u_adaptationLog10; //lumen per m2 that eyes are adapted to, bottom of range (-7 single star, +2 indoors, +4 daysky, +11 lightning)
uniform float u_invrangeLog10; //inverted range that eyes can see (1:1000 from wiki)
varying vec2 v_uv;
void main() {
	vec4 sampleColour = texture2D(u_sampler0, v_uv);
	vec3 source = log(sampleColour.rgb) / 2.302585093; // base e to base 10
	vec3 rgb = (source - u_adaptationLog10) * u_invrangeLog10;
	gl_FragColor = vec4(rgb, 1.0);
}
`;

export class PresentPass {
	constructor(in_context, in_hdrTexture) {
		//this.material
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			["a_position", "a_uv"], 
			[	
				new Uniform("u_sampler0", Uniform.type.int1),
				new Uniform("u_adaptationLog10", Uniform.type.float1),
				new Uniform("u_invrangeLog10", Uniform.type.float1),
			]
			);
		this.material = in_context.createMaterial(
			this.shader,
			{
				"u_sample0" : new UniformValue(0, false),
				"u_adaptationLog10" : new UniformValue(new Float32Array([0.0])),
				"u_invrangeLog10" : new UniformValue(new Float32Array([0.33333333]))
			},
			[in_hdrTexture]
			);

		this.model = geometryFactoryQuadPosUv(in_context);

		return;
	}
	
	update(in_context, in_timestamp, in_uniformValueMap){
		this.material.setUniformValueMap(in_uniformValueMap);

		in_context.setRenderTarget(undefined);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);

		return;
	}
}