const yaml = require('js-yaml');
const fs = require('fs');
const express = require('express');
var app = express();

//Get document, or throw exception on error
try {
    const firebaseSpec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));
    const FirebaseBackupper = require('./FirebaseBackupper.js');
    var f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");

    app.get('/', function(req, res){
      res.send('Hello!');
    });

    app.get('/get', function(req, res){
      const backup = fs.readFileSync('./backups/herosonthewatertest2/1499305621154.json', 'utf-8');
      res.send(JSON.stringify(backup));
    });

    app.listen(8080, function() {
      console.log('listening on 8080');
    });

} catch (e) {
    console.log(e);
}
