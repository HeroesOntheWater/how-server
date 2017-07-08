const yaml = require('js-yaml');
const fs = require('fs');
const express = require('express');
const app = express();

//Get document, or throw exception on error
class BackupApi {

  static getBackups() {
    try {
        const firebaseSpec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));
        const FirebaseBackupper = require('./FirebaseBackupper.js');
        var f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");

        app.get('/', function(req, res){
          res.send("hello");
        });

        app.get('/backup', function(req, res){

          // retrieval of correct timestamps
          var returned_arr = [];
          var fileName;
          var timestamp;

          // query parameters
          var path = './backups/' + req.query.path;
          var file_names_arr = fs.readdirSync(path);
          var begin = req.query.fromDate ||  parseInt(file_names_arr[0].substring(0, file_names_arr[0].length-5));
          var end = req.query.toDate || '';

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

          var options = {
            root : path
          }

          res.send(returned_arr);
        });

        app.get('/backup/download', function(req, res){
          var timestamp = req.query.timestamp;
          var path = './backups/herosonthewatertest2/' + timestamp + '.json';
          res.download(path);
        });

        app.listen(8080, function() {
          console.log('listening on 8080');
        });

    } catch (e) {
        console.log(e);
    }
  }

}

BackupApi.getBackups();
