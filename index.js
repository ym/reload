var watch = require('watch'),
    color = require('cli-color'),
    spawn = require('child_process').spawn;

var server = undefined,
    excludes = [],
    watchPath = '',
    runProgram = '',
    running = false,
    runArgument = [];

function log(message) {
	console.log(new Date() + ' - ' + message);
}

function restartServer() {
	if(server == undefined) {
		server = spawn(runProgram, runArgument);

		server.stdout.on('data', function (data) {
			log((data + '').trim());
		});

		server.stderr.on('data', function (data) {
			console.log('Error: ' + data);
		});

		server.on('exit', function (code) {
			log(color.white('Process exited with code ' + code + '.'));
		});
	} else {
		server.kill();

		server = undefined;

		restartServer();

		log(color.cyan('Restarting Server ...'));
	}
}

function processChange(file, type) {
	if(excludes.length > 1) {
		for (var i = excludes.length - 1; i >= 0; i--) {
			if(file.match(excludes[i])) {
				log(color.cyan('File "' + file + '" excluded by rule "' + excludes[i] + '".'));
				return ;
			}
	}

	switch(type) {
		case 'create':
			log(color.green('File "' + file + '" created.'));
			break;
		case 'remove':
			log(color.red('File "' + file + '" removed.'));
			break;
		case 'change':
			log(color.yellow('File "' + file + '" changed.'));
			break;
		default:
	}

	restartServer();
}

function run() {
	if(running) {
		throw new Error("You can't call autoreload.run twice.");
		return false;
	}

	running = true;

	watch.watchTree(watchPath, function (f, curr, prev) {
		if (typeof f == "object" && prev === null && curr === null) {
		} else if (prev === null) {
			processChange(f, 'create');
		} else if (curr.nlink === 0) {
			processChange(f, 'remove');
		} else {
			processChange(f, 'change');
		}
	});

	log(color.cyan('Starting Server ...'));
	restartServer();
}

exports.exclude = function(expr) {
	if(excludes.indexOf(expr) !== -1) {
		return false;
	}

	excludes.push(expr);
	return true;
}

exports.setServer = function(prog, args) {
	runProgram = prog;
	runArgument = typeof args == 'string' ? [args] : args;
	return true;
}

exports.setPath = function(path) {
	watchPath = path;
	return true;
}

exports.run = function() {
	if(runProgram != '' && watchPath != '') {
		run();
	} else {
		throw new Error('Missing arguments.');
	}
}
