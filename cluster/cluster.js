var cluster = require('cluster');
var bodyParser = require('body-parser');
var path = require('path');
var npm = require('npm');
var git = require('nodegit');

if(cluster.isMaster){
    var app = require('express')();
    app.use(bodyParser.json());

    var numCPUs = require('os').cpus().length;
    var worker_objects = {};

    app.post('/start', function(req, res){
        if(req.body["package_name"]){
            var worker = cluster.fork();
            worker_objects[worker.process.pid] = req.body.app_name;
            console.log(worker_objects);
            worker.send(req.body);
        }
        else{
            res.status(400).send("Did not provide any package name");
        }
    })

    app.post('/install', function(req, res){
        if(req.body["package_name"]){
            var worker = cluster.fork();
            worker_objects[worker.process.pid] = req.body.app_name;
            console.log(worker_objects);
            worker.send(req.body);
        }
        else{
            res.status(400).send("Did not provide any package name");
        }
    })

    app.post('/clone', function(req, res){
        if(req.body["github_link"]){
            var worker = cluster.fork();
            worker_objects[worker.process.pid] = req.body.app_name;
            console.log(worker_objects);
            worker.send(req.body);
        }
        else{
            res.status(400).send("Did not provide any github link");
        }

    });

    app.post('/clone-run', function(req, res){
        if(req.body["github_link"]){
            var worker = cluster.fork();
            worker_objects[worker.process.pid] = req.body.app_name;
            console.log(worker_objects);
            worker.send(req.body);
        }
        else{
            res.status(400).send("Did not provide any github link");
        }

    });
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
        if(req.params["pid"]){
            for(var wid in cluster.workers){
                if(cluster.workers[wid].process.pid == req.params.pid){
                    delete worker_objects[req.params.pid];
                    console.log(worker_objects);
                    cluster.workers[wid].send(req.body);
                }
            }
            res.send('delete').end();
        }
        else{
            res.status(400).send("Did not provide any pid");
        }
    });

    app.delete('/killAll', function(req, res){
        for(var wid in cluster.workers){
            delete worker_objects[cluster.workers[wid].process.pid];
            console.log(worker_objects)
            cluster.workers[wid].send(req.body);
        }
    });

    app.get('/*', function(req, res) {
        res.send(worker_objects).end();
    });


    var port = 1111;
    var server = app.listen(port, function(){
        console.log('Master ' + process.pid + ' is listening on port ' + port);
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
        switch(msg.command_set) {
            case "clone":
                git.Clone(msg.github_link, __dirname + msg.dest_name).catch(function(err){
                    console.log(err);
                }).then(function(repo){
                    console.log("complete!");
                    console.log(repo);
                });
                break;

            case "clone-run":
                git.Clone(msg.github_link, __dirname + msg.dest_name).catch(function(err){
                    console.log(err);
                }).then(function(repo){
                    console.log("complete!");
                    console.log(repo);

                    var app = require(path.resolve(__dirname + "/" + msg.local_path + msg.app_name));
                    app.runny();
                    process.send(msg);
                });
                break;

            case "start":
                process.chdir(msg.local_path)
                if(msg.package_name){
                    npm.load({verbose:true}, ()=>{
                         npm.commands.install((err)=>{
                             npm.commands.update((err)=>{
                                npm.commands.start((err)=>{
                                    process.chdir('../');
                                })
                             });
                         });
                    });
                }
                break;

            case "install":
                process.chdir(msg.local_path)
                if(msg.package_name){
                    npm.load({verbose:true}, ()=>{
                         npm.commands.install((err)=>{
                             npm.commands.update((err)=>{
                                process.chdir('../');
                             });
                         });
                    });
                }
                break;

            case "run":
                var app = require(path.resolve(__dirname + "/" + msg.local_path + msg.app_name));
                app.runny();
                process.send(msg);
                break;

            case "kill":
                process.kill(process.pid, 'SIGHUP');
                break;

            case "killAll":
                process.kill(process.pid, 'SIGHUP');
                break;

            default:
                break;
        }
    });
}

