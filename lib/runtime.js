var path = require('path'),fs = require('fs'),del = require('del'),request = require('request'),unzip = require('unzip'),colors = require('colors'),fse = require('fs-extra'),EventEmitter = require('events').EventEmitter,spawn = require('child_process').spawn;

var dir = module.exports.dir = path.join(__dirname,'../rt/');

module.exports = function(version,url){
	return new Runtime(version,url);
};

var Runtime = module.exports.Runtime = function(version,url){
	this.version = version ;
	this.url = url ? url : version !== 'lastest' ? 'https://github.com/GENGSHUANGs/hipack/archive/' + version + '.zip' : 'https://github.com/GENGSHUANGs/hipack/archive/master.zip'; ;
	this.dist = path.join(dir,version);
	EventEmitter.call(this);
};

Runtime.prototype.exists = function(){
	return fs.existsSync(this.dist);
};

Runtime.prototype.download = function(callback){
	fse.emptyDirSync(this.dist);
	
	console.log('fetch:',colors.green(this.url));
	var self = this;
	request.get(this.url).pipe(unzip.Parse()).on('entry',function(entry){
		var _dist = path.join(self.dist,entry.path.substring(entry.path.indexOf('/')));
		if(entry.type === 'Directory'){
			fse.mkdirsSync(_dist);
			entry.autodrain();
			return ;
		}
		console.log('entry:',_dist)
		entry.pipe(fs.createWriteStream(_dist));
	}).on('finish',callback);
};

Runtime.prototype.install = function(callback){
	var proc = spawn('npm',['install','--registry=https://registry.npm.taobao.org'],{
		cwd:this.dist,
		stdio:'inherit',
	});
	proc.on('exit',function(code,signal){
		(callback || function(err){})(code ? undefined : new Error(signal));
	});
};

Runtime.prototype.run = function(space,cmd,args){
	args = [].concat(args || []);
	console.log(colors.green.underline('RUN COMMAND:'),colors.green(cmd),colors.green(args.join(' ')));
	spawn(cmd,args,{cwd:space.cwd,stdio:'inherit'});
};