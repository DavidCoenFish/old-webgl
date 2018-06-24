import { vector3Factory, vector3Length, vector3Minus, vector3Normalise, vector3MultiplyNumeric, vector3DotProduct, vector3Plus, vector3DivideNumeric, vector3UnitZ } from "../../components/dmath/vector3";
import { testAlmostEqual } from "../../components/unittest/unittest";
import { almostZero } from "../../components/dmath/dmath";

const testBasic = function(in_messageLog){
	var timeStep = 0.1;
	var value = 1;
	var vel = 0;
	var springConstant = 1.0;
	var mass = 1;
	in_messageLog("value:" + value + " vel:" + vel);
	for (var index = 0; index < 100; ++index){
		var springForce = -springConstant * value;
		var accel = springForce / mass;
		vel += (accel * timeStep);
		vel *= 0.99;
		value += (vel * timeStep);

		in_messageLog("value:" + value + " vel:" + vel);
	}
}
const testspringDistance1d = function(in_messageLog){
	testAlmostEqual(springDisplacementFromTarget1d(3.5, 6, 2), -0.5, undefined, "spring distance 0");
	testAlmostEqual(springDisplacementFromTarget1d(4.5, 6, 2), 0.5, undefined, "spring distance 1");
	testAlmostEqual(springDisplacementFromTarget1d(6, 3.5, 2), 0.5, undefined, "spring distance 2");
	testAlmostEqual(springDisplacementFromTarget1d(6, 4.5, 2), -0.5, undefined, "spring distance 3");
	testAlmostEqual(Math.abs(springDisplacementFromTarget1d(4.5, 4.5, 2)), 2, undefined, "spring distance 3");
	return;
}

//return the displacment of pointA to it's spring target
const springDisplacementFromTarget1d = function(in_pointA, in_pointB, in_springLength){
	var aToB = in_pointB - in_pointA;
	var aToBNorm = (aToB !== 0.0) ? (aToB / Math.abs(aToB)) : 1.0;
	var distanceTospringTarget = in_pointA - (in_pointB - (aToBNorm * in_springLength));	
	return distanceTospringTarget;
}
const updatePoint1d = function(in_pointA, in_pointB, inout_pointAvelocity, in_pointBvelocity, in_springLength, in_pointMass, in_springConstant, in_springDampen){
	const springDisplacement = springDisplacementFromTarget1d(in_pointA, in_pointB, in_springLength);

	console.log("pointA:" + in_pointA + " pointB:" + in_pointB + " springDisplacement:" + springDisplacement);
	var springForce = -in_springConstant * springDisplacement;
	// the rate of deformation of the spring also generates a force
	const deformationResistForce = (in_pointBvelocity[0] - inout_pointAvelocity[0]) * in_springDampen;
	console.log("springForce:" + springForce + " deformationResistForce:" + deformationResistForce);
	var accel = ((springForce + deformationResistForce) * 0.5) / in_pointMass; // each point get half

	return accel;
}
const intergratePoint1d = function(in_point, in_pointAccel, inout_pointVelocity, in_timeStep){
	inout_pointVelocity[0] += in_pointAccel * in_timeStep;
	var newPoint = in_point + (inout_pointVelocity[0] * in_timeStep);
	return newPoint;
}

const testBasic1d = function(in_messageLog){
	in_messageLog("");
	in_messageLog("spring test basic 1d");
	var pointA = 4.5;
	var pointB = 5;
	var pointAvelocity = [0];
	var pointBvelocity = [0];
	var pointAaccel;
	var pointBaccel;
	var springLength = 1;
	var pointMass = 1;
	var springConstant = 218.6;
	var springDampen = 1.0; //50.0;
	var timeStep = 0.1;
	in_messageLog("pointA:" + pointA + " velocityA:" + pointAvelocity);
	in_messageLog("pointB:" + pointB + " velocityB:" + pointBvelocity);
	in_messageLog("" + 0 + " offset:" + (pointB - pointA));
	in_messageLog("");
	for (var index = 0; index < 100; ++index){
		pointAaccel = updatePoint1d(pointA, pointB, pointAvelocity, pointBvelocity, springLength, pointMass, springConstant, springDampen);
		pointBaccel = updatePoint1d(pointB, pointA, pointBvelocity, pointAvelocity, springLength, pointMass, springConstant, springDampen);

		pointA = intergratePoint1d(pointA, pointAaccel, pointAvelocity, timeStep); 
		pointB = intergratePoint1d(pointB, pointBaccel, pointBvelocity, timeStep); 

		in_messageLog("pointA:" + pointA + " velocityA:" + pointAvelocity + " accelA:" + pointAaccel);
		in_messageLog("pointB:" + pointB + " velocityB:" + pointBvelocity + " accelB:" + pointBaccel);
		in_messageLog("" + (index + 1) + " offset:" + (pointB - pointA));
		in_messageLog("");
	}
}

