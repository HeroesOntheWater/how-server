'use strict'
const fs = require('fs');
const cron = require('cron');
const moment = require('moment');
const request = require('request');
const execSync = require('child_process').execSync;

//get, set, and static are all available in classes.
class FirebaseBackupper {

    constructor(yaml, backupInterval) {
        this.yaml = yaml;
        this.backupInterval = backupInterval;
        this.runner();

    }

    //the override general function
    overrideGeneral() {
        try {
            this.backupInterval = this.yaml['General']['interval'];
        } catch (err) {
            //TODO: implement logger and log this information
            console.log('No general interval set. Moving on..');
        }
    }

    // func(firebase_endpoint, secret_key, version)
    makeBackup(config, fb_db_name) {
        return new Promise((res, rej)=>{
          const pathPrefix = 'backups/';
          let path = "";
          let url = "";
          if (Object.keys(config).length === 0) {
              console.log('Not enough arguments in ' + fb_db_name + "\'s config");
              return;
          }

          path = (config.hasOwnProperty('version')) ? `${fb_db_name}/${config['version']}` : `${fb_db_name}/default`;
          path = pathPrefix + path;
          url = `https://${fb_db_name}.firebaseio.com/.json?format=export&auth=${config['secret_key']}`;
          request(url, (err, resp, body) => {
              if(JSON.parse(body).hasOwnProperty('error')){
                console.log('this wasnt a real backup');
                rej('stop');
                return;
              }
              if (this.preparePath(path)) {
                  let timestamp = new Date().getTime();
                  if (/^win/.test(process.platform)) { //windows patch
                      execSync('type NUL > ' + path + '/' + timestamp + '.json');

                  }

                  fs.writeFileSync(path + '/' + timestamp + '.json', body, {
                      flag: "w+"
                  });
                  res();
              } else {
                console.log("fail");
                rej();
              }
          })
        })
    }

    //preparePath would be "saveFile", but passing the body would be time consuming on large firebase dbs.
    preparePath(path) {
        if (fs.existsSync(path)) return true;

        let pathBuilder = '.';
        path.split('/')
            .forEach((v) => {
                pathBuilder += '/' + v;

                if (!fs.existsSync(pathBuilder)) {
                    fs.mkdirSync(pathBuilder);
                }
            });

        return true;
    }

    //the backup program's runner
    runner() {

        if (this.yaml['General']) {
            this.overrideGeneral();
            delete this.yaml['General'];
        }

        let mesy = {};
        for (let fb_db_ref in this.yaml) {

            //The secret_key is a required field.
            //If not supplied, this key should be skipped.
            try {
                this.yaml[fb_db_ref].hasOwnProperty('secret_key');
            } catch (err) {
                console.log("The secret key is a required field. skipping config " + fb_db_ref + "...");
                continue;
            }

            let fb_db_ref_interval = (this.yaml[fb_db_ref].hasOwnProperty('interval')) ? this.yaml[fb_db_ref]['interval'] : this.backupInterval;
            //run cronjobs
            mesy[fb_db_ref] = new cron.CronJob(fb_db_ref_interval, () => { //arrow function is important here due to usage of the this keyword*/

                    this.makeBackup(this.yaml[fb_db_ref], fb_db_ref)
                    .catch((data) =>{
                      if(data =="stop"){
                        mesy[fb_db_ref].stop(); //stop the cron job if it was a bad config
                      }
                    })
                 },
                null,
                true, //true says to run the job immediately
                null // Timezone: null tells the library to take timezone of node server
            );

        }
        return mesy;
    }

    get printYaml() { console.log(this.yaml); }
}

module.exports = FirebaseBackupper;
