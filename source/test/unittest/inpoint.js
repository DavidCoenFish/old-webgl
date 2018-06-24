import React from "react";
import ReactDOM from "react-dom";

import {gatherUnitTestDMath} from "./../../components/dmath/unittest/unittest.js";
import {gatherUnitTestSpring} from "./spring.js";

ReactDOM.render(
	React.createElement("div",{
		ref: function(in_element){ 

			const arrayUnitTest = [];
			gatherUnitTestDMath(arrayUnitTest);
			gatherUnitTestSpring(arrayUnitTest);

			const logMessage = function(in_message){
				in_element.innerHTML += in_message + "</br>";
			}

			logMessage("unitTest:" + (new Date).toLocaleTimeString());

			var passCount = 0;
			for (var forIndex = 0, forCount = arrayUnitTest.length; forIndex < forCount; ++forIndex) {
				var item = arrayUnitTest[forIndex];
				in_element.innerHTML += ".";
				try{
					item(logMessage);
					passCount += 1;
				} catch (in_error){
					//logMessage("FAIL:" + forIndex + " ERROR:" + in_error);
					logMessage("");
					logMessage(in_error.stack);
				}
			}

			logMessage("");
			logMessage("finished: " + passCount + "/" + arrayUnitTest.length);

			return;
		}
	}),
	document.getElementById("root")
);

