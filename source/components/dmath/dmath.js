export const almostZero = function(in_value, _epsilon){
	const epsilon = (undefined === _epsilon) ? 1e-6 : _epsilon;
	if (Math.abs(in_value) <= epsilon){
		return true;
	}
	return false;
}

export const almostEqual = function(in_lhs, in_rhs, _epsilon){
	return almostZero(in_lhs - in_rhs, _epsilon);
}

export const lerp = function(in_a, in_b, in_ratio){
	return (in_a * (1.0 - in_ratio)) + (in_b * in_ratio);
}

export const clamp = function(in_value, in_low, in_high){
	if (in_value < in_low){
		return in_low;
	}
	if (in_high < in_value){
		return in_high;
	}
	return in_value;
}

export const wrap = function(in_value, in_low, in_high){
	var length = in_high - in_low;
	if (0.0 == length){
		return in_low;
	}
	return (in_value) - (Math.floor((in_value - in_low) / length) * length);
}

export const smooth = function(in_value){
	return (3.0 - (2.0 * in_value)) * in_value * in_value;
}

export const radianToDegree = function(in_radian){
	return (in_radian / Math.PI) * 180.0;
}

export const degreeToRadian = function(in_degree){
	return (in_degree / 180.0) * Math.PI;
}
