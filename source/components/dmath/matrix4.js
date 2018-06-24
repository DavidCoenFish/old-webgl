import { vector3Factory, vector3CrossProduct, vector3Normalise, vector3UnitY, vector3UnitZ, vector3Zero } from "./vector3.js";

/*
matching openGL documentation
		0_0, 0_1, 0_2, 0_3(x),
		1_0, 1_1, 1_2, 1_3(y),
		2_0, 2_1, 2_2, 2_3(z),
		3_0, 3_1, 3_2, 3_3

how i like to think of memory, (row_column)
		0_0, 1_0, 2_0, 3_0,
		0_1, 1_1, 2_1, 3_1,
		0_2, 1_2, 2_2, 3_2,
		0_3, 1_3, 2_3, 3_3
		(x)  (y)  (z)

this class works with 4x4 floats
a unit scale matix can convert <==> dual quaternion
*/

export const matrix4Factory = function(
	_0_0,
	_0_1,
	_0_2,
	_0_3,
	_1_0,
	_1_1,
	_1_2,
	_1_3,
	_2_0,
	_2_1,
	_2_2,
	_2_3,
	_3_0,
	_3_1,
	_3_2,
	_3_3,
	_result
	){
	if (_result !== undefined){
		_result[0] = (undefined != _0_0) ? _0_0 : 0.0;
		_result[1] = (undefined != _0_1) ? _0_1 : 0.0;
		_result[2] = (undefined != _0_2) ? _0_2 : 0.0;
		_result[3] = (undefined != _0_3) ? _0_3 : 0.0;
		_result[4] = (undefined != _1_0) ? _1_0 : 0.0;
		_result[5] = (undefined != _1_1) ? _1_1 : 0.0;
		_result[6] = (undefined != _1_2) ? _1_2 : 0.0;
		_result[7] = (undefined != _1_3) ? _1_3 : 0.0;
		_result[8] = (undefined != _2_0) ? _2_0 : 0.0;
		_result[9] = (undefined != _2_1) ? _2_1 : 0.0;
		_result[10] = (undefined != _2_2) ? _2_2 : 0.0;
		_result[11] = (undefined != _2_3) ? _2_3 : 0.0;
		_result[12] = (undefined != _3_0) ? _3_0 : 0.0;
		_result[13] = (undefined != _3_1) ? _3_1 : 0.0;
		_result[14] = (undefined != _3_2) ? _3_2 : 0.0;
		_result[15] = (undefined != _3_3) ? _3_3 : 0.0;
		return _result;
	}
	return new Float32Array([
		(undefined != _0_0) ? _0_0 : 0.0,
		(undefined != _0_1) ? _0_1 : 0.0,
		(undefined != _0_2) ? _0_2 : 0.0,
		(undefined != _0_3) ? _0_3 : 0.0,
		(undefined != _1_0) ? _1_0 : 0.0,
		(undefined != _1_1) ? _1_1 : 0.0,
		(undefined != _1_2) ? _1_2 : 0.0,
		(undefined != _1_3) ? _1_3 : 0.0,
		(undefined != _2_0) ? _2_0 : 0.0,
		(undefined != _2_1) ? _2_1 : 0.0,
		(undefined != _2_2) ? _2_2 : 0.0,
		(undefined != _2_3) ? _2_3 : 0.0,
		(undefined != _3_0) ? _3_0 : 0.0,
		(undefined != _3_1) ? _3_1 : 0.0,
		(undefined != _3_2) ? _3_2 : 0.0,
		(undefined != _3_3) ? _3_3 : 0.0,
		]);
}

export const matrix4GetPosition = function(in_matrix, _result){
	_result = vector3Factory(in_matrix[12], in_matrix[13], in_matrix[14], _result);
	return _result;
}

export const matrix4SetPosition = function(in_matrix, in_data){
	in_matrix[12] = in_data[0];
	in_matrix[13] = in_data[1];
	in_matrix[14] = in_data[2];
	return;
}

export const matrix4GetAt = function(in_matrix, _result){
	_result = vector3Factory(in_matrix[2], in_matrix[6], in_matrix[10], _result);
	return _result;
}

