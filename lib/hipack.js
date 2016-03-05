'use strict';

const colors = require('colors'),
    program = require('commander'),
    spawn = require('child_process').spawn,
    sys = require('sys'),
    fs = require('fs'),
    path = require('path');

let ensureRuntimeAvailable = function(rt, callback) {
    if (rt.exists()) {
        callback();
        return;
    }

    rt.download(rt.install.bind(rt, callback));
};

program
    .option('start [dir] [--verbose]', 'start the develope server ')
    .option('build [dir] [--release]', 'build the resource')
    .option('--install', 'with install the dependencies')
    .option('--verbose', 'show the detail info')
    .option('--release', 'build the production resource')
    .parse(process.argv);

if (program.start) {
    let cwd = Object.prototype.toString.call(program.start) === '[object Boolean]' ? process.cwd() : program.start;
    let space = require('./space.js')(cwd);

    if (!space.version()) {
        console.log('not inited ,hipack -h or hipack --help for help')
        return;
    }

    let rt = require('./runtime.js')(space.version());
    ensureRuntimeAvailable(rt, err => {
        if (err) {
            throw err;
        }

        var next = function(callback){
        	callback();
        };
        if(program.install){
        	next = rt.run.bind(rt,space,'npm',['install','--registry=https://registry.npm.taobao.org']);
        }
        next(()=>{
			rt.run(space, 'npm', ['start', ...(program.verbose ? ['--', '--verbose'] : [])]);
        });
    });
    return;
}

if (program.build) {
    let cwd = Object.prototype.toString.call(program.build) === '[object Boolean]' ? process.cwd() : program.build;
    let space = require('./space.js')(cwd);

    if (!space.version()) {
        console.log('not inited ,hipack -h or hipack --help for help')
        return;
    }

    let rt = require('./runtime.js')(space.version());
    ensureRuntimeAvailable(rt, err => {
        if (err) {
            throw err;
        }

        var next = function(callback){
        	callback();
        };
        if(program.install){
        	next = rt.run.bind(rt,space,'npm',['install','--registry=https://registry.npm.taobao.org']);
        }
        next(()=>{
			rt.run(space, 'npm', ['run','build', ...(program.release ? ['--', '--release'] : [])]);
        });
    });
    return;
}

console.log(colors.green('hipack --help for more info'));
