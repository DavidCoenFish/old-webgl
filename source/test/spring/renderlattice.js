import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

import {Material} from "./../../components/webgl/resource/material/material.js";

const sVertexShaderSource = `
attribute vec2 a_uv;
varying vec2 v_majorAxis;
varying vec2 v_minorAxis;

uniform sampler2D u_sampler0;

uniform vec3 u_cameraPos;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraRight;

uniform vec3 u_cameraFovhFovvFar;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;

uniform vec4 u_modelScaleDensitySpringconstantSpringdampen;

void main() {
	vec3 pos = texture2D(u_sampler0, a_uv).xyz;
	vec3 cameraToAtom = pos - u_cameraPos;

	float cameraSpaceX = dot(cameraToAtom, u_cameraRight);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFar.x / 2.0;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
	float atomRadius = 0.61237243569579452454932101867647 * modelScale;

	float screenZRaw = (cameraSpaceLength + atomRadius) / u_cameraFovhFovvFar.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float atomAngle = degrees(asin(clamp(atomRadius / cameraSpaceLength, -1.0, 1.0)));
	float minorAxis = atomAngle / fovHHalf;

	float atomAngleMajor = degrees(atan(atomRadius, cameraSpaceXYLength));
	float majorAxisTemp = sin(radians(atomAngleMajor)) * polarR / fovHHalf;
	float majorAxis = max(minorAxis, majorAxisTemp);

	float pointSize = 1024.0; //arbitary max radius in pixels
	if (atomRadius < cameraSpaceLength){
		pointSize = min(1024.0, majorAxis * width);
	}

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pointSize; //point size is diameter

	v_majorAxis = vec2(cameraSpaceYNorm, cameraSpaceXNorm);
	float mul = majorAxis / minorAxis;
	v_minorAxis = vec2(cameraSpaceXNorm * mul, -cameraSpaceYNorm * mul);
}
`;

const sFragmentShaderSource = `
precision mediump float;
varying vec2 v_majorAxis;
varying vec2 v_minorAxis;
void main() {
	vec2 pointCoord = (gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
	float dist = dot(pointCoord, pointCoord);
	if (1.0 < dist){
		discard;
	}
	vec2 ellipseCoords = vec2(dot(v_majorAxis, pointCoord), dot(v_minorAxis, pointCoord));
	float ellipseDist = dot(ellipseCoords, ellipseCoords);
	if (1.0 < ellipseDist){
		discard;
	}

	gl_FragColor = vec4(gl_PointCoord.x, gl_PointCoord.y, 0.0, 1.0);
}
`;


export class RenderLattice {
	constructor(in_context) {
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			["a_uv"], 
			[	
				new Uniform("u_sampler0", Uniform.type.int1),

				new Uniform("u_cameraPos", Uniform.type.float3),
				new Uniform("u_cameraAt", Uniform.type.float3),
				new Uniform("u_cameraUp", Uniform.type.float3),
				new Uniform("u_cameraRight", Uniform.type.float3),
				new Uniform("u_cameraFovhFovvFar", Uniform.type.float3),

				new Uniform("u_viewportWidthHeightWidthhalfHeighthalf", Uniform.type.float4),

				new Uniform("u_modelScaleDensitySpringconstantSpringdampen", Uniform.type.float4)
			]
			);
		this.material = in_context.createMaterial(
			this.shader,
			undefined,
			undefined,
			true,
			Material.depthTestFlag.less
			);
		this.materialUniforms = { "u_sampler0" : new UniformValue(new Int32Array([0]), false) };

		return;
	}

	run(in_context, in_uniformValueMap, in_model, in_texturePosition){
		in_context.setRenderTarget(undefined);
		in_context.clearColorDepth(0.5, 0.5, 0.5, 1.0, 1.0);

		this.material.setTextureArray([in_texturePosition]);

		var localUniformValueMap = Object.assign({}, this.materialUniforms, in_uniformValueMap);
		this.material.setUniformValueMap(localUniformValueMap);

		in_context.setMaterial(this.material)
		in_context.drawModel(in_model);
	}

}