export const matrix4SetAt = function(in_matrix, in_data){
	in_matrix[2] = in_data[0];
	in_matrix[6] = in_data[1];
	in_matrix[10] = in_data[2];
	return;
}

export const matrix4GetUp = function(in_matrix, _result){
	_result = vector3Factory(in_matrix[0], in_matrix[4], in_matrix[8], _result);
	return _result;
}

export const matrix4SetUp = function(in_matrix, in_data){
	in_matrix[0] = in_data[0];
	in_matrix[4] = in_data[1];
	in_matrix[8] = in_data[2];
	return;
}


export const matrix4GetRight = function(in_matrix, _result){
	_result = vector3Factory(in_matrix[1], in_matrix[5], in_matrix[9], _result);
	return _result;
}

export const matrix4SetRight = function(in_matrix, in_data){
	in_matrix[1] = in_data[0];
	in_matrix[5] = in_data[1];
	in_matrix[9] = in_data[2];
	return;
}




export const matrix4Inverse = function(in_matrix, _result){
	_result = matrix4Factory(
		in_matrix[5]*in_matrix[10]*in_matrix[15] - in_matrix[5]*in_matrix[11]*in_matrix[14] - in_matrix[9]*in_matrix[6]*in_matrix[15] + in_matrix[9]*in_matrix[7]*in_matrix[14] + in_matrix[13]*in_matrix[6]*in_matrix[11] - in_matrix[13]*in_matrix[7]*in_matrix[10],
		-in_matrix[1]*in_matrix[10]*in_matrix[15] + in_matrix[1]*in_matrix[11]*in_matrix[14] + in_matrix[9]*in_matrix[2]*in_matrix[15] - in_matrix[9]*in_matrix[3]*in_matrix[14] - in_matrix[13]*in_matrix[2]*in_matrix[11] + in_matrix[13]*in_matrix[3]*in_matrix[10],
		in_matrix[1]*in_matrix[6]*in_matrix[15] - in_matrix[1]*in_matrix[7]*in_matrix[14] - in_matrix[5]*in_matrix[2]*in_matrix[15] + in_matrix[5]*in_matrix[3]*in_matrix[14] + in_matrix[13]*in_matrix[2]*in_matrix[7] - in_matrix[13]*in_matrix[3]*in_matrix[6],
		-in_matrix[1]*in_matrix[6]*in_matrix[11] + in_matrix[1]*in_matrix[7]*in_matrix[10] + in_matrix[5]*in_matrix[2]*in_matrix[11] - in_matrix[5]*in_matrix[3]*in_matrix[10] - in_matrix[9]*in_matrix[2]*in_matrix[7] + in_matrix[9]*in_matrix[3]*in_matrix[6],

		-in_matrix[4]*in_matrix[10]*in_matrix[15] + in_matrix[4]*in_matrix[11]*in_matrix[14] + in_matrix[8]*in_matrix[6]*in_matrix[15] - in_matrix[8]*in_matrix[7]*in_matrix[14] - in_matrix[12]*in_matrix[6]*in_matrix[11] + in_matrix[12]*in_matrix[7]*in_matrix[10],
		in_matrix[0]*in_matrix[10]*in_matrix[15] - in_matrix[0]*in_matrix[11]*in_matrix[14] - in_matrix[8]*in_matrix[2]*in_matrix[15] + in_matrix[8]*in_matrix[3]*in_matrix[14] + in_matrix[12]*in_matrix[2]*in_matrix[11] - in_matrix[12]*in_matrix[3]*in_matrix[10],
		-in_matrix[0]*in_matrix[6]*in_matrix[15] + in_matrix[0]*in_matrix[7]*in_matrix[14] + in_matrix[4]*in_matrix[2]*in_matrix[15] - in_matrix[4]*in_matrix[3]*in_matrix[14] - in_matrix[12]*in_matrix[2]*in_matrix[7] + in_matrix[12]*in_matrix[3]*in_matrix[6],
		in_matrix[0]*in_matrix[6]*in_matrix[11] - in_matrix[0]*in_matrix[7]*in_matrix[10] - in_matrix[4]*in_matrix[2]*in_matrix[11] + in_matrix[4]*in_matrix[3]*in_matrix[10] + in_matrix[8]*in_matrix[2]*in_matrix[7] - in_matrix[8]*in_matrix[3]*in_matrix[6],

		in_matrix[4]*in_matrix[9]*in_matrix[15] - in_matrix[4]*in_matrix[11]*in_matrix[13] - in_matrix[8]*in_matrix[5]*in_matrix[15] + in_matrix[8]*in_matrix[7]*in_matrix[13] + in_matrix[12]*in_matrix[5]*in_matrix[11] - in_matrix[12]*in_matrix[7]*in_matrix[9],
		-in_matrix[0]*in_matrix[9]*in_matrix[15] + in_matrix[0]*in_matrix[11]*in_matrix[13] + in_matrix[8]*in_matrix[1]*in_matrix[15] - in_matrix[8]*in_matrix[3]*in_matrix[13] - in_matrix[12]*in_matrix[1]*in_matrix[11] + in_matrix[12]*in_matrix[3]*in_matrix[9],
		in_matrix[0]*in_matrix[5]*in_matrix[15] - in_matrix[0]*in_matrix[7]*in_matrix[13] - in_matrix[4]*in_matrix[1]*in_matrix[15] + in_matrix[4]*in_matrix[3]*in_matrix[13] + in_matrix[12]*in_matrix[1]*in_matrix[7] - in_matrix[12]*in_matrix[3]*in_matrix[5],
		-in_matrix[0]*in_matrix[5]*in_matrix[11] + in_matrix[0]*in_matrix[7]*in_matrix[9] + in_matrix[4]*in_matrix[1]*in_matrix[11] - in_matrix[4]*in_matrix[3]*in_matrix[9] - in_matrix[8]*in_matrix[1]*in_matrix[7] + in_matrix[8]*in_matrix[3]*in_matrix[5],

		-in_matrix[4]*in_matrix[9]*in_matrix[14] + in_matrix[4]*in_matrix[10]*in_matrix[13] + in_matrix[8]*in_matrix[5]*in_matrix[14] - in_matrix[8]*in_matrix[6]*in_matrix[13] - in_matrix[12]*in_matrix[5]*in_matrix[10] + in_matrix[12]*in_matrix[6]*in_matrix[9],
		in_matrix[0]*in_matrix[9]*in_matrix[14] - in_matrix[0]*in_matrix[10]*in_matrix[13] - in_matrix[8]*in_matrix[1]*in_matrix[14] + in_matrix[8]*in_matrix[2]*in_matrix[13] + in_matrix[12]*in_matrix[1]*in_matrix[10] - in_matrix[12]*in_matrix[2]*in_matrix[9],
		-in_matrix[0]*in_matrix[5]*in_matrix[14] + in_matrix[0]*in_matrix[6]*in_matrix[13] + in_matrix[4]*in_matrix[1]*in_matrix[14] - in_matrix[4]*in_matrix[2]*in_matrix[13] - in_matrix[12]*in_matrix[1]*in_matrix[6] + in_matrix[12]*in_matrix[2]*in_matrix[5],
		in_matrix[0]*in_matrix[5]*in_matrix[10] - in_matrix[0]*in_matrix[6]*in_matrix[9] - in_matrix[4]*in_matrix[1]*in_matrix[10] + in_matrix[4]*in_matrix[2]*in_matrix[9] + in_matrix[8]*in_matrix[1]*in_matrix[6] - in_matrix[8]*in_matrix[2]*in_matrix[5],
		_result
		);

	const det = in_matrix[0] * _result[0] + in_matrix[4] * _result[1] + in_matrix[8] * _result[2] + in_matrix[12] * _result[3];
	const idet = 1.0 / det;
	_result[0] *= idet;
	_result[1] *= idet;
	_result[2] *= idet;
	_result[3] *= idet;
	_result[4] *= idet;
	_result[5] *= idet;
	_result[6] *= idet;
	_result[7] *= idet;
	_result[8] *= idet;
	_result[9] *= idet;
	_result[10] *= idet;
	_result[11] *= idet;
	_result[12] *= idet;
	_result[13] *= idet;
	_result[14] *= idet;
	_result[15] *= idet;

	return _result;
};

