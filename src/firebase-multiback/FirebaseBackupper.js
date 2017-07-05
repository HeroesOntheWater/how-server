'use strict'
const fs = require('fs');
const cron = require('cron');

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

    if(this.yaml['General'])
    {
      this.overrideGeneral();
      delete this.yaml['General'];
    }
    
    var hi = [];
    for(let me in this.yaml){

      //The secret_key is a required field. 
      //If not supplied, this key should be skipped.
      try{
        this.yaml[me].hasOwnProperty('secret_key');
      }catch(err){
        console.log("The secret key is a required field. skipping config " + me + "...");
        continue;
      }

      let temp_interval = (this.yaml[me].hasOwnProperty('interval'))? this.yaml[me]['interval'] : this.backupInterval;

      //run cronjobs
      hi.push(new cron.CronJob(temp_interval, ()=>{
        console.log('inside cron job');
      },
      null,
      true, //true says to run the job immediately
      null // Timezone: null tells the library to take timezone of node server
      ));


    }
    console.log(hi);
  }

  // func(firebase_endpoint, secret_key, output_name)

  get printYaml ()  {console.log(this.yaml);}
}

module.exports = FirebaseBackupper;