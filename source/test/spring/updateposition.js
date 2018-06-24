import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {Material} from "./../../components/webgl/resource/material/material.js";

const sVertexShaderSource = `
attribute vec4 a_positionWeight;
attribute vec2 a_uv;

varying vec3 v_position;

uniform sampler2D u_samplerVelocity;
uniform sampler2D u_samplerPositionOld;

uniform vec3 u_modelPos;
uniform vec3 u_modelAt;
uniform vec3 u_modelUp;
uniform vec3 u_modelRight;
uniform vec4 u_modelScaleDensitySpringconstantSpringdampen;

uniform float u_timeDelta;

vec3 getAtomPosition(){
	float x = a_positionWeight.x + (mod(a_positionWeight.y, 2.0) * 0.5) - (mod(a_positionWeight.z, 2.0) * 0.5);
	float y = (a_positionWeight.y * 0.86602540378443864676372317075294) + (mod(a_positionWeight.z, 2.0) * 0.28867513459481288225457439025098);
	float z = 	a_positionWeight.z * 0.81649658092772603273242802490196;
	float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
	vec3 pos = u_modelPos + (((u_modelRight * x) + (u_modelUp * y) + (u_modelAt * z)) * modelScale);
	return pos;
}

void main() {
	vec3 atomPosition = getAtomPosition();

	vec3 velocity = texture2D(u_samplerVelocity, a_uv).xyz;
	vec3 positionOld = texture2D(u_samplerPositionOld, a_uv).xyz;

	vec3 newPosition = positionOld + (velocity * u_timeDelta);
	v_position = mix(atomPosition, newPosition, a_positionWeight.w);

	gl_Position = vec4((a_uv.x - 0.5) * 2.0, (a_uv.y - 0.5) * 2.0, 0.0, 1.0);
	gl_PointSize = 1.0;
}
`;

const sFragmentShaderSource = `
precision mediump float;
varying vec3 v_position;
void main() {
	gl_FragColor = vec4(v_position, 1.0);
}
`;

export class UpdatePosition {
	constructor(in_context) {
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			[
				"a_positionWeight",
				"a_uv",
			],
			[	
				new Uniform("u_samplerVelocity", Uniform.type.int1),
				new Uniform("u_samplerPositionOld", Uniform.type.int1),

				new Uniform("u_modelPos", Uniform.type.float3),
				new Uniform("u_modelAt", Uniform.type.float3),
				new Uniform("u_modelUp", Uniform.type.float3),
				new Uniform("u_modelRight", Uniform.type.float3),
				new Uniform("u_modelScaleDensitySpringconstantSpringdampen", Uniform.type.float4),

				new Uniform("u_timeDelta", Uniform.type.float1)
			]
			);
		this.material = in_context.createMaterial(this.shader);
		this.materialUniforms = {
			"u_samplerVelocity" : new UniformValue(new Int32Array([0]), false),
			"u_samplerPositionOld" : new UniformValue(new Int32Array([1]), false),
		};

		return;
	}

	//run(in_context, timeDelta, uniformValueMap, this.assets.getRenderTargetPosition(), this.assets.getModel(), this.assets.getTextureVelocity(), this.assets.getTexturePositionOld());

	run(in_context, in_timeDelta, in_uniformValueMap, in_renderTargetPosition, in_model, in_textureVelocity, in_texturePositionOld){
		in_context.setRenderTarget(in_renderTargetPosition);
		this.material.setTextureArray([in_textureVelocity, in_texturePositionOld]);
		this.material.setUniformValueMap(in_uniformValueMap);

		var localUniformValueMap = Object.assign({}, this.materialUniforms, in_uniformValueMap);
		this.material.setUniformValueMap(localUniformValueMap);

		in_context.setMaterial(this.material)
		in_context.drawModel(in_model);
	}

}