export const matrix4Transpose = function(in_matrix, _result){
	_result = matrix4Factory(
		in_matrix[0],
		in_matrix[4],
		in_matrix[8],
		in_matrix[12],
		in_matrix[1],
		in_matrix[5],
		in_matrix[9],
		in_matrix[13],
		in_matrix[2],
		in_matrix[6],
		in_matrix[10],
		in_matrix[14],
		in_matrix[3],
		in_matrix[7],
		in_matrix[11],
		in_matrix[15],
		_result
		);

	return _result;
}

export const matrix4FactoryAtUp = function(
	in_targetAt, 
	in_targetUp,
	_baseAt, //UnitY
	_baseUp, //UnitZ
	_position,
	_result
	){
	const in_baseAt = (undefined == _baseAt) ? vector3UnitY : _baseAt;
	const in_baseUp = (undefined == _baseUp) ? vector3UnitZ : _baseUp;
	const in_position = (undefined == _position) ? vector3Zero : _position;
	
	matrix4FactoryAtUp.sCrossBaseUpAt = vector3CrossProduct(in_baseUp, in_baseAt, matrix4FactoryAtUp.sCrossBaseUpAt);
	const crossBaseUpAt = matrix4FactoryAtUp.sCrossBaseUpAt;
	matrix4FactoryAtUp.sCossTargetUpAt = vector3CrossProduct(in_targetUp, in_targetAt, matrix4FactoryAtUp.sCossTargetUpAt);
	const crossTargetUpAt = matrix4FactoryAtUp.sCossTargetUpAt;

	_result = matrix4Factory(
		(in_baseAt[0] * in_targetAt[0]) + (crossBaseUpAt[0] * crossTargetUpAt[0]) + (in_baseUp[0] * in_targetUp[0]),
		(in_baseAt[0] * in_targetAt[1]) + (crossBaseUpAt[0] * crossTargetUpAt[1]) + (in_baseUp[0] * in_targetUp[1]),
		(in_baseAt[0] * in_targetAt[2]) + (crossBaseUpAt[0] * crossTargetUpAt[2]) + (in_baseUp[0] * in_targetUp[2]),
		0.0,

		(in_baseAt[1] * in_targetAt[0]) + (crossBaseUpAt[1] * crossTargetUpAt[0]) + (in_baseUp[1] * in_targetUp[0]),
		(in_baseAt[1] * in_targetAt[1]) + (crossBaseUpAt[1] * crossTargetUpAt[1]) + (in_baseUp[1] * in_targetUp[1]),
		(in_baseAt[1] * in_targetAt[2]) + (crossBaseUpAt[1] * crossTargetUpAt[2]) + (in_baseUp[1] * in_targetUp[2]),
		0.0,

		(in_baseAt[2] * in_targetAt[0]) + (crossBaseUpAt[2] * crossTargetUpAt[0]) + (in_baseUp[2] * in_targetUp[0]),
		(in_baseAt[2] * in_targetAt[1]) + (crossBaseUpAt[2] * crossTargetUpAt[1]) + (in_baseUp[2] * in_targetUp[1]),
		(in_baseAt[2] * in_targetAt[2]) + (crossBaseUpAt[2] * crossTargetUpAt[2]) + (in_baseUp[2] * in_targetUp[2]),
		0.0,

		in_position[0],
		in_position[1],
		in_position[2],
		1.0,

		_result
		);

	return _result;
}

