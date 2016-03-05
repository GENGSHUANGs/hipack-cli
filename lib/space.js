'use strict';

const fs = require('fs'),colors = require('colors'),spawn = require('child_process').spawn;

module.exports = function(dir){
	return new Space(dir);
};

let Space = module.exports.Space = class Space{
	constructor(dir){
	this.dir = dir;
	};

	version(){
	return 'lastest';
	};

	info(){
	};

	init(version){
	};
}
