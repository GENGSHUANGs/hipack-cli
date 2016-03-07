'use strict';

const colors = require('colors'),
    commander = require('commander'),
    spawn = require('child_process').spawn,
    sys = require('sys'),
    fs = require('fs'),
    path = require('path');

global._hipack_npm_command = process.platform === 'win32' ? 'npm.cmd' : 'cmd';

const ensureRuntimeAvailable = function(rt, callback) {
    if (rt.exists()) {
        callback();
        return;
    }

    rt.download(rt.install.bind(rt, callback));
};

const ensureSpaceRunnable = function(cwd,space,runtime,callback){
    space.isEmpty(function(empty){
        if(!empty){
            callback();
            return ;
        }

        space.init(cwd,runtime,space.install.bind(space,callback));
    });
};

commander
    .option('start [dir] [--verbose]', 'start the develope server ')
    .option('build [dir] [--release]', 'build the resource')
    .option('--install', 'with install the dependencies')
    .option('--verbose', 'show the detail info')
    .option('--release', 'build the production resource')
    .parse(process.argv);

if (commander.start) {
    let cwd = Object.prototype.toString.call(commander.start) === '[object Boolean]' ? process.cwd() : commander.start;
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

        ensureSpaceRunnable(cwd,space,rt,err => {
            if(err){
                throw err;
            }

            var next = function(callback){
                callback();
            };
            if(commander.install){
                next = rt.run.bind(rt,space,global._hipack_npm_command,['install','--registry=https://registry.npm.taobao.org']);
            }
            next(()=>{
                rt.run(space, global._hipack_npm_command, ['start','--', ...(commander.verbose ? ['--verbose'] : [])]);
            });
        });
    });
    return;
}

if (commander.build) {
    let cwd = Object.prototype.toString.call(commander.build) === '[object Boolean]' ? process.cwd() : commander.build;
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
        if(commander.install){
        	next = rt.run.bind(rt,space,global._hipack_npm_command,['install','--registry=https://registry.npm.taobao.org']);
        }
        next(()=>{
			rt.run(space, global._hipack_npm_command, ['run','build','--', ...(commander.release ? ['--release'] : [])]);
        });
    });
    return;
}

console.log(colors.green('hipack --help for more info'));
