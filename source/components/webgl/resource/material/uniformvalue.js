//location is kept with shader
export class UniformValue {
	constructor(in_value) {
		this.value = in_value;
	}

	getValue() {
		return this.value;
	}

	setValue(in_value) {
		this.value = in_value;
		return;
	}
}
