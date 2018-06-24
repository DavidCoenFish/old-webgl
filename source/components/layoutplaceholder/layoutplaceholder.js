import PropTypes from "prop-types";
import React from "react";

export const LayoutPlaceHolder = function(in_props){
	return React.createElement("div", {
		"width": in_props.width, 
		"height": in_props.height,
		"style" : {
			"backgroundColor" : in_props.backgroundColor
		}
	});
}

//https://www.npmjs.com/package/prop-types
LayoutPlaceHolder.propTypes = {
	"width": PropTypes.string.isRequired,
	"height": PropTypes.string.isRequired,
	"backgroundColor": PropTypes.string.isRequired,
}