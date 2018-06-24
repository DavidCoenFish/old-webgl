import {Model} from "./../../components/webgl/resource/model/model.js";
import {DataStream} from "./../../components/webgl/resource/model/datastream.js";

export const geometryFactoryQuadPosUv = function(in_context, in_left, in_right, in_top, in_bottom){
	return in_context.createModel(
		Model.modeEnum.triangles,
		6,
		[
			new DataStream(
				"a_position", 
				2, 
				new Float32Array([
					in_left, in_top, //-1, 1, //-1,
					in_right, in_top, //1, 1,
					in_left, in_bottom, //-1, -1,
					in_right, in_top, //1,1,
					in_right, in_bottom, //1,-1,
					in_left, in_bottom //-1,-1
					]),
				),
			new DataStream(
				"a_uv", 
				2, 
				new Uint8Array([
					0, 0,
					1, 0,
					0, 1,
					1, 0,
					1, 1,
					0, 1
					]),
				),
		]
		);
};
