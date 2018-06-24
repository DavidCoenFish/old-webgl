import React from "react";

export const ValueInt = function(in_props){
	return React.createElement("input", {
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ 
			var newValue = Math.round(parseFloat(in_event.target.value));
			in_props.onSetValue(in_props.name, in_props.index, newValue); 
			},
		"value" : in_props.value,
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
};