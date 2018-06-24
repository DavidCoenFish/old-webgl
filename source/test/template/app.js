
//export const App = class {
export class App {
	constructor(in_props) {
		console.log("App.constructor");
		this.onStart = this.onStart.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	
		return;
	}
	onStart(in_context){
	}

	onUpdate(in_context, in_timestamp){
		return false;
	}
}
