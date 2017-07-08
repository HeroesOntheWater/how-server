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

      var path = './backups/herosonthewatertest2/';
      var begin = req.query.fromDate;
      var end = req.query.toDate;
      var returned_arr = [];
      var file_names = fs.readdirSync(path);

      if(typeof begin == 'undefined' && typeof end != 'undefined'){

        var index = 0;
        while(index < file_names.length && parseInt(file_names[index].substring(0, file_names[index].length-5)) <= end){
          index++;
        }
        returned_arr = file_names.splice(0, index);

      } else if (typeof begin != 'undefined' && typeof end == 'undefined'){

        var index = file_names.length - 1;
        while(index > 0 && parseInt(file_names[index].substring(0, file_names[index].length-5)) > begin){
          index--;
        }
        returned_arr = file_names.splice(index, file_names.length - index);

      } else {

        var beginIndex = 0;
        while(beginIndex < file_names.length && parseInt(file_names[beginIndex].substring(0, file_names[beginIndex].length-5)) < begin){
          beginIndex++;
        }

        var endIndex = file_names.length - 1;
        while(endIndex > 0 && parseInt(file_names[endIndex].substring(0, file_names[endIndex].length-5)) > end){
          endIndex--;
        }

        returned_arr = file_names.splice(beginIndex, endIndex - beginIndex + 1);
      }

      for(var i = 0; i < returned_arr.length; i++){
        returned_arr[i] = returned_arr[i].substring(0, returned_arr[i].length - 5);
      }

      res.send(returned_arr);
    });

    app.listen(8080, function() {
      console.log('listening on 8080');
    });

} catch (e) {
    console.log(e);
}
