import PropTypes from "prop-types";
import React from "react";
import { UniformValueArray } from "./uniformvaluearray.js";

export const UniformValueMapEdit = function(in_props){
	var childArray = [];

	//console.log("UniformValueMapEdit in_props.uniformValueMap:" + JSON.stringify(in_props.uniformValueMap));

	if (in_props.uniformValueMap !== undefined){
		for (var key in in_props.uniformValueMap) {
			if (false === in_props.uniformValueMap.hasOwnProperty(key)) {
				continue;
			}
			const value = in_props.uniformValueMap[key];

			childArray.push(React.createElement(UniformValueArray, { "key" : key, "name" : key, "value" : value, "onSetValue" : in_props.onSetValue }));

			//childArray.push(React.createElement("div", { "key" : key }, key));
		}
	}


	return React.createElement("div", null, childArray);
}

//https://www.npmjs.com/package/prop-types
UniformValueMapEdit.propTypes = {
	uniformValueMap: PropTypes.object
}