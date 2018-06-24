import { testEqual, testInRangeInclusive, testAlmostEqual, testNotEqual, testLess } from "./../../unittest/unittest.js";
import { eularFactoryMatrix4 } from "./../eular.js";
import { matrix4FactoryEular } from "./../matrix4.js";
import { vector3Factory } from "../vector3";
import { degreeToRadian } from "../dmath";

const eularMatrix4UnitTest = function(in_logMessage){
	const eular0 = vector3Factory(degreeToRadian(45), degreeToRadian(30), degreeToRadian(15));
	const matrix0 = matrix4FactoryEular(eular0);
	const eular0out = eularFactoryMatrix4(matrix0);
	testAlmostEqual(eular0[0], eular0out[0], "eularMatrix0 0");
	testAlmostEqual(eular0[1], eular0out[1], "eularMatrix0 1");
	testAlmostEqual(eular0[2], eular0out[2], "eularMatrix0 2");

	const eular1 = vector3Factory(degreeToRadian(-45), degreeToRadian(-30), degreeToRadian(-15));
	const matrix1 = matrix4FactoryEular(eular1);
	const eular1out = eularFactoryMatrix4(matrix1);
	testAlmostEqual(eular1[0], eular1out[0], "eularMatrix1 0");
	testAlmostEqual(eular1[1], eular1out[1], "eularMatrix1 1");
	testAlmostEqual(eular1[2], eular1out[2], "eularMatrix1 2");

	const eular2 = vector3Factory(degreeToRadian(0), degreeToRadian(0), degreeToRadian(0));
	const matrix2 = matrix4FactoryEular(eular2);
	const eular2out = eularFactoryMatrix4(matrix2);
	testAlmostEqual(eular2[0], eular2out[0], "eularMatrix2 0");
	testAlmostEqual(eular2[1], eular2out[1], "eularMatrix2 1");
	testAlmostEqual(eular2[2], eular2out[2], "eularMatrix2 2");


	return;
}

export const gatherUnitTestDMathEular = function(inout_arrayUnitTest){
	inout_arrayUnitTest.push(eularMatrix4UnitTest);
}