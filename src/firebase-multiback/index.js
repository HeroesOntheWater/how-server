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

    app.get('/get', function(req, res){

      var path = './backups/herosonthewatertest2/';
      var begin = req.query.fromDate;
      var end = req.query.toDate;
      var returned_arr = [];
      var file_names = fs.readdirSync(path);

      if(typeof begin == 'undefined' && typeof end != 'undefined'){
        var index = 0;
        while(index < file_names.length && parseInt(file_names[index].substring(0,file_names[index].length-5)) < end){
          index++;
        }
        returned_arr = file_names.splice(0, index);
      } else if (typeof begin != 'undefined' && typeof end == 'undefined'){
        console.log("to end");
      } else {
        returned_arr = file_names.filter(function(name){
          name = name.substring(0, name.length - 5);
          return parseInt(name) > begin && parseInt(name) < end;
        });
      }
      
      res.send(returned_arr);
    });

    app.listen(8080, function() {
      console.log('listening on 8080');
    });

} catch (e) {
    console.log(e);
}