const testSpringDistance3d = function(in_messageLog){
	testAlmostEqual(springDisplacementFromTarget1d(3.5, 6, 2), -0.5, undefined, "spring distance 0");

	const distance0 = springDisplacementFromTarget3d(vector3Factory(3.5, 0, 0), vector3Factory(6, 0, 0), 2, vector3UnitZ);
	testAlmostEqual(distance0[0], -0.5, undefined, "spring3d distance 0");
	testAlmostEqual(distance0[1], 0, undefined, "spring3d distance 1");
	testAlmostEqual(distance0[2], 0, undefined, "spring3d distance 2");

	const distance1 = springDisplacementFromTarget3d(vector3Factory(0, 4.5, 0), vector3Factory(0, 6, 0), 2, vector3UnitZ);
	testAlmostEqual(distance1[0], 0, undefined, "spring3d distance 3");
	testAlmostEqual(distance1[1], 0.5, undefined, "spring3d distance 4");
	testAlmostEqual(distance1[2], 0, undefined, "spring3d distance 5");

	const distance2 = springDisplacementFromTarget3d(vector3Factory(6, 0, 0), vector3Factory(3.5, 0, 0), 2, vector3UnitZ);
	testAlmostEqual(distance2[0], 0.5, undefined, "spring3d distance 6");
	testAlmostEqual(distance2[1], 0, undefined, "spring3d distance 7");
	testAlmostEqual(distance2[2], 0, undefined, "spring3d distance 8");

	const distance3 = springDisplacementFromTarget3d(vector3Factory(0, 6, 0), vector3Factory(0, 4.5, 0), 2, vector3UnitZ);
	testAlmostEqual(distance3[0], 0, undefined, "spring3d distance 9");
	testAlmostEqual(distance3[1], -0.5, undefined, "spring3d distance 10");
	testAlmostEqual(distance3[2], 0, undefined, "spring3d distance 11");

	const distance4 = springDisplacementFromTarget3d(vector3Factory(4.5, 4.5, 4.5), vector3Factory(4.5, 4.5, 4.5), 2, vector3UnitZ);
	testAlmostEqual(distance4[0], 0, undefined, "spring3d distance 9");
	testAlmostEqual(distance4[1], 0, undefined, "spring3d distance 10");
	testAlmostEqual(distance4[2], 2, undefined, "spring3d distance 11");

}

//return the displacment of pointA to it's spring target, have a direction bias so coincident pairs don't try to both push in the same direction?
const springDisplacementFromTarget3d = function(in_pointA, in_pointB, in_springLength, in_zeroLengthNormal){
	var aToB = vector3Minus(in_pointB, in_pointA);
	var length = vector3Length(aToB);
	var aToBNorm = undefined;
	if (true === almostZero(length)){
		aToBNorm = in_zeroLengthNormal;
	} else {
		aToBNorm = vector3DivideNumeric(aToB, length); 
	}
	var distanceTospringTarget = vector3Minus(in_pointA, vector3Minus(in_pointB, vector3MultiplyNumeric(aToBNorm, in_springLength)));
	return distanceTospringTarget;
}
const updatePoint3d = function(in_pointA, in_pointB, inout_pointAvelocity, in_pointBvelocity, in_springLength, in_pointMass, in_springConstant, in_springDampen, in_cooincidentNormal){
	const springDisplacement = springDisplacementFromTarget3d(in_pointA, in_pointB, in_springLength, in_cooincidentNormal);

	console.log("pointA:" + in_pointA + " pointB:" + in_pointB + " springDisplacement:" + springDisplacement);
	var springForce = vector3MultiplyNumeric(springDisplacement, -in_springConstant);
	// the rate of deformation of the spring also generates a force
	const deformationResistForce = (in_pointBvelocity[0] - inout_pointAvelocity[0]) * in_springDampen;
	console.log("springForce:" + springForce + " deformationResistForce:" + deformationResistForce);
	var accel = ((springForce + deformationResistForce) * 0.5) / in_pointMass; // each point get half

	return accel;
}
const intergratePoint1d = function(in_point, in_pointAccel, inout_pointVelocity, in_timeStep){
	inout_pointVelocity[0] += in_pointAccel * in_timeStep;
	var newPoint = in_point + (inout_pointVelocity[0] * in_timeStep);
	return newPoint;
}


