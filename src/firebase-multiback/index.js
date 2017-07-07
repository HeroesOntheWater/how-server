const yaml = require('js-yaml');
const fs = require('fs');
const express = require('express');
const app = express();

//Get document, or throw exception on error
try {
    const firebaseSpec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));
    const FirebaseBackupper = require('./FirebaseBackupper.js');
    var f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");

    app.get('/', function(req, res){
      res.send('Hello!');
    });

    app.get('/get/:begin/:end', function(req, res){
      var path = './backups/herosonthewatertest2/';
      var begin = req.params.begin;
      var end = req.params.end;
      var returned_arr = [];

      fs.readdir(path, function(err, file_names){
        returned_arr = file_names.filter(function(name){
          name = name.substring(0, name.length - 5);
          return parseInt(name) > begin && parseInt(name) < end;
        })
        
        res.send(returned_arr);
        //res.send(file_names[0].substring(0, file_names[0].length-5));

      })
    /*  var basePath = './backups/herosonthewatertest2/';
      var backupArr = [];
      for(var  i = 1499305621154; i < 1499305742411; i++) {
        path = basePath + i + ".json";
        if(fs.existsSync(path)){
          backupArr.push(path);
        }
      }
      res.send(backupArr);*/

      /*path = './backups/herosonthewatertest2/1499305621154.json';
      if(fs.existsSync(path)){
        res.download(path);
      } else {
        res.send('no path');
      }*/
      //const backup = fs.readFileSync('./backups/herosonthewatertest2/1499305621154.json', 'utf-8');
      //res.send(JSON.parse(backup));
    });

    app.listen(8080, function() {
      console.log('listening on 8080');
    });

} catch (e) {
    console.log(e);
}
