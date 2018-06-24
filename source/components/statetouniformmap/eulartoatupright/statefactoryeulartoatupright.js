import React from "react";

import { UniformValue } from "./../../webgl/resource/material/uniformvalue.js";
import { StateFactoryFloatItem } from "../floatarray/statefactoryfloatitem";
import { matrix4GetAt, matrix4GetUp, matrix4GetRight, matrix4FactoryEular } from "../../dmath/matrix4";
import { degreeToRadian } from "../../dmath/dmath";

export class StateFactoryEularToAtUpRight {
	constructor(in_displayName, in_stateNameBase, in_uniformMapName) {
		this.displayName = in_displayName;
		this.stateNameBase = in_stateNameBase;
		this.uniformMapName = in_uniformMapName;
		this.arrayItem = [
			new StateFactoryFloatItem("heading", "heading", 0.0, -180.0, 180.0),
			new StateFactoryFloatItem("attitude", "attitude", 0.0, -180.0, 180.0),
			new StateFactoryFloatItem("bank", "bank", 0.0, -180.0, 180.0),
		];
	}

	generateDefaultState(inout_result){
		for (var forIndex = 0, forCount = this.arrayItem.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayItem[forIndex];
			item.generateDefaultState(inout_result, this.stateNameBase);
		}

		return;
	}

	appendStateToUniformMap(inout_result, in_state){
		var values = [];
		for (var forIndex = 0, forCount = this.arrayItem.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayItem[forIndex];
			var subValue = item.calculateUniformMapValue(this.stateNameBase, in_state);
			values.push(degreeToRadian(subValue));
		}

		const eular = new Float32Array(values);
		const matrix = matrix4FactoryEular(eular);

		inout_result[this.uniformMapName + "At"] = new UniformValue(matrix4GetAt(matrix));
		inout_result[this.uniformMapName + "Up"] = new UniformValue(matrix4GetUp(matrix));
		inout_result[this.uniformMapName + "Right"] = new UniformValue(matrix4GetRight(matrix));

		return;
	}

	reducer(in_state, in_key, in_value){
		var result = in_state;
		for (var forIndex = 0, forCount = this.arrayItem.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayItem[forIndex];
			result = item.reducer(result, this.stateNameBase, in_key, in_value);
		}

		return result;
	}

	collectElement(inout_childArray, in_state, in_onSetValue, in_key){
		var childArray = [];
		for (var forIndex = 0, forCount = this.arrayItem.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayItem[forIndex];
			item.collectElement(childArray, this.stateNameBase, in_state, in_onSetValue, forIndex);
		}

		inout_childArray.push(React.createElement("div", { "key": in_key }, 
			React.createElement("span", null, this.displayName),
			childArray
			)
		);
		return;
	}


}
