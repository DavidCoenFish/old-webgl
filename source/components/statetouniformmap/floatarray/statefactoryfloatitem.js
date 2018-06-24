import React from "react";
import { FloatSlider } from "./../floatslider.js";
import { FloatValue } from "../floatvalue";

export class StateFactoryFloatItem {
	constructor(in_displayName, in_stateName, in_defaultValue, in_rangeLow, in_rangeHigh, in_stepSize) {
		this.displayName = in_displayName;
		this.stateName = in_stateName;
		this.defaultValue = in_defaultValue;
		this.rangeLow = in_rangeLow;
		this.rangeHigh = in_rangeHigh;
		this.stepSize = in_stepSize;
	}

	makeKey(in_stateNameBase){
		return in_stateNameBase + "." + this.stateName;
	}

	generateDefaultState(inout_result, in_stateNameBase){
		const key = this.makeKey(in_stateNameBase);
		inout_result[key] = this.defaultValue;
		return;
	}

	calculateUniformMapValue(in_stateNameBase, in_state){
		const key = this.makeKey(in_stateNameBase);
		return in_state[key];
	}

	reducer(in_state, in_stateNameBase, in_key, in_value){
		const key = this.makeKey(in_stateNameBase);
		if (key === in_key){
			var result = Object.assign({}, in_state);
			result[key] = in_value;
			return result;
		}
		return in_state;
	}

	collectElement(inout_childArray, in_stateNameBase, in_state, in_onSetValue, in_key){
		const key = this.makeKey(in_stateNameBase);
		const value = in_state[key];
		inout_childArray.push(React.createElement(
			"div", 
			{
				"key" : key + "_a",
				"style" : {
					"display" : "flex",
					"justifyContent" : "space-between"
				},
			},
			React.createElement("span", null, this.displayName),
			React.createElement(FloatValue, {
				"rangeLow" : this.rangeLow,
				"rangeHigh" : this.rangeHigh,
				"stepSize" : this.stepSize,
				"value" : value,
				"onSetValue" : function(in_newValue){ in_onSetValue(key, in_newValue); }
			})
			//React.createElement("span", null, value)
		));
		inout_childArray.push(React.createElement(FloatSlider, {
			"key" : key + "_b",
			"rangeLow" : this.rangeLow,
			"rangeHigh" : this.rangeHigh,
			"stepSize" : this.stepSize,
			"value" : value,
			"onSetValue" : function(in_newValue){ in_onSetValue(key, in_newValue); }
		}));
	}
}
