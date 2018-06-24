//			childArray.push(React.createElement(UniformValueArray, { "key" : key, "name" : key, "value" : value, "onSetValue" : in_props.onSetValue }));

import React from "react";
import { ValueFloat } from "./valuefloat.js";
import { ValueInt } from "./valueint.js";

export const UniformValueArray = function(in_props){
	var childArray = [];

	const dataArray = in_props.value.getValue();
	for (var forIndex = 0, forCount = dataArray.length; forIndex < forCount; ++forIndex) {
		var item = dataArray[forIndex];
		//console.log("UniformValueArray name:" + in_props.name + " forIndex:" + forIndex + " item:" + item);
		
		if (dataArray instanceof Float32Array){
			childArray.push(React.createElement(ValueFloat, {
				"key" : forIndex, 
				//"locked" : false === in_props.value.getAllowedEdit(), 
				"value": item,
				"onSetValue":function(in_name, in_index){
					return function(in_value){
						const innerDataArray = new Float32Array(in_props.value.getValue());
						innerDataArray[in_index] = in_value;
						in_props.onSetValue(in_name, innerDataArray);
					}
				}(in_props.name, forIndex)
				}));
		} else if (dataArray instanceof Int32Array){
			childArray.push(React.createElement(ValueInt, {
				"key" : forIndex, 
				//"locked" : false === in_props.value.getAllowedEdit(), 
				"value": item,
				"onSetValue":function(in_name, in_index){
					return function(in_value){
						const innerDataArray = new Int32Array(in_props.value.getValue());
						innerDataArray[in_index] = in_value;
						in_props.onSetValue(in_name, innerDataArray);
					}
				}(in_props.name, forIndex)
				}));
		}
	}

	return React.createElement("div", null, 
		React.createElement("span", null, in_props.name),
		childArray
	);
}