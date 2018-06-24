import {UniformValue} from "./../../components/webgl/resource/material/uniformvalue.js";
import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";
import {Uniform} from "./../../components/webgl/resource/shader/uniform.js";

const sVertexShaderSource = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const sFragmentShaderSource = `
precision mediump float;
uniform vec4 u_colour;
void main() {
	gl_FragColor = u_colour;
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
		this.shader = in_context.createShader(
			sVertexShaderSource, 
			sFragmentShaderSource,
			["a_position"], 
			[new Uniform("u_colour", Uniform.type.float4)]
			);
		this.material = in_context.createMaterial(
			this.shader, 
			{"u_colour" : new UniformValue(new Float32Array([0.0, 0.0, 1.0, 1.0]))}
			);
		this.model = in_context.createModel(
			Model.modeEnum.triangles,
			3,
			[
				new DataStream(
					"a_position", 
					2, 
					new Int8Array([
						-1, -1,
						-1, 1,
						1, -1]),
					DataStream.usageFlag.staticDraw,
					false)
			]
			);
	}

	onUpdate(in_context, in_timestamp){
		in_context.clearColor(0.5, 0.5, 0.5, 1.0);
		in_context.setMaterial(this.material)
		in_context.drawModel(this.model);

		return false;
	}
}
