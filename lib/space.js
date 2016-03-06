'use strict';

const fs = require('fs'),path = require('path'),
    colors = require('colors'),
    spawn = require('child_process').spawn,
    ncp = require('ncp').ncp;

module.exports = function(dir) {
    return new Space(dir);
};

let Space = module.exports.Space = class Space {
    constructor(dir) {
        this.dir = dir;
    };

    version() {
        return 'lastest';
    };

    isEmpty(callback) {
    	fs.readFile(path.join(this.dir,'./package.json'),(err,fd) => {
    		(callback || function(){})(err ? true : false);
    	});
    }

    init(cwd,runtime,callback) {
    	ncp(path.join(runtime.dist,'template/'),path.join(cwd,'./'),function(err){
    		if(err){
    			throw err;
    		}

    		callback();
    	});
    }

    install(callback){
        let proc = spawn('npm',['install','--registry=https://registry.npm.taobao.org'],{cwd:this.dir,stdio:'inherit'});
        proc.on('close',()=>{
            (callback || function(){})();
        });
    }
}
