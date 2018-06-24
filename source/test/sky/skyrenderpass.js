import {Texture} from "./../../components/webgl/resource/texture/texture.js";
import {Attachment} from "./../../components/webgl/resource/rendertarget/attachment.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";
import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";

import {geometryFactoryQuadPosUv} from "./geometryfactoryquadposuv.js";

const sVertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}`;

//radius of sun 695700km
//earth to sun 149.6 million km, 149598261km


const sFragmentShaderSource = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_sunAzimuthAltitude; //degrees
uniform vec3 u_sunTint;
uniform vec2 u_sunRange; //degrees
uniform vec3 u_skyTint;
uniform float u_skySpread;
//uniform vec3 u_cameraPos;

uniform float u_skyTurbitity;

//angles in degrees
vec3 calcSkyDomeColor(float gamma){
	float ratio = (1.0 - smoothstep(u_sunRange.x, u_sunRange.y, gamma));
	vec3 sky = u_skyTint * exp(u_skySpread * radians(gamma));
	vec3 result = mix(sky, u_sunTint, ratio);
	return result;
}

float calcOpticalMass(float height0, float theta, float length){
	float cosTheta = cos(radians(theta));
	float val0 = exp(height0 / 7000.0);
	float val1 = exp((height0 - (cosTheta * length)) / 7000.0);
	float result = ((val0 - val1) * (-9100.0)) / cosTheta;
	return result;
}

void main() {
	vec2 viewXY = (v_uv - vec2(0.5, 0.5)) * 2.0;
	float distSquared = dot(viewXY, viewXY);
	if (1.0 < distSquared){
		discard;
	}
	float viewZ = sqrt(1.0 - distSquared);
	vec3 viewNorm = vec3(viewXY.x, viewXY.y, viewZ);

	float sunZ = sin(radians(u_sunAzimuthAltitude.y));
	float sunXY = cos(radians(u_sunAzimuthAltitude.y));
	vec3 sunNorm = vec3(cos(radians(u_sunAzimuthAltitude.x)) * sunXY, sin(radians(u_sunAzimuthAltitude.x)) * sunXY, sunZ);

	float angleSunViewDegrees = degrees(acos(dot(viewNorm, sunNorm)));
	float temp = (angleSunViewDegrees / 180.0) * 1000.0;

	float angleViewZenithDegrees = degrees(acos(viewZ));
	float angleSunZenithDegrees = 90.0 - u_sunAzimuthAltitude.y;

	vec3 skyDomeColor = calcSkyDomeColor(angleSunViewDegrees);
	float opticalMass = calcOpticalMass(2.0, angleViewZenithDegrees, 7000.0);
	float tempOM = (opticalMass / 1000.0);
	tempOM *= tempOM;
	vec3 rgb = skyDomeColor + tempOM;
	gl_FragColor = vec4(rgb, 1.0);
}`;

export class SkyRenderPass {
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
			sFragmentShaderSource,
			["a_position", "a_uv"], 
			[
				new Uniform("u_sunAzimuthAltitude", Uniform.type.float2),
				new Uniform("u_skyTurbitity", Uniform.type.float1),

				new Uniform("u_sunTint", Uniform.type.float3),
				new Uniform("u_sunRange", Uniform.type.float2),
				new Uniform("u_skyTint", Uniform.type.float3),
				new Uniform("u_skySpread", Uniform.type.float1),
			]
			);
		this.material = in_context.createMaterial(
			this.shader,
			);

		this.model = geometryFactoryQuadPosUv(in_context);

		return;
	}
	
	update(in_context, in_timestamp, in_uniformValueMap){
		this.material.setUniformValueMap(in_uniformValueMap);

		in_context.setRenderTarget(this.renderTarget);
		in_context.clearColor(0.0, 0.0, 0.0, 1.0);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);
		return;
	}

	getOutputTextureColour(){
		return this.textureColor;
	}
}