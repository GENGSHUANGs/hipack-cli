var path = require('path'),fs = require('fs');
var del = require('del');
var request = require('request');
var unzip = require('unzip');
var colors = require('colors');
var progress = require('progress-stream');

var str = progress({
	time: 10
});

str.on('progress', function(progress) {
});

var tempDir = path.join(process.cwd(),'./');
del([tempDir + '/**']);

var url = process.argv[2];
console.log(colors.green.underline(url));

request.get(url)
.pipe(str)
.pipe(unzip.Parse()).on('entry',function(entry){
	var dist = path.join(tempDir,entry.path.substring(entry.path.indexOf('/')));
	console.log(colors.underline(dist));
	if(entry.type === 'Directory'){
		if(!fs.existsSync(dist)){
			fs.mkdirSync(dist);
		}
		entry.autodrain();
		return ;
	}
	entry.pipe(fs.createWriteStream(dist));
});
