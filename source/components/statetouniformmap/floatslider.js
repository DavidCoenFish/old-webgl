import PropTypes from "prop-types";
import React from "react";

//			<input style="width:100%" type="range" min="1" max="100" value="50" class="slider" id="myRange">
/*
stepDown()	Decrements the value of the slider control by a specified number
stepUp()

onChange

defaultValue	Sets or returns the default value of a slider control
disabled	Sets or returns whether a slider control is disabled, or not
form	Returns a reference to the form that contains the slider control
list	Returns a reference to the datalist that contains the slider control
max	Sets or returns the value of the max attribute of the slider control
min	Sets or returns the value of the min attribute of the slider control
name	Sets or returns the value of the name attribute of a slider control
step	Sets or returns the value of the step attribute of the slider control
type	Returns which type of form element the slider control is
value	Sets or returns the value of the value attribute of a slider control


			<input style="width:100%" type="range" min="1" max="100" value="50" class="slider" id="myRange">

 */
export const FloatSlider = function(in_props){
	const step = (undefined === in_props.stepSize) ? "any" : ("" + in_props.stepSize);
	return React.createElement("input", {
		"type" : "range",
		"style" : { "width" : "100%" },
		"min" : "" + in_props.rangeLow,
		"max" : "" + in_props.rangeHigh,
		"step" : step,
		"value" : "" + in_props.value,
		"onChange" : function(in_event){ 
			var newValue = parseFloat(in_event.target.value);
			in_props.onSetValue(newValue); 
			},
		}
	);
}

//https://www.npmjs.com/package/prop-types
FloatSlider.propTypes = {
	"rangeLow" : PropTypes.number.isRequired,
	"rangeHigh" : PropTypes.number.isRequired,
	"stepSize" : PropTypes.number,
	"value" : PropTypes.number.isRequired,
	"onSetValue" : PropTypes.func.isRequired,
}