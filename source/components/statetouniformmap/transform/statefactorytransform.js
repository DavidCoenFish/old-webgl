import React from "react";

import { UniformValue } from "./../../webgl/resource/material/uniformvalue.js";
import { StateFactoryEularToAtUpRight } from "../eulartoatupright/statefactoryeulartoatupright";
import { StateFactoryVector3 } from "../vector3/statefactoryvector3";
import { matrix4GetAt, matrix4GetUp, matrix4GetRight, matrix4FactoryEular } from "../../dmath/matrix4";
import { degreeToRadian } from "../../dmath/dmath";

export class StateFactoryTransform {
	constructor(in_displayName, in_stateNameBase, in_uniformMapName, in_posLow, in_posHigh, in_posStepSize, in_posDefaultX, in_posDefaultY, in_posDefaultZ) {
		this.displayName = in_displayName;
		this.eularToAtUpRight = new StateFactoryEularToAtUpRight("rotation", in_stateNameBase, in_uniformMapName);
		this.transform = new StateFactoryVector3("position", in_stateNameBase + "Pos", in_uniformMapName + "Pos", in_posLow, in_posHigh, in_posStepSize, in_posDefaultX, in_posDefaultY, in_posDefaultZ);
	}

	generateDefaultState(inout_result){
		this.eularToAtUpRight.generateDefaultState(inout_result);
		this.transform.generateDefaultState(inout_result);
		return;
	}

	appendStateToUniformMap(inout_result, in_state){
		this.eularToAtUpRight.appendStateToUniformMap(inout_result, in_state);
		this.transform.appendStateToUniformMap(inout_result, in_state);
		return;
	}

	reducer(in_state, in_key, in_value){
		var result = in_state;
		result = this.eularToAtUpRight.reducer(result, in_key, in_value);
		result = this.transform.reducer(result, in_key, in_value);
		return result;
	}

	collectElement(inout_childArray, in_state, in_onSetValue, in_key){
		var childArray = [];
		this.eularToAtUpRight.collectElement(childArray, in_state, in_onSetValue, in_key + "rot");
		this.transform.collectElement(childArray, in_state, in_onSetValue, in_key + "pos");

		inout_childArray.push(React.createElement("div", { "key": in_key }, 
			React.createElement("span", null, this.displayName),
			childArray
			)
		);
		return;
	}


}
