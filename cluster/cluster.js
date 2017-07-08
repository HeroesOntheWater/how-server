var cluster = require('cluster');
var bodyParser = require('body-parser');

if(cluster.isMaster){
    var app = require('express')();
    app.use(bodyParser.json());

    var numCPUs = require('os').cpus().length;
    console.log(numCPUs);

    //for(var i = 0; i < 1; i++){
    //   var worker = cluster.fork();
    //   worker.on('message', function(message){ console.log(message)});
    //}

    app.all('/*', function(req, res) {
        console.log(req.body.command_set);
        var worker = cluster.fork();
        for(var wid in cluster.workers){
            cluster.workers[wid].send({message:req.body});
        }
        res.send('process ' + process.pid + ' says hello!').end();
    });

    var port = 1111;
    var server = app.listen(port, function(){
        console.log('Master ' + process.pid + ' is listening on port ' + port);
    });

    //for(var wid in cluster.workers){
    //    cluster.workers[wid].send({github_link:"", local_path:"", command_set:"", app_name:"./testapp"});
   // }

    cluster.on('online', function(worker){ console.log('Worker ' + worker.process.pid + ' is online'); } );

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else{
    process.on('message', function(msg) {
        console.log(msg);
        console.log(msg.message.command_set);
        if(msg.message.command_set == "run"){
            var app = require(msg.message.app_name);
            app.runny();
            process.send(msg);
        }
        if(msg.message.command_set == "kill"){
            process.kill(process.pid, 'SIGHUP');
        }
    });
}