export const matrix4FactoryPos = function(
	in_position,
	_result
	){
	_result = matrix4Factory(
		1.0,
		0.0,
		0.0,
		0.0,

		0.0,
		1.0,
		0.0,
		0.0,

		0.0,
		0.0,
		1.0,
		0.0,

		in_position[0],
		in_position[1],
		in_position[2],
		1.0,

		_result
		);

	return _result;
}

export const matrix4FactoryAxisAngle = function(in_axis, in_angleRad, _position, _result){
	const in_position = (undefined == _position) ? vector3Zero : _position;

	matrix4FactoryAxisAngle.sAxis = vector3Normalise(in_axis, matrix4FactoryAxisAngle.sAxis);
	const axis = matrix4FactoryAxisAngle.sAxis;

	const c = Math.cos(in_angleRad);
	const s = Math.sin(in_angleRad);
	const t = 1.0 - c;

	const tmp1_01 = axis[0] * axis[1] * t;
	const tmp2_01 = axis[2] * s;

	const tmp1_02 = axis[0] * axis[2] * t;
	const tmp2_02 = axis[1] * s;

	const tmp1_21 = axis[1] * axis[2] * t;
	const tmp2_21 = axis[0] * s;

	_result = matrix4Factory(
		c + axis[0] * axis[0] * t,	
		tmp1_01 + tmp2_01,				
		tmp1_02 - tmp2_02,				
		0.0,

		tmp1_01 - tmp2_01,			
		c + axis[1] * axis[1] * t,
		tmp1_21 + tmp2_21,			
		0.0,

		tmp1_02 + tmp2_02,			
		tmp1_21 - tmp2_21,			
		c + axis[2] * axis[2] * t,
		0.0,

		in_position[0],
		in_position[1],
		in_position[2],
		1.0,
		_result
		);

	return _result;
}

