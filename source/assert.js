export const assertAlways = function(in_message){
	assert(false, in_message);
}

//for development builds, log an error if condition is false
export const assert = function(in_condition, in_message) {
	if ((true !== in_condition) && (process.env.NODE_ENV === "development")){
		//console.error(in_message);
		throw new Error(in_message);
	}
}
