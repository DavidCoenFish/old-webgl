import { testEqual, testInRangeInclusive, testAlmostEqual, testNotEqual, testLess } from "./../../unittest/unittest.js";
import { vector3Factory, vector3Length, vector3DotProduct, vector3Plus, vector3Minus, vector3MultiplyNumeric, vector3DivideNumeric, vector3Lerp, vector3Clamp, vector3Wrap, vector3CrossProduct, vector3Normalise, vector3UnitX, vector3UnitY, vector3UnitZ } from "./../vector3.js";

const vector3FactoryUnitTest = function(in_messageLog){
	var test0 = vector3Factory();
	testAlmostEqual(test0[0], 0, undefined, "vector3Factory 0");
	testAlmostEqual(test0[1], 0, undefined, "vector3Factory 1");
	testAlmostEqual(test0[2], 0, undefined, "vector3Factory 2");
	var test1 = vector3Factory(1.0, 2.0, 3.0, test0);
	testAlmostEqual(test0[0], 1, undefined, "vector3Factory 3");
	testAlmostEqual(test0[1], 2, undefined, "vector3Factory 4");
	testAlmostEqual(test0[2], 3, undefined, "vector3Factory 5");
	return;
}

const vector3LengthUnitTest = function(in_messageLog){
	var test0 = vector3Factory();
	testAlmostEqual(vector3Length(test0), 0, undefined, "vector3Length 0");
	var test1 = vector3Factory(3.0, 0.0, 4.0);
	testAlmostEqual(vector3Length(test1), 5, undefined, "vector3Length 1");
	return;
}

const vector3DotProductUnitTest = function(in_messageLog){
	var test0 = vector3Factory();
	testAlmostEqual(vector3DotProduct(test0, vector3UnitX), 0, undefined, "vector3DotProduct 0");
	var test1 = vector3Factory(3, 4, 5);
	testAlmostEqual(vector3DotProduct(test1, vector3UnitX), 3, undefined, "vector3DotProduct 1");
	testAlmostEqual(vector3DotProduct(test1, vector3UnitY), 4, undefined, "vector3DotProduct 2");
	testAlmostEqual(vector3DotProduct(test1, vector3UnitZ), 5, undefined, "vector3DotProduct 3");
}

const vector3PlusUnitTest = function(in_messageLog){
	var test0 = vector3Factory(1, 2, 3);
	var test1 = vector3Factory(4, 5, 6);
	var test2 = vector3Plus(test0, test1);
	testAlmostEqual(test2[0], 5, undefined, "vector3Plus 0");
	testAlmostEqual(test2[1], 7, undefined, "vector3Plus 1");
	testAlmostEqual(test2[2], 9, undefined, "vector3Plus 2");
}

const vector3MinusUnitTest = function(in_messageLog){
}

const vector3MultiplyNumericUnitTest = function(in_messageLog){
}

const vector3DivideNumericUnitTest = function(in_messageLog){
}

const vector3LerpUnitTest = function(in_messageLog){
}

const vector3ClampUnitTest = function(in_messageLog){
}

const vector3WrapUnitTest = function(in_messageLog){
}

const vector3CrossProductUnitTest = function(in_messageLog){
}

const vector3NormaliseUnitTest = function(in_messageLog){
}

export const gatherUnitTestDMathVector3 = function(inout_arrayUnitTest){
	inout_arrayUnitTest.push(vector3FactoryUnitTest);
	inout_arrayUnitTest.push(vector3LengthUnitTest);
	inout_arrayUnitTest.push(vector3DotProductUnitTest);
	inout_arrayUnitTest.push(vector3PlusUnitTest);
	inout_arrayUnitTest.push(vector3MinusUnitTest);
	inout_arrayUnitTest.push(vector3MultiplyNumericUnitTest);
	inout_arrayUnitTest.push(vector3DivideNumericUnitTest);
	inout_arrayUnitTest.push(vector3LerpUnitTest);
	inout_arrayUnitTest.push(vector3ClampUnitTest);
	inout_arrayUnitTest.push(vector3WrapUnitTest);
	inout_arrayUnitTest.push(vector3CrossProductUnitTest);
	inout_arrayUnitTest.push(vector3NormaliseUnitTest);
	return;
}
