//https://stackoverflow.com/questions/1997661/unique-object-identifier-in-javascript KalEl
var __next_objid=1;
export const objectId = function(obj) {
	if (obj==null){ return null; }
	if (obj.__obj_id==null){ 
		obj.__obj_id=__next_objid++; 
	}
	return obj.__obj_id;
}
