import React from "react";

import { UniformValue } from "./../../webgl/resource/material/uniformvalue.js";
import { StateFactoryFloatItem } from "../floatarray/statefactoryfloatitem";
import { vector3Factory } from "../../dmath/vector3";

export class StateFactoryVector3 {
	constructor(in_displayName, in_stateNameBase, in_uniformMapName, in_low, in_high, in_stepSize, in_defaultX, in_defaultY, in_defaultZ) {
		this.displayName = in_displayName;
		this.stateNameBase = in_stateNameBase;
		this.uniformMapName = in_uniformMapName;
		this.arrayItem = [
			new StateFactoryFloatItem("x", "x", (in_defaultX !== undefined) ? in_defaultX : 0.0, in_low, in_high, in_stepSize),
			new StateFactoryFloatItem("y", "y", (in_defaultY !== undefined) ? in_defaultY : 0.0, in_low, in_high, in_stepSize),
			new StateFactoryFloatItem("z", "z", (in_defaultZ !== undefined) ? in_defaultZ : 0.0, in_low, in_high, in_stepSize),
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
			values.push(item.calculateUniformMapValue(this.stateNameBase, in_state));
		}

		inout_result[this.uniformMapName] = new UniformValue(new Float32Array(values));

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
