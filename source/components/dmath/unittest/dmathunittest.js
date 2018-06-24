import { testEqual, testInRangeInclusive, testAlmostEqual, testNotEqual, testLess } from "./../../unittest/unittest.js";
import { almostZero, almostEqual, lerp, clamp, wrap, smooth, radianToDegree, degreeToRadian } from "./../dmath.js";

const almostZeroUnitTest = function(in_logMessage){
	testEqual(almostZero(0), true, "almostZero 0");
	testEqual(almostZero(0.1), false, "almostZero 1");
	testEqual(almostZero(-0.1), false, "almostZero 2");
	testEqual(almostZero(0.01, 0.05), true, "almostZero 3");
	testEqual(almostZero(-0.01, 0.05), true, "almostZero 4");
	return;
}

const almostEqualUnitTest = function(in_logMessage){
	testEqual(almostEqual(0, 0), true, "almostEqual 0");
	testEqual(almostEqual(0, 0.1), false, "almostEqual 1");
	testEqual(almostEqual(1.0, 1.01, 0.05), true, "almostEqual 2");
	testEqual(almostEqual(1.0, 0.99, 0.05), true, "almostEqual 3");
	testEqual(almostEqual(1.0, 0.9, 0.05), false, "almostEqual 4");
	return;
}

const lerpUnitTest = function(in_logMessage){
	testEqual(lerp(0, 1, 0.5), 0.5, "lerp 0");
	testEqual(lerp(2, 10, 0.1), 2.8, "lerp 1");
	testEqual(lerp(2, 10, 0), 2, "lerp 2");
	testEqual(lerp(2, 10, 1), 10, "lerp 3");
	return;
}

const clampUnitTest = function(in_logMessage){
	testEqual(clamp(5, -1, 1), 1, "clamp 0");
	testEqual(clamp(0, -1, 1), 0, "clamp 1");
	testEqual(clamp(-1, -1, 1), -1, "clamp 2");
	testEqual(clamp(0.5, -1, 1), 0.5, "clamp 3");
	testEqual(clamp(1, -1, 1), 1, "clamp 4");
	testEqual(clamp(1.5, -1, 1), 1, "clamp 5");
	testEqual(clamp(-1, 0, 10), 0, "clamp 6");
	testEqual(clamp(5, 0, 10), 5, "clamp 7");
	testEqual(clamp(15, 0, 10), 10, "clamp 8");
	return;
}

const wrapUnitTest = function(in_logMessage){
	testEqual(wrap(7, 1, 5), 3, "wrap 0");
	testEqual(wrap(0, 0, 1), 0, "wrap 1");
	testEqual(wrap(1, 0, 1), 0, "wrap 2");
	testEqual(wrap(1.5, 0, 1), 0.5, "wrap 3");
	testEqual(wrap(29, 0, 10), 9, "wrap 4");
	return;
}

const smoothUnitTest = function(in_logMessage){
	testEqual(smooth(0.0), 0.0, "smooth 0");
	testInRangeInclusive(smooth(0.25), 0.0, 1.0, "smooth 0.25");
	testInRangeInclusive(smooth(0.5), 0.0, 1.0, "smooth 0.5");
	testInRangeInclusive(smooth(0.75), 0.0, 1.0, "smooth 0.75");
	testEqual(smooth(1.0), 1.0, "smooth 1");
	testLess(smooth(0.1), smooth(0.11), "smooth 0.1 < 0.11");
	testLess(smooth(0.0), smooth(0.01), "smooth 0.0 < 0.01");
	return;
}

const degreeRadianUnitTest = function(in_logMessage){
	testAlmostEqual(radianToDegree(1.0), 57.2958, 0.0001, "degree radian 0");
	testAlmostEqual(degreeToRadian(57.2958), 1.0, 0.0001, "degree radian 1");
	return;
}

export const gatherUnitTestDMathDMath = function(inout_arrayUnitTest){
	inout_arrayUnitTest.push(almostZeroUnitTest);
	inout_arrayUnitTest.push(almostEqualUnitTest);
	inout_arrayUnitTest.push(lerpUnitTest);
	inout_arrayUnitTest.push(clampUnitTest);
	inout_arrayUnitTest.push(wrapUnitTest);
	inout_arrayUnitTest.push(smoothUnitTest);
	inout_arrayUnitTest.push(degreeRadianUnitTest);
	return;
}