export const matrix4FactoryQuaternion = function(in_quaternion, _position, _result){
	const in_position = (undefined == _position) ? vector3Zero : _position;

	const X = in_quaternion[0]; //I
	const Y = in_quaternion[1]; //J
	const Z = in_quaternion[2]; //K
	const W = in_quaternion[3];

	const xx      = X * X;
	const xy      = X * Y;
	const xz      = X * Z;
	const xw      = X * W;
	const yy      = Y * Y;
	const yz      = Y * Z;
	const yw      = Y * W;
	const zz      = Z * Z;
	const zw      = Z * W;

	_result = matrix4Factory(
		1 - 2 * ( yy + zz ),
		2 * ( xy - zw ),
		2 * ( xz + yw ),
		0.0,

		2 * ( xy + zw ),
		1 - 2 * ( xx + zz ),
		2 * ( yz - xw ),
		0.0,

		2 * ( xz - yw ),
		2 * ( yz + xw ),
		1 - 2 * ( xx + yy ),
		0.0,

		in_position[0],
		in_position[1],
		in_position[2],
		1.0,

		_result,
		);
	return _result;
}

//http://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
export const matrix4FactoryEular = function(in_elular, _position, _result){
	const in_heading = in_elular[0];
	const in_attitude = in_elular[1];
	const in_bank = in_elular[2];
	const in_position = (undefined == _position) ? vector3Zero : _position;

 	const ch = Math.cos(in_heading);
 	const sh = Math.sin(in_heading);
 	const ca = Math.cos(in_attitude);
 	const sa = Math.sin(in_attitude);
 	const cb = Math.cos(in_bank);
 	const sb = Math.sin(in_bank);

	_result = matrix4Factory(
		ch * ca,
		(sh*sb) - (ch*sa*cb),
		(ch*sa*sb) + (sh*cb),
		0.0, 
		sa,
		ca*cb,
		-ca*sb,
		0.0, 
		-sh*ca,
		(sh*sa*cb) + (ch*sb),
		(-sh*sa*sb) + (ch*cb),
		0.0, 
		in_position[0],
		in_position[1],
		in_position[2],
		1.0,
		_result,
		);
	return _result;
}

