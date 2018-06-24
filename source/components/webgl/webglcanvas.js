import PropTypes from "prop-types";
import React from "react";

//import {ContextHelper} from "./contexthelper.js";

/*
the client of this code will decide how often it renders, we just provide the webglContext from the canvas as appropriate
 */
export const WebglCanvas = class extends React.Component{
	constructor(in_props) {
		//console.log("WebglCanvas.constructor");
		super(in_props);

		this.canvasElement = undefined;
		this.webglContext = undefined;

		this.webglcontextlost = this.webglcontextlost.bind(this);
		this.webglcontextrestored = this.webglcontextrestored.bind(this);
		this.logAndValidate = this.logAndValidate.bind(this);
		this.throwOnGLError = this.throwOnGLError.bind(this);
	}

	throwOnGLError(in_err, in_funcName, in_args){
		throw WebGLDebugUtils.glEnumToString(in_err) + " was caused by call to: " + in_funcName;
	}

	logAndValidate(in_functionName, in_args){
		//console.log("gl." + in_functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(in_functionName, in_args) + ")");  
		for (var ii = 0; ii < in_args.length; ++ii) {
			if (in_args[ii] === undefined) {
				console.error("undefined passed to gl." + in_functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(in_functionName, in_args) + ")");
			}
		}
	}

	// after rendering
	componentDidMount() {
		//console.log("WebglCanvas.componentDidMount");
		if ((this.canvasElement === undefined) || (this.canvasElement === null)){
			alert("WebglCanvas.componentDidMount: HTML element for canvas not found");
			return;
		}
		
		var context = this.canvasElement.getContext("webgl", this.props.webglContextAttributes);
		if (process.env.NODE_ENV === "development"){
			WebGLDebugUtils.init(context);
			context = WebGLDebugUtils.makeDebugContext(context, this.throwOnGLError, this.logAndValidate);
		}
		this.webglContext = context;

		// Only continue if WebGL is available and working
		if ((this.webglContext === undefined) || (this.webglContext === null)) {
			alert("WebglCanvas.componentDidMount: Unable to get webgl context");
			return;
		}

		//https://www.khronos.org/webgl/wiki/HandlingContextLost
		this.canvasElement.addEventListener("webglcontextlost", this.webglcontextlost, false);
		this.canvasElement.addEventListener("webglcontextrestored", this.webglcontextrestored, false);

		if (this.props.onContextMount !== undefined){
			this.props.onContextMount(this.webglContext);
		}

		return;
	}

	webglcontextlost(in_event){
		//console.log("WebglCanvas.webglcontextlost");
		in_event.preventDefault();

		if (this.props.onContextLost !== undefined){
			this.props.onContextLost();
		}

		return;
	}

	webglcontextrestored(in_event){
		//console.log("WebglCanvas.webglcontextrestored");

		if (this.props.onContextRestored !== undefined){
			this.props.onContextRestored(this.webglContext);
		}
	}

	//well, should we allow resize of canvas via props width/height?
	shouldComponentUpdate(in_nextProps, in_nextState) {
		return false;
	}

	componentWillUnmount() {
		//console.log("WebglCanvas.componentWillUnmount");
		if ((this.canvasElement === undefined) || (this.canvasElement === null)){
			alert("WebglCanvas.componentWillUnmount: HTML element for canvas not found");
			return;
		}
		this.canvasElement.removeEventListener("webglcontextlost", this.webglcontextlost);
		this.canvasElement.removeEventListener("webglcontextrestored", this.webglcontextrestored);

		if (this.props.onContextUnmount !== undefined){
			this.props.onContextUnmount(this.webglContext);
		}

		return;
	}

	render() {
		//console.log("WebglCanvas.render");
		const that = this;

		var lineBreak = undefined;
		var button0 = undefined;
		var button1 = undefined;
		if (process.env.NODE_ENV === "development"){
			lineBreak = React.createElement("div");
			button0 = React.createElement("button", {"onClick": function(in_event){ that.canvasElement.loseContext(); }, "style":{"backgroundColor":"#888","border":"solid"}}, "context lost");
			button1 = React.createElement("button", {"onClick": function(in_event){ that.canvasElement.restoreContext(); }, "style":{"backgroundColor":"#888","border":"solid"}}, "context restore");
		}

		return React.createElement("div", null,
			React.createElement("canvas", {
				width: this.props.width,
				height: this.props.height,
				ref: function(in_element){ 
					if (process.env.NODE_ENV === "development"){
						that.canvasElement = WebGLDebugUtils.makeLostContextSimulatingCanvas(in_element);
						that.canvasElement.setRestoreTimeout(-1);
					} else {
						that.canvasElement = in_element; 
					}
					return;
				}}),
			lineBreak,
			button0,
			button1
		);
	}
}

WebglCanvas.defaultProps = {
	//"width":"640", 
	//"height":"480",
};

//https://www.npmjs.com/package/prop-types
WebglCanvas.propTypes = {

	//props passed into the canvas html element
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

	//class interface
	onContextMount: PropTypes.func,
	onContextUnmount: PropTypes.func,
	//Once the context is restored, WebGL resources such as textures and buffers that were created before the context was lost are no longer valid. 
	//You need to reinitialize the state of your WebGL application and recreate resources.
	onContextLost: PropTypes.func,
	onContextRestored: PropTypes.func,

	//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
	webglContextAttributes: PropTypes.shape({
		//Boolean that indicates if the canvas contains an alpha buffer
		alpha: PropTypes.bool,
		//Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits.
		depth: PropTypes.bool,
		//Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits.
		stencil: PropTypes.bool,
		//Boolean that indicates whether or not to perform anti-aliasing.
		antialias: PropTypes.bool,
		//Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha.
		premultipliedAlpha: PropTypes.bool,
		//Boolean If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
		preserveDrawingBuffer: PropTypes.bool,
		//Boolean that indicates if a context will be created if the system performance is low.
		failIfMajorPerformanceCaveat: PropTypes.bool,
	}),

};