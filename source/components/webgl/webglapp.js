import React from "react";
import PropTypes from "prop-types";
import {WebglCanvas} from "./webglcanvas.js";
import {Context} from "./context/context.js";
import {ResourceManager} from "./resource/resourcemanager.js";

import {RenderStats} from "./../renderstats/renderstats.js";

/*
	standard webgl app with render loop callback via props
	generates a canvas to attach to webGL context
 */
export const WebglApp = class extends React.Component{
	constructor(in_props) {
		//console.log("WebglApp.constructor");
		super(in_props);

		this.localContext = undefined;
		//this.resourceManager = new ResourceManager();
		//this.webglState = new WebglState();

		this.renderStats = new RenderStats();
		this.renderStatsElement = undefined;

		this.requestId = undefined;
		this.continueAnimation = true;

		this.onContextMount = this.onContextMount.bind(this);
		this.onContextUnmount = this.onContextUnmount.bind(this);
		this.onContextLost = this.onContextLost.bind(this);
		this.onContextRestored = this.onContextRestored.bind(this);

		this.requestRender = this.requestRender.bind(this);
		this.cancelRender = this.cancelRender.bind(this);
		this.animationFrameCallback = this.animationFrameCallback.bind(this);
		this.updateRenderStats = this.updateRenderStats.bind(this);

		return;
	}

	onContextMount(in_webglContext){
		//console.log("WebglApp.onContextMount");
		this.localContext = new Context(in_webglContext, this.props.requestExtentionArray);
		this.requestRender();
		this.props.onStart(this.localContext);
	}
	onContextUnmount(){
		//console.log("WebglApp.onContextUnmount");
		if (undefined !== this.localContext){
			this.localContext.destructor();
			this.localContext = undefined;
		}
		this.cancelRender();
	}
	onContextLost(){
		//console.log("WebglApp.onContextLost");
		this.cancelRender();
		if (undefined !== this.localContext){
			this.localContext.onContextLost();
		}
	}
	onContextRestored(in_webglContext){
		//console.log("WebglApp.onContextRestored");
		if (undefined !== this.localContext){
			this.localContext.onContextRestored(in_webglContext);
		}
		this.requestRender();
	}

	requestRender(){
		this.requestId = requestAnimationFrame(this.animationFrameCallback);
	}
	cancelRender(){
		cancelAnimationFrame(this.requestId);
		this.requestId = undefined;

		this.renderStats.stopRender();
		this.updateRenderStats();
	}

	//in_timestamp is milliseconds from https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
	animationFrameCallback(in_timestamp){
		//console.log("WebglApp.animationFrameCallback in_timestamp:" + in_timestamp + "this.localContext:" + this.localContext.key + " key:" + this.key + " context:" + this.localContext);

		this.renderStats.newFrame(in_timestamp);
		this.updateRenderStats();

		if (false === this.continueAnimation){
			return;
		}

		const updateResult = this.props.onUpdate(this.localContext, in_timestamp);
		if (true !== updateResult){
			this.continueAnimation = false;
		}

		if (true === this.continueAnimation){
			this.requestRender();
		} else {
			this.updateRenderStats();
		}

		return;
	}

	// since we are rendering/ animating the webgl canvas OUTSIDE the react render loop, we also update the innerText of element to update stats
	// this is in part to avoid having the webgl canvas recreated (even though react doesn't recreate dom nodes if there are no changes required?)
	updateRenderStats(){
		if (this.renderStatsElement === undefined){
			return;
		}
		this.renderStatsElement.innerHTML = "fps:" + this.renderStats.getFps() + " frame:" + this.renderStats.getFrame() + " running:" + this.continueAnimation;
	}

	shouldComponentUpdate(in_nextProps, in_nextState) {
		return false;
	}

	render() {
		//console.log("WebglApp.render");
		const that = this;
		return React.createElement("div", null,
			React.createElement(WebglCanvas, {
				width: this.props.width, 
				height: this.props.height,
				onContextMount: this.onContextMount,
				onContextUnmount: this.onContextMount,
				onContextLost: this.onContextLost,
				onContextRestored: this.onContextRestored,
			}),
			React.createElement("div", { ref: function(in_element){ that.renderStatsElement = in_element; }}, "renderstats"),
			React.createElement("button", {"onClick": function(in_event){ that.continueAnimation = false; that.updateRenderStats(); }, "style":{"backgroundColor":"#888","border":"solid"}}, "stop anim loop"),
			React.createElement("div", null, this.props.version)
		);
	}
}

//https://www.npmjs.com/package/prop-types
WebglApp.propTypes = {
	//props passed into the canvas html element
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	requestExtentionArray: PropTypes.arrayOf(PropTypes.string),

	//class interface. this is a lot of paramaters, if we end up needing to pass more, put them all in a object?
	onStart: PropTypes.func.isRequired, //(in_context)
	onUpdate: PropTypes.func.isRequired, //(in_context, in_timestamp)

}