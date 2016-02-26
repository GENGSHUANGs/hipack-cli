var colors = require('colors');
var program = require('commander');
var cp = require('child_process')
var sys = require('sys');
var fs = require('fs');
var path = require('path');

var cwd = process.cwd();

program
    .version('0.0.1')
    .option('-i, --init', '初始化')
    .option('-d, --dev', '启动开发模式')
    .option('-v, --verbose','详细信息')
    .option('-r, --release', '发布部署版本')
    .parse(process.argv);

var handleOutput = function(proc){
	proc.stdout.on('data', function (data) {
	    sys.print(colors.red('stdout:\t') + '' + data);
	});
	proc.stderr.on('data', function (data) {
	    sys.print(colors.red('stderr:\t') + '' + data);
	});
	proc.on('exit', function (code) {
	    // sys.print(colors.red('exit:\t') + code + '\r\n');
	});
};

if(program.init){
	// require('./initialize_space')();
	if(fs.existsSync(path.join(cwd,'./package.jsxon'))){
		console.log(colors.red.underline('HIPACK') + ':目录不为空，不能被初始化！');
		return ;
	}
	var proc = cp.spawn('node',[path.join(__dirname,'./initialize-space.js')]);
	handleOutput(proc);
	return ;

	console.log('');
	console.log(colors.red('   _   _ _______          _    '));
	console.log(colors.red('  | | | (_) ___ \\        | |   '));
	console.log(colors.red('  | |_| |_| |_/ /_ _  ___| | __'));
	console.log(colors.red('  |  _  | |  __/ _` |/ __| |/ /'));
	console.log(colors.red('  | | | | | | | (_| | (__|   < '));
	console.log(colors.red('  \\_| |_/_\\_|  \\__,_|\\___|_|\\_\\'));
	console.log('');
	console.log(colors.red.underline('HIPACK') + ':使用：hipack -h 获取命令帮助');

	return ;
}

if(program.dev){
	var proc = cp.spawn('npm',['start']);
	handleOutput(proc);
	return ;
}

if(program.release){
	var proc = cp.spawn('npm',['run','build','--','--release']);
	handleOutput(proc);
	return ;
}

console.log('使用：hipack -h 获取命令帮助');
