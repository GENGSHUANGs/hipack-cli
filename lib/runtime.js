'use strict';

const path = require('path'),
    fs = require('fs'),
    del = require('del'),
    request = require('request'),
    unzip = require('unzip'),
    colors = require('colors'),
    fse = require('fs-extra'),
    spawn = require('child_process').spawn;

const base = module.exports.base = path.join((process.env.HOME || process.env.USERPROFILE), '.hipack-runtime/');

module.exports = (version, url) => {
    return new Runtime(version, url);
};

const Runtime = module.exports.Runtime = class Runtime {
    constructor(version, url) {
        this.version = version;
        this.url = url ? url : version !== 'lastest' ? `https://github.com/GENGSHUANGs/hipack/archive/${version}.zip` : 'https://github.com/GENGSHUANGs/hipack/archive/master.zip';
        this.dist = path.join(base, version);
    }

    exists() {
        return fs.existsSync(this.dist);
    }

    download(callback) {
        fse.emptyDirSync(this.dist);

        console.log('fetch:', colors.green(this.url));
        var self = this;
        request.get(this.url).pipe(unzip.Parse()).on('entry', entry => {
            var _dist = path.join(self.dist, entry.path.substring(entry.path.indexOf('/')));
            if (entry.type === 'Directory') {
                fse.mkdirsSync(_dist);
                entry.autodrain();
                return;
            }
            console.log('entry:', _dist)
            entry.pipe(fs.createWriteStream(_dist));
        }).on('finish', callback);
    }

    install(callback) {
        var proc = spawn('npm', ['install', '--registry=https://registry.npm.taobao.org'], {
            cwd: this.dist,
            stdio: 'inherit',
        });
        proc.on('exit', (code, signal) => {
            (callback || function(){})();
        });
    }

    run(space, cmd, args, callback) {
        args = [].concat(args || []).concat(['--cwd',space.dir]);
        console.log(colors.green.underline('RUN COMMAND:'), colors.green(cmd), colors.green(args.join(' ')));
        var proc = spawn(cmd, args, { cwd: this.dist, stdio: 'inherit' });
        proc.on('close',callback || function(){});
    }
}
