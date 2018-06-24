import React from "react";

export const ValueFloat = function(in_props){
	return React.createElement("input", {
		"type":"number",
		"disabled" : ((true === in_props.locked) ? "disabled" : undefined),
		"onChange" : function(in_event){ 
			var newValue = parseFloat(in_event.target.value);
			in_props.onSetValue(newValue); 
			},
		"value" : in_props.value,
		"style": {
			"width":"100%",
			"height":"1.333em"
		}});
};