const testBasic3d = function(in_messageLog){
	in_messageLog("");
	in_messageLog("spring test basic");
	var pointA = vector3Factory(0, 0, 0);
	var pointB = vector3Factory(2, 0, 0);
	var accelerationA;
	var velocityA = vector3Factory();
	var velocityB = vector3Factory();
	var timeStep = 0.1;
	in_messageLog("pointA:" + pointA);
	in_messageLog("pointB:" + pointB);
	in_messageLog("velocityA:" + velocityA);
	for (var index = 0; index < 10; ++index){
		// float distance = length(positionB - in_positionA);
		var distance = vector3Length(vector3Minus(pointB, pointA));
		// vec3 aToBNormal = (positionB - in_positionA) / distance;
		var aToBNormal = vector3Normalise(vector3Minus(pointB, pointA));

		// float modelScale = u_modelScaleDensitySpringconstantSpringdampen.x;
		var modelScale = 1.0; // distance between links
		// float springConstant = u_modelScaleDensitySpringconstantSpringdampen.z;
		var springConstant = 218.6;
		// float spring = -springConstant * (distance - modelScale);
		var spring = -springConstant * (distance - modelScale);
		// vec3 springForce = aToBNormal * spring;
		var springForce = vector3MultiplyNumeric(aToBNormal, spring);

		// float velocityToDampen = dot(aToBNormal, in_velocityB - velocityA);
		var velocityToDampen = vector3DotProduct(aToBNormal, vector3Minus(velocityB, velocityA));

		// float springDampen = u_modelScaleDensitySpringconstantSpringdampen.w;
		var springDampen = 10.0;
		// vec3 dampenForce = aToBNormal * (velocityToDampen * 0.5 * springDampen);
		var dampenForce = vector3MultiplyNumeric(aToBNormal, (velocityToDampen * springDampen));
		var dampenForce = vector3Factory();

		// vec3 acceleration = ((springForce + dampenForce) / in_mass) * in_linkUvw.z;
		var accel = vector3MultiplyNumeric(vector3Minus(dampenForce, springForce), 0.05);
		accelerationA = vector3Factory(0, -9.8, 0, accelerationA);
		accelerationA = vector3Plus(accelerationA, accel);

		//intergrate
		velocityA = vector3Plus(velocityA, vector3MultiplyNumeric(accelerationA, timeStep));
		pointA = vector3Plus(pointA, vector3MultiplyNumeric(velocityA, timeStep));
		// return acceleration;

		in_messageLog("pointA:" + pointA);
		in_messageLog("velocityA:" + velocityA);
		in_messageLog("springForce:" + springForce);
		in_messageLog("dampenForce:" + dampenForce);
		in_messageLog("accelerationA:" + accelerationA);
		in_messageLog("");
	}
}

export const gatherUnitTestSpring = function(inout_arrayUnitTest){
	//inout_arrayUnitTest.push(testBasic);
	//inout_arrayUnitTest.push(testspringDistance1d);
	//inout_arrayUnitTest.push(testBasic1d);
	inout_arrayUnitTest.push(testSpringDistance3d);
	//inout_arrayUnitTest.push(testBasic3d);
}