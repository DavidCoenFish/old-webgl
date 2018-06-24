export const testEqual = function(in_got, in_expected, in_message){
	if (in_got !== in_expected){
		throw new Error("test equal expected:" + in_expected + " got:" + in_got + " " + in_message);
	}
	return;
}

export const testInRangeInclusive = function(in_got, in_expectedLow, in_expectedHigh, in_message){
	if ((in_got < in_expectedLow) || (in_expectedHigh < in_got)){
		throw new Error("test in range inclusive expected low:" + in_expectedLow + "expected high:"+ in_expectedHigh + " got:" + in_got + " " + in_message);
	}
	return;
}

export const testAlmostEqual = function(in_got, in_expected, in_tolleranceOrUndefined, in_message){
	var tollerance = (in_tolleranceOrUndefined === undefined) ? Number.EPSILON : in_tolleranceOrUndefined;
	const variance = Math.abs(in_expected - in_got);
	if (tollerance < variance){
		throw new Error("test almost equal expected:" + in_expected + " got:" + in_got + " outside tollerance:" + tollerance + " " + in_message);
	}
	return;
}

export const testNotEqual = function(in_got, in_expected, in_message){
	if (in_got === in_expected){
		throw new Error("test not equal expected:" + in_expected + " got:" + in_got + " " + in_message);
	}
	return;
}

export const testLess = function(in_small, in_big, in_message){
	if (false === (in_small < in_big)){
		throw new Error("test less small:" + in_small + " big:" + in_big + " " + in_message);
	}
	return;
}
