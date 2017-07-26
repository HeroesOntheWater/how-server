const yaml = require('js-yaml');
const fs = require('fs');
const express = require('express');
const UserTracker = require('./UserTracker.js');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname); //+ '-' + Date.now())
  }
})
const upload = multer({ storage: storage }); //global config for multer 

//Get document, or throw exception on error
class BackupApi {

    static getBackups() {
        try {
            const firebaseSpec = yaml.safeLoad(fs.readFileSync('./src/firebase-multiback/server/prac.yaml', 'utf-8'));
            const FirebaseBackupper = require('./FirebaseBackupper.js');
            var f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");

            app.use(cors());

            //verify tokens
            app.use((req, res, next)=>{
              if(req.path.includes('login') 
                || req.path.includes('uploadConfig')){
                next();
                return;
              }
              jwt.verify(req.query.token, secret.key, function(err, decoded) {
                if(err) {
                  return res.status(404).send('This page does not exist. Down for maintenance');
                }
                next();
              });
            })

            app.post('/uploadConfig', upload.single('prac.yaml'), (req, res, next)=>{

              res.send(req.file);
            })

            app.get('/hasConfig', (req, res)=>{

            })

            app.get('/login', function(req, res) {
              let u = new UserTracker(req.query.email, req.query.password);
              return u.trySignIntoAllFirebases(0, res);

            });

            app.get('/', (req, res)=>{
              res.send('hello world');
            })

            app.get('/backup', (req, res)=>{

                // retrieval of correct timestamps
                var returned_arr = [];
                var fileName, timestamp;

                // query parameters
                var path = './backups/' + req.query.app  +  '/' + req.query.version;
                var file_names_arr = fs.readdirSync(path);
                var begin = req.query.fromDate || '';
                var end = req.query.toDate || '';

                // neither begin or end parameter given --> return last 50
                if (begin == '' && end == '') {

                    var index = 0;
                    // check if more than 50 backups exist
                    if (file_names_arr.length >= 50) {
                        index = file_names_arr.length - 50;
                    }

                    for (var i = index; i < file_names_arr.length; i++) {
                        fileName = file_names_arr[i];
                        timestamp = parseInt(fileName.substring(0, fileName.length - 5));
                        returned_arr.push(timestamp);
                    }
                } else {

                    // set begin to first timestamp if none is given
                    if (begin == '') {
                        begin = parseInt(file_names_arr[0].substring(0, file_names_arr[0].length - 5));
                    }

                    for (var i = 0; i < file_names_arr.length; i++) {
                        fileName = file_names_arr[i];
                        timestamp = parseInt(fileName.substring(0, fileName.length - 5));

                        // check if timestamp is within the range specified
                        if (timestamp >= begin && (timestamp <= end || end == '')) {
                            returned_arr.push(timestamp);
                        }

                        // break loop if timestamp exceeds end specified
                        if (timestamp > end && end != '') {
                            break;
                        }
                    }
                }

                res.send(returned_arr);
            });

            // download file from given timestamp
            app.get('/backup/download', (req, res)=>{
                var timestamp = req.query.timestamp;
                var app = req.query.app;
                var version = req.query.version || ''
                if(app == ''){
                  var path = './backups/' + app + '/' + timestamp + '.json';
                } else {
                  var path = './backups/' + app + '/' + version + '/' + timestamp + '.json';
                }
                res.download(path);
            });

            // return app names in backup folder
            app.get('/backup/apps', (req, res)=>{
              var path = "./backups";
              // gets array of everything in backups and filters for directories
              var directories = fs.readdirSync(path).filter(function(file){
                return fs.lstatSync(path + "/" + file).isDirectory();
              })

              res.send(directories);
            });

            // return versions in an app --> prints no versions if none exist
            app.get('/backup/versions', (req, res)=>{
              var app = req.query.app;
              var path = "./backups/" + app;
              var versions = fs.readdirSync(path).filter(function(file){
                return fs.lstatSync(path + "/" + file).isDirectory();
              });

              if(versions.length == 0){
                res.send("no versions");
              } else {
                res.send(versions);
              }
            });

            // get all files within an app
            app.get('/backup/app/all', (req, res)=>{
              var app = req.query.app;
              var path = "./backups/" + app;
              var timestamps = [];
              iterate(path, timestamps)

              // recursive --> if directory call again else add timestamp
              function iterate(path, timestamps){
                var files = fs.readdirSync(path);
                files.forEach(function(file){
                  if(fs.lstatSync(path + "/" + file).isDirectory()){
                    iterate(path + "/" + file, timestamps);
                  } else {
                    timestamps.push(file.substring(0, file.length - 5));
                  }
                })
              }

              res.send(timestamps);
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
