const yaml = require('js-yaml');
const fs = require('fs');

//Get document, or throw exception on error
try {
    const firebaseSpec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));

    const FirebaseBackupper = require('./FirebaseBackupper.js');
    var f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");

} catch (e) {
    console.log(e);
}