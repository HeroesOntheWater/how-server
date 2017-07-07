
var cluster = require('cluster');

if(cluster.isMaster){
    var app = require('express')();

    var numCPUs = require('os').cpus().length;
    console.log(numCPUs);

    for(var i = 0; i < 1; i++){
       var worker = cluster.fork();
       worker.on('message', function(message){ console.log(message)});
    }

    app.all('/*', function(req, res) {
        console.log(req.body);
        for(var wid in cluster.workers){
            cluster.workers[wid].send({message:req.body});
        }
       res.send('process ' + process.pid + ' says hello!').end();
    });

    var port = 1111;
    var server = app.listen(port, function(){
        console.log('Master ' + process.pid + ' is listening on port ' + port);
    });

    for(var wid in cluster.workers){
        cluster.workers[wid].send({github_link:"", local_path:"", command_set:"", app_name:"./testapp"});
    }

    cluster.on('online', function(worker){ console.log('Worker ' + worker.process.pid + ' is online'); } );

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else{
    process.on('message', function(msg) {
        process.kill(process.pid, 'SIGHUP');
    //var app = require(msg.app_name);
    //    app.runny();
    //    process.send(msg);
    });
}
