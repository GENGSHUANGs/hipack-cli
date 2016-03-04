var fs = require('fs'),colors = require('colors'),spawn = require('child_process').spawn;

module.exports = function(dir){
	return new Space(dir);
};

var Space = module.exports.Space = function(dir){
	this.dir = dir;
};

Space.prototype.version = function(){
	// TODO
};

Space.prototype.info = function(){
	// TODO
};

Space.prototype.init = function(version){
	// TODO
};

