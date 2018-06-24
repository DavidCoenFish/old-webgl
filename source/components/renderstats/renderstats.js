import PropTypes from 'prop-types';
import React from "react";

export class RenderStats {
	constructor() {
		this.frame = 0;
		this.fps = RenderStats.sDefaultFps;
		this.lastTimestamp = undefined;
		return;
	}

	newFrame(in_timestamp){
		this.frame += 1;
		if (this.lastTimestamp !== undefined){
			const delta = in_timestamp - this.lastTimestamp;
			this.fps = (delta !== 0.0) ? ((1.0 / delta) * 1000).toFixed(1) : RenderStats.sDefaultFps;
		}
		this.lastTimestamp = in_timestamp;

		return;
	}

	stopRender(){
		this.fps = RenderStats.sDefaultFps;
		this.lastTimestamp = undefined;
		return;
	}

	getFrame(){
		return this.frame;
	}

	getFps(){
		return this.fps;
	}
}

RenderStats.sDefaultFps = "nan";
