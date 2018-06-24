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
uniform float u_adaptationLog10; //lumen per m2 that eyes are adapted to, bottom of range
uniform float u_invrangeLog10; //inverted range that eyes can see (1:1000 from wiki)
varying vec2 v_uv;
void main() {
	vec4 sampleColour = texture2D(u_sampler0, v_uv);
	float sourceR = log(sampleColour.r) / 2.302585093; //=> base10
	float sourceG = log(sampleColour.g) / 2.302585093;
	float sourceB = log(sampleColour.b) / 2.302585093;

	//float averageLightLog10 = (sourceR + sourceG + sourceB) * 0.33333333;
	float averageLightLog10 = u_adaptationLog10 + (0.5/u_invrangeLog10);

	float r = (sourceR - u_adaptationLog10) * u_invrangeLog10;
	float g = (sourceG - u_adaptationLog10) * u_invrangeLog10;
	float b = (sourceB - u_adaptationLog10) * u_invrangeLog10;
	float rodTemp = (clamp(g, 0.0, 1.0) + clamp(b, 0.0, 1.0)) * 0.5;
	vec3 rodRgbRaw = vec3(rodTemp * 0.8, rodTemp * 0.9, rodTemp);
	float rodMixRatio = clamp((averageLightLog10 + 6.0) / 7.3, 0.0, 1.0);
	vec3 rodRgb = mix(vec3(0.0, 0.0, 0.0), rodRgbRaw, rodMixRatio);
	//at -6, black, upper range of rod is 1.3

	vec3 coneRgbRaw = vec3(clamp(r, 0.0, 1.0), clamp(g, 0.0, 1.0), clamp(b, 0.0, 1.0));
	float coneTintRatio = clamp((averageLightLog10 - 2.0) / 6.0, 0.0, 1.0);
	vec3 coneTint = mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.9, 0.5), coneTintRatio);
	coneRgbRaw *= coneTint;
	float overbright = (max(0.0, r - 1.0) + max(0.0, g - 1.0) + max(0.0, b - 1.0)) * 0.333333;
	float coneMixRatio = clamp((averageLightLog10 - 6.0) / 5.0, 0.0, 1.0);
	vec3 coneRgb = mix(coneRgbRaw + overbright, vec3(1.0, 1.0, 1.0), coneMixRatio);

	float rgbMixRatio = clamp((averageLightLog10 + 3.0) / 4.3333, 0.0, 1.0);
	vec3 rgb = mix(rodRgb, coneRgb, rgbMixRatio);
	gl_FragColor = vec4(rgb, 1.0);
}
`;

export class PresentPass {
	constructor(in_context, in_hdrTexture) {
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