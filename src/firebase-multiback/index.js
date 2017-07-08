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

    app.get('/backup', function(req, res){

      var path = './backups/' + req.query.path;
      var begin = req.query.fromDate || '';
      var end = req.query.toDate || '';
      var returned_arr = [];
      var timestamp;
      var file_names_arr = fs.readdirSync(path);
      var fileName;

      for(var i = 0; i < file_names_arr.length; i++){
        fileName = file_names_arr[i];
        timestamp = parseInt(fileName.substring(0, fileName.length-5));

        // check if timestamp is within the range specified
        if (timestamp >= begin && (timestamp <= end || end == '')){
          returned_arr.push(timestamp);
        }

        // break loop if timestamp exceeds end specified
        if(timestamp > end && end != ''){
          break;
        }
      }

      res.send(returned_arr);
    });

    app.listen(8080, function() {
      console.log('listening on 8080');
    });

} catch (e) {
    console.log(e);
}
