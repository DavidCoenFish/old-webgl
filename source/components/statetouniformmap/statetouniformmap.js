import PropTypes from "prop-types";

export class StateToUniformMap {
	constructor(in_arrayStateFactory) {
		this.arrayStateFactory = in_arrayStateFactory;
	}

	reducerFactory(){
		const that = this;
		return function(in_state, in_action){
			return that.reducerInternal(in_state, in_action);
		}
	}

	reducerInternal(in_state, in_action){
		if (in_state === undefined){
			const state = {};

			for (var forIndex = 0, forCount = this.arrayStateFactory.length; forIndex < forCount; ++forIndex) {
				var item = this.arrayStateFactory[forIndex];
				item.generateDefaultState(state);
			}

			return state;
		}

		switch (in_action.type){
			case "setValue": // in_action.type, in_action.key, in_action.value, 
				for (var forIndex = 0, forCount = this.arrayStateFactory.length; forIndex < forCount; ++forIndex) {
					var item = this.arrayStateFactory[forIndex];
					in_state = item.reducer(in_state, in_action.key, in_action.value);
				}
				break;
			default:
				break;
		}

		return in_state;

	}

	convertStateToUniforMap(in_state){
		const result = {};

		for (var forIndex = 0, forCount = this.arrayStateFactory.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayStateFactory[forIndex];
			item.appendStateToUniformMap(result, in_state);
		}
		
		return result;
	}

	collectElements(inout_childArray, in_state, in_onSetValue){
		for (var forIndex = 0, forCount = this.arrayStateFactory.length; forIndex < forCount; ++forIndex) {
			var item = this.arrayStateFactory[forIndex];
			item.collectElement(inout_childArray, in_state, in_onSetValue, forIndex);
		}

		return;
	}
}


export const StateToUniformMapElement = function(in_props){
	var childArray = [];

	in_props.stateToUniformMap.CollectElements(childArray, in_props.state);
	//childArray.push(React.createElement(UniformValueArray, { "key" : key, "name" : key, "value" : value, "onSetValue" : in_props.onSetValue }));

	return React.createElement("div", null, childArray);
}

//https://www.npmjs.com/package/prop-types
StateToUniformMapElement.propTypes = {
	stateToUniformMap: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
}