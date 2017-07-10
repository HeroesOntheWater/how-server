var cluster = require('cluster');
var bodyParser = require('body-parser');

if(cluster.isMaster){
    var app = require('express')();
    app.use(bodyParser.json());

    var numCPUs = require('os').cpus().length;
    var worker_objects = {};

    app.post('/run', function(req, res){
        if(req.body.command_set == "run"){
            var worker = cluster.fork();
            worker_objects[worker.process.pid] = req.body.app_name;
            console.log(worker_objects);
            worker.send(req.body);
        }
        res.send('run').end();
    });

    app.delete('/kill/:pid', function(req, res){
        for(var wid in cluster.workers){
            if(cluster.workers[wid].process.pid == req.params.pid){
                delete worker_objects[req.params.pid];
                console.log(worker_objects);
                cluster.workers[wid].send({command_set:"kill"});
            }
        }
        res.send('delete').end();
    });

    app.get('/*', function(req, res) {
        res.send(worker_objects).end();
    });


    var port = 1111;
    var server = app.listen(port, function(){
        //console.log('Master ' + process.pid + ' is listening on port ' + port);
    });

    //cluster.on('online', function(worker){
        //console.log('Worker ' + worker.process.pid + ' is online');
    //});

    //cluster.on('exit', function(worker, code, signal) {
    //    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    //    console.log('Starting a new worker');
    //    //cluster.fork();
    //});
}
else {
    process.on('message', function(msg) {
        if(msg.command_set == "run"){
            var app = require(msg.app_name);
            app.runny();
            process.send(msg);
        }
        if(msg.command_set == "kill"){
            process.kill(process.pid, 'SIGHUP');
        }
    });
}
