import { lerp, clamp, wrap } from "./dmath.js";

export const vector3Factory = function(_x, _y, _z, _result){
	if (_result !== undefined){
		_result[0] = (undefined != _x) ? _x : 0.0;
		_result[1] = (undefined != _y) ? _y : 0.0;
		_result[2] = (undefined != _z) ? _z : 0.0;
		return _result;
	}
	return new Float32Array([
		(undefined != _x) ? _x : 0.0,
		(undefined != _y) ? _y : 0.0,
		(undefined != _z) ? _z : 0.0
		]);
}

export const vector3Length = function(in_data){
	return Math.sqrt(vector3DotProduct(in_data, in_data));
}

export const vector3DotProduct = function(in_lhs, in_rhs){
	return (in_lhs[0] * in_rhs[0]) + (in_lhs[1] * in_rhs[1]) + (in_lhs[2] * in_rhs[2]);
}

export const vector3Plus = function(in_lhs, in_rhs, _result){
	_result = vector3Factory(in_lhs[0] + in_rhs[0], in_lhs[1] + in_rhs[1], in_lhs[2] + in_rhs[2], _result);
	return _result;
}

export const vector3Minus = function(in_lhs, in_rhs, _result){
	_result = vector3Factory(in_lhs[0] - in_rhs[0], in_lhs[1] - in_rhs[1], in_lhs[2] - in_rhs[2], _result);
	return _result;
}

export const vector3MultiplyNumeric = function(in_lhs, in_operand, _result){
	_result = vector3Factory(in_lhs[0] * in_operand, in_lhs[1] * in_operand, in_lhs[2] * in_operand, _result);
	return _result;
}

export const vector3DivideNumeric = function(in_lhs, in_operand, _result){
	_result = vector3Factory(in_lhs[0] / in_operand, in_lhs[1] / in_operand, in_lhs[2] / in_operand, _result);
	return _result;
}

export const vector3Lerp = function(in_lhs, in_rhs, in_ratio, _result){
	_result = vector3Factory(
		lerp(in_lhs[0], in_rhs[0], in_ratio),
		lerp(in_lhs[1], in_rhs[1], in_ratio),
		lerp(in_lhs[2], in_rhs[2], in_ratio),
		_result
		);
	return _result;
}

export const vector3Clamp = function(in_data, in_low, in_high, _result){
	_result = vector3Factory(
		clamp(in_data[0], in_low, in_high),
		clamp(in_data[1], in_low, in_high),
		clamp(in_data[2], in_low, in_high),
		_result
		);
	return _result;
}

export const vector3Wrap = function(in_data, in_low, in_high, _result){
	_result = vector3Factory(
		wrap(in_data[0], in_low, in_high),
		wrap(in_data[1], in_low, in_high),
		wrap(in_data[2], in_low, in_high),
		_result
		);
	return _result;
}

export const vector3CrossProduct = function(in_lhs, in_rhs, _result){
	_result = vector3Factory(
		(in_lhs[1] * in_rhs[2]) - (in_lhs[2] * in_rhs[1]),
		(in_lhs[2] * in_rhs[0]) - (in_lhs[0] * in_rhs[2]),
		(in_lhs[0] * in_rhs[1]) - (in_lhs[1] * in_rhs[0]),
		_result
		);
	return _result;
}

export const vector3Normalise = function(in_data, _result){
	var lengthSquared = vector3DotProduct(in_data, in_data);
	var mul = 1.0;
	var length = lengthSquared;
	if ((0.0 != lengthSquared) && (1.0 != lengthSquared))
	{
		length = Math.sqrt(lengthSquared);
		mul = 1.0 / length;
	}
	_result = vector3Factory(
		in_data[0] * mul, 
		in_data[1] * mul, 
		in_data[2] * mul,
		_result
		);
	return _result;
}

export const vector3UnitX = vector3Factory(1.0, 0.0, 0.0);
export const vector3UnitXNeg = vector3Factory(-1.0, 0.0, 0.0);
export const vector3UnitY = vector3Factory(0.0, 1.0, 0.0);
export const vector3UnitYNeg = vector3Factory(0.0, -1.0, 0.0);
export const vector3UnitZ = vector3Factory(0.0, 0.0, 1.0);
export const vector3UnitZNeg = vector3Factory(0.0, 0.0, -1.0);
export const vector3Zero = vector3Factory(0.0, 0.0, 0.0);