import { gatherUnitTestDMathDMath } from "./dmathunittest.js";
import { gatherUnitTestDMathEular } from "./eularunittest.js";
import { gatherUnitTestDMathMatrix4 } from "./matrix4unittest.js";
import { gatherUnitTestDMathVector3 } from "./vector3unittest.js";

export const gatherUnitTestDMath = function(inout_arrayUnitTest){
	gatherUnitTestDMathDMath(inout_arrayUnitTest);
	gatherUnitTestDMathEular(inout_arrayUnitTest);
	gatherUnitTestDMathMatrix4(inout_arrayUnitTest);
	gatherUnitTestDMathVector3(inout_arrayUnitTest);
}
