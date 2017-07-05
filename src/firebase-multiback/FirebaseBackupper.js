'use strict'
const fs = require('fs');
const cron = require('cron');
const moment = require('moment');
const request = require('request');

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

  // func(firebase_endpoint, secret_key, output_name)
  makeBackup(config, fbRef){
    let pathName = "";
    let url = "";
    if(Object.keys(config).length === 0){
      console.log('Not enough arguments in '+ fbRef+"\'s config");
      return;
    }

    pathName = (config.hasOwnProperty('output_name'))?config['output_name']:fbRef;
    url = `https://${fbRef}.firebaseio.com/.json?format=export&auth=${config['secret_key']}`;
    request(url, (err, resp, body)=>{
      console.log(body);
    })

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

      let cron_value = (this.yaml[me].hasOwnProperty('interval'))? this.yaml[me]['interval'] : this.backupInterval;

      // //run cronjobs
      // hi.push(new cron.CronJob(cron_value, ()=>{ //arrow function is important here due to usage of the this keyword
        this.makeBackup(this.yaml[me], me);
      // },
      // null,
      // true, //true says to run the job immediately
      // null // Timezone: null tells the library to take timezone of node server
      // ));


    }
    return hi;
  }

  get printYaml ()  {console.log(this.yaml);}
}

module.exports = FirebaseBackupper;