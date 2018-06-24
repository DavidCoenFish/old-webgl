import { vector3Factory } from "./vector3.js";

//http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm
export const eularFactoryMatrix4 = function(in_matrix, _result){
	var heading = 0.0;
	var attitude = 0.0;
	var bank = 0.0;
	if (in_matrix[4] > 0.998) { // singularity at north pole
		heading = Math.atan2(in_matrix[2],in_matrix[10]);
		attitude = Math.PI/2;
		bank = 0;
	} else if (in_matrix[4] < -0.998) { // singularity at south pole
		heading = Math.atan2(in_matrix[2],in_matrix[10]);
		attitude = -Math.PI/2;
		bank = 0;
	} else {
		heading = Math.atan2(-in_matrix[8], in_matrix[0]);
		attitude = Math.asin(in_matrix[4]);
		bank = Math.atan2(-in_matrix[6], in_matrix[5]);
	}

	_result = vector3Factory(heading, attitude, bank, _result);
	return _result;
}
