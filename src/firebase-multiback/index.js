// console.log('hello world');

const yaml = require('js-yaml');
const fs = require('fs');

//Get document, or throw exception on error
try{
  const firebaseSpec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));
  console.log(firebaseSpec);

  var f = require('./FirebaseBackupper.js');
  var f_instance = new f(firebaseSpec, 10);
  // f_instance.getYaml();

} catch(e){
  console.log(e);
} 