export const matrix4Multiply = function(in_lhs, in_rhs, _result){
	_result = matrix4Factory(
		(in_lhs[0] * in_rhs[0]) + (in_lhs[4] * in_rhs[1]) + (in_lhs[8] * in_rhs[2]) + (in_lhs[12] * in_rhs[3]),
		(in_lhs[1] * in_rhs[0]) + (in_lhs[5] * in_rhs[1]) + (in_lhs[9] * in_rhs[2]) + (in_lhs[13] * in_rhs[3]),
		(in_lhs[2] * in_rhs[0]) + (in_lhs[6] * in_rhs[1]) + (in_lhs[10] * in_rhs[2]) + (in_lhs[14] * in_rhs[3]),
		(in_lhs[3] * in_rhs[0]) + (in_lhs[7] * in_rhs[1]) + (in_lhs[11] * in_rhs[2]) + (in_lhs[15] * in_rhs[3]),

		(in_lhs[0] * in_rhs[4]) + (in_lhs[4] * in_rhs[5]) + (in_lhs[8] * in_rhs[6]) + (in_lhs[12] * in_rhs[7]),
		(in_lhs[1] * in_rhs[4]) + (in_lhs[5] * in_rhs[5]) + (in_lhs[9] * in_rhs[6]) + (in_lhs[13] * in_rhs[7]),
		(in_lhs[2] * in_rhs[4]) + (in_lhs[6] * in_rhs[5]) + (in_lhs[10] * in_rhs[6]) + (in_lhs[14] * in_rhs[7]),
		(in_lhs[3] * in_rhs[4]) + (in_lhs[7] * in_rhs[5]) + (in_lhs[11] * in_rhs[6]) + (in_lhs[15] * in_rhs[7]),

		(in_lhs[0] * in_rhs[8]) + (in_lhs[4] * in_rhs[9]) + (in_lhs[8] * in_rhs[10]) + (in_lhs[12] * in_rhs[11]),
		(in_lhs[1] * in_rhs[8]) + (in_lhs[5] * in_rhs[9]) + (in_lhs[9] * in_rhs[10]) + (in_lhs[13] * in_rhs[11]),
		(in_lhs[2] * in_rhs[8]) + (in_lhs[6] * in_rhs[9]) + (in_lhs[10] * in_rhs[10]) + (in_lhs[14] * in_rhs[11]),
		(in_lhs[3] * in_rhs[8]) + (in_lhs[7] * in_rhs[9]) + (in_lhs[11] * in_rhs[10]) + (in_lhs[15] * in_rhs[11]),

		(in_lhs[0] * in_rhs[12]) + (in_lhs[4] * in_rhs[13]) + (in_lhs[8] * in_rhs[14]) + (in_lhs[12] * in_rhs[15]),
		(in_lhs[1] * in_rhs[12]) + (in_lhs[5] * in_rhs[13]) + (in_lhs[9] * in_rhs[14]) + (in_lhs[13] * in_rhs[15]),
		(in_lhs[2] * in_rhs[12]) + (in_lhs[6] * in_rhs[13]) + (in_lhs[10] * in_rhs[14]) + (in_lhs[14] * in_rhs[15]),
		(in_lhs[3] * in_rhs[12]) + (in_lhs[7] * in_rhs[13]) + (in_lhs[11] * in_rhs[14]) + (in_lhs[15] * in_rhs[15]),
		_result
		);
	return _result;
}

export const matrix4MultiplyVector3 = function(in_matrix, in_vector, _w, _result){
	const x = in_vector[0];
	const y = in_vector[1];
	const z = in_vector[2];
	const w = (undefined == _w) ? 0.0 : _w;
	_result = matrix4Factory(
		(x * in_matrix[0]) + (y * in_matrix[4]) + (z * in_matrix[8]) + (w * in_matrix[12]),
		(x * in_matrix[1]) + (y * in_matrix[5]) + (z * in_matrix[9]) + (w * in_matrix[13]),
		(x * in_matrix[2]) + (y * in_matrix[6]) + (z * in_matrix[10]) + (w * in_matrix[14]),
		(x * in_matrix[3]) + (y * in_matrix[7]) + (z * in_matrix[11]) + (w * in_matrix[15]),
		_result
		);
	
	return _result;
}

export const matrix4MultiplyVector4 = function(in_matrix, in_vector, _result){
	return matrix4MultiplyVector3(
		in_matrix, 
		in_vector,
		in_vector[3],
		_result
		);
}

export const matrix4Zero = matrix4Factory();
export const matrix4Identity = matrix4Factory(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, 0.0,
	0.0, 0.0, 0.0, 1.0
	);
