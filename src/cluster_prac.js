// console.log(require('../folder-1').saysmom);

var cluster = require('cluster'),
	factorial = function factorial(num) {
		if(num === 1 || num === 0) return 1;
		else return num * factorial(num-1);
	};
console.log('thaddeus madison');
if(cluster.isMaster) {
	var numWorkers = require('os').cpus().length+ 10;

	console.log('Master cluster setting up ' + numWorkers + ' workers...');

	for(var i = 0; i < numWorkers; i++) {
		var worker = cluster.fork();
		worker.on('message', function(message) {
			console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result);
		});
	}

	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	for(var wid in cluster.workers) {
    console.log('thad2')
		cluster.workers[wid].send({
			type: 'factorial',
			from: 'master',
			data: {
				number: Math.floor(Math.random() * 50)
			}
		});
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
		console.log('Starting a new worker');
		var worker = cluster.fork();
		worker.on('message', function(message) {
			console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result);
		});
	});
} else {
	process.on('message', function(message) {
		if(message.type === 'factorial') {
			process.send({
				type:'factorial',
				from: 'Worker ' + process.pid,
				data: {
					number: message.data.number,
					result: factorial(message.data.number)
				}
			});
		}
	});
}
