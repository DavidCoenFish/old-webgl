import PropTypes from "prop-types";
import React from "react";

/*
				<input type="number" step="any" value="2.7"/>
 */
export const FloatValue = class extends React.Component{
	constructor(in_props) {
		super(in_props);

		this.onInputImediate = this.onInputImediate.bind(this);

		this.onInput = this.onInput.bind(this);
		this.onLostFocus = this.onLostFocus.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.timeoutID = undefined;
	}

	onInput(in_event){
		this.clear();
		this.timeoutID = setTimeout(this.onUpdate, 2000.0, in_event.target.value);
	}

	onLostFocus(in_event){
		this.clear();
		this.onUpdate(in_event.target.value);
	}

	clear(){
		if (undefined !== this.timeoutID){
			clearTimeout(this.timeoutID)
		}
		return;
	}

	onUpdate(in_value){
		var newValue = parseFloat(in_value);
		this.props.onSetValue(newValue); 
	}

	onInputImediate(in_event){
		var value = in_event.target.value;
		var newValue = 0.0;
		if ((value !== undefined) && (value !== "")){
			newValue = parseFloat(value);
		}
		this.props.onSetValue(newValue); 
	}

	render(){
		const step = (undefined === this.props.stepSize) ? "any" : ("" + this.props.stepSize);
		return React.createElement("input", {
			"type" : "number",
			"style" : {
				"textAlign" : "right",
			},
			"min" : "" + this.props.rangeLow,
			"max" : "" + this.props.rangeHigh,
			"step" : step,
			"value" : "" + this.props.value,
			"onChange" : this.onInputImediate,
			//"onChange" : this.onInput,
			//"onkeyup" : this.onInput,
			//"onBlur" : this.onLostFocus
		});
	}
}

//https://www.npmjs.com/package/prop-types
FloatValue.propTypes = {
	"rangeLow" : PropTypes.number.isRequired,
	"rangeHigh" : PropTypes.number.isRequired,
	"stepSize" : PropTypes.number,
	"value" : PropTypes.number.isRequired,
	"onSetValue" : PropTypes.func.isRequired,
}