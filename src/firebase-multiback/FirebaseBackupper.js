'use strict'
const fs = require('fs');

//get, set, and static are all available in classes.
class FirebaseBackupper{

  constructor(yaml, backupInterval){
    this.yaml = yaml;
    this.backupInterval = backupInterval;
    this.runner();
    
  }

  //the override general function
  overrideGeneral(){
    try{
      this.backupInterval = this.yaml['General']['interval'];
    }
    catch(err){
      //TODO: implement logger and log this information
      console.log('No general interval set. Moving on..');
    }
  }

  //the backup program's runner 
  runner(){
    this.overrideGeneral();
    console.log('just a test');
  }

  get printYaml ()  {console.log(this.yaml);}
}

module.exports = FirebaseBackupper;