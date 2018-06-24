export class Uniform {
	constructor(
		in_name, 
		in_type
	){
		this.name = in_name;
		this.type = in_type;
	}

	getName(){
		return this.name;
	}

	getType(){
		return this.type;
	}
}

Uniform.type = {
	float1 : 0,
	float2 : 1,
	float3 : 2,
	float4 : 3,
	int1 : 4,
	int2 : 5,
	int3 : 6,
	int4 : 7,
	matrix2 : 8,
	matrix3 : 9,
	matrix4 : 10, 
};
