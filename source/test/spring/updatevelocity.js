import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {Material} from "./../../components/webgl/resource/material/material.js";

const sVertexShaderSource = `
attribute vec4 a_positionWeight;
attribute vec2 a_uv;
attribute vec3 a_linkUvw0;
attribute vec3 a_linkUvw1;
attribute vec3 a_linkUvw2;
attribute vec3 a_linkUvw3;
attribute vec3 a_linkUvw4;
attribute vec3 a_linkUvw5;
attribute vec3 a_linkUvw6;
attribute vec3 a_linkUvw7;
attribute vec3 a_linkUvw8;
attribute vec3 a_linkUvw9;
attribute vec3 a_linkUvw10;
attribute vec3 a_linkUvw11;
varying vec3 v_velocity;

uniform sampler2D u_samplerPosition;
uniform sampler2D u_samplerVelocity;

uniform vec4 u_modelScaleDensitySpringconstantSpringdampen;

uniform float u_timeDelta;

vec3 calculateAccelerationFromLink(float in_mass, vec3 in_positionA, vec3 in_velocityA, vec3 in_linkUvw){
	vec3 positionB = texture2D(u_samplerPosition, in_linkUvw.xy).xyz;
	vec3 velocityB = texture2D(u_samplerVelocity, in_linkUvw.xy).xyz;

	float distance = length(positionB - in_positionA);
	vec3 aToBNormal = (positionB - in_positionA) / distance;

	float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
	float springConstant = u_modelScaleDensitySpringconstantSpringdampen.z;
	float spring = -springConstant * (distance - modelScale);
	vec3 springForce = aToBNormal * spring;

	float velocityToDampen = dot(aToBNormal, in_velocityA + velocityB);
	float springDampen = u_modelScaleDensitySpringconstantSpringdampen.w;
	vec3 dampenForce = aToBNormal * (velocityToDampen * 0.5 * springDampen);

	vec3 acceleration = ((springForce + dampenForce) / in_mass) * in_linkUvw.z;
	return acceleration;
	//return vec3(0.0, 0.0, 0.0);
}


void main() {
	float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
	float atomRadius = 0.61237243569579452454932101867647 * modelScale;
	float volume = 4.188790205 * atomRadius * atomRadius * atomRadius; //V=(4/3)PiR^3
	float modelDensity = u_modelScaleDensitySpringconstantSpringdampen.y;
	float atomMass = volume * modelDensity;

	vec3 acceleration = vec3(0.0, -9.80665, 0.0);
	vec3 position = texture2D(u_samplerPosition, a_uv).xyz;
	vec3 velocity = texture2D(u_samplerVelocity, a_uv).xyz;

	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw0);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw1);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw2);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw3);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw4);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw5);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw6);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw7);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw8);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw9);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw10);
	acceleration += calculateAccelerationFromLink(atomMass, position, velocity, a_linkUvw11);

	//use weight as bias between old and new pos, but also dampen velocity
	vec3 newVelocity = (velocity + (acceleration * u_timeDelta)) * a_positionWeight.w;
	//vec3 newVelocity = (velocity + (acceleration * u_timeDelta));

	gl_Position = vec4((a_uv.x - 0.5) * 2.0, (a_uv.y - 0.5) * 2.0, 0.0, 1.0);
	gl_PointSize = 1.0;
	v_velocity = newVelocity;
}
`;

const sFragmentShaderSource = `
precision mediump float;
varying vec3 v_velocity;
void main() {
	gl_FragColor = vec4(v_velocity, 1.0);
	//gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;


export class UpdateVelocity {
	constructor(in_context) {
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			[
				"a_positionWeight",
				"a_uv",
				"a_linkUvw0", "a_linkUvw1", "a_linkUvw2", 
				"a_linkUvw3", "a_linkUvw4", "a_linkUvw5", 
				"a_linkUvw6", "a_linkUvw7", "a_linkUvw8", 
				"a_linkUvw9", "a_linkUvw10", "a_linkUvw11", 
			],
			[	
				new Uniform("u_samplerPosition", Uniform.type.int1),
				new Uniform("u_samplerVelocity", Uniform.type.int1),

				new Uniform("u_modelScaleDensitySpringconstantSpringdampen", Uniform.type.float4),
				new Uniform("u_timeDelta", Uniform.type.float1)
			]
			);
		this.material = in_context.createMaterial(this.shader);
		this.materialUniforms = {
				"u_samplerPosition" : new UniformValue(new Int32Array([0]), false),
				"u_samplerVelocity" : new UniformValue(new Int32Array([1]), false),
			}

		return;
	}

	run(in_context, in_timeDelta, in_uniformValueMap, in_renderTargetVelocity, in_model, in_texturePositionOld, in_textureVelocityOld){
		in_context.setRenderTarget(in_renderTargetVelocity);
		this.material.setTextureArray([in_texturePositionOld, in_textureVelocityOld]);
		var localUniformValueMap = Object.assign({}, this.materialUniforms, in_uniformValueMap);
		this.material.setUniformValueMap(localUniformValueMap);

		in_context.setMaterial(this.material)
		in_context.drawModel(in_model);
	}
}


