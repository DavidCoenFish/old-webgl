import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";

export const StateToUniformMapElementInner = function(in_props){
	var childArray = [];

	//	collectElements(inout_childArray, in_state, in_onSetValue){

	in_props.stateToUniformMap.collectElements(childArray, in_props.state, in_props.onSetValue);
	//childArray.push(React.createElement(UniformValueArray, { "key" : key, "name" : key, "value" : value, "onSetValue" : in_props.onSetValue }));

	return React.createElement("div", null, childArray);
}


const stateToUniformMapElementMapState = function(in_state, in_props){
	return {
		"state" : in_state
	}
}
// also use the AppMenu to add dispatch functions using app state information via the props (else we could pass it around as function params)
const stateToUniformMapElementMapDispatch = function(in_dispatch, in_props){
	return {
		"onSetValue" : function(in_key, in_value){ in_dispatch({"type" : "setValue", "key" : in_key, "value" : in_value });},
	}
}

export const StateToUniformMapElement = connect(stateToUniformMapElementMapState, stateToUniformMapElementMapDispatch)(StateToUniformMapElementInner);

//https://www.npmjs.com/package/prop-types
StateToUniformMapElement.propTypes = {
	stateToUniformMap: PropTypes.object.isRequired
}
