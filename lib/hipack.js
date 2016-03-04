var colors = require('colors');
var program = require('commander');
var cp = require('child_process')
var sys = require('sys');
var fs = require('fs');
var path = require('path');

var cwd = process.cwd();

program
    .version('0.0.1')
    .option('-i, --init [release]', '初始化；如果指定release，则下载相应的版本，参考：https://github.com/GENGSHUANGs/hipack/releases；否则下载最新版本')
    .option('-d, --dev [dir]', '启动开发模式')
    .option('-v, --verbose','详细信息')
    .option('-r, --release', '发布部署版本')
    .parse(process.argv);

if(program.init){
	var version = Object.prototype.toString.call(program.init) === '[object Boolean]' ? 'lastest' : program.init;
	var rt = require('./runtime.js')(version);
	rt.download(rt.install.bind(rt,function(err){
		if(err){
			throw err;
		}

		console.log('初始化完成！');
	}));
	return ;
}

if(program.dev){
	var cwd = Object.prototype.toString.call(program.dev) === '[object Boolean]' ? process.cwd : program.dev;
	var space = require('./space.js')(cwd);
	/*
	if(!space.version()){
		console.log('not inited ,hipack -h or hipack --help for help')
		return ;
	}*/

	var rt = require('./runtime.js')(space.version);
	checkRuntime(rt,function(err){
		if(err){
			throw err;
		}

		rt.run(space,'npm',['start','--','--cwd',cwd]);
	});
	return ;
}

var checkRuntime = function(rt,callback){
	if(rt.exists()){
		callback();
		return ;
	}

	rt.download(rt.install.bind(rt,callback));
};

if(program.release){
	var proc = cp.spawn('npm',['run','build','--','--release'],{
		stdio:'inherit'
	});
	return ;
}

console.log('使用：hipack -h 获取命令帮助');
