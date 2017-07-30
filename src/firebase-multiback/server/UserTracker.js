const yaml = require('js-yaml');
const fs = require('fs');
const firebase = require('firebase');
const jwt = require('jsonwebtoken');
const secret = require(`${__dirname}/secret.js`);

class UserTracker{

  constructor(email, password){
    //variable definitions (just here for readability)
    Object.assign(this, this.userTrackerDefault());
    //end variable definitions
    if(email || password)
    {
      this.user = {};
      this.user['email'] = email;
      this.user['password'] = password;
    }
    this.fb_refs = [];
    this.firebase_spec = yaml.safeLoad(fs.readFileSync('./uploads/prac.yaml', 'utf-8'));
    if (this.firebase_spec['General'])
          delete this.firebase_spec['General'];

    this.fb_keys = Object.keys(this.firebase_spec);
    if(this.fb_keys.length ==0) return;

  }

  userTrackerDefault(){
    if(this.fb_refs)this.fb_refs.forEach((fb_ref)=>fb_ref.delete());
    return {
      user: null,
      fb_refs: null,
      firebase_spec: null,
      fb_keys:null
    }
  }

  trySignIntoAllFirebases(idx, resp){
    let db_name = this.fb_keys[idx];
    let db_obj = this.firebase_spec[db_name];
    var db_config = {
          apiKey: db_obj.apiKey,
          authDomain: `${db_name}.firebaseapp.com`,
          databaseURL: `https://${db_name}.firebaseio.com`,
          projectId: db_name
      };

      this.fb_refs.push(firebase.initializeApp(db_config, 'fb_ref'+idx.toString()));

    this.signIn(idx)
        .then((data)=>{
          switch(data['type']){
            case 'ERROR':
              if(idx === this.fb_keys.length-1){
                Object.assign(this, this.userTrackerDefault());
                resp.send({type: 'ERROR', data: data});
              }
              else this.trySignIntoAllFirebases(++idx, resp);
            break;
            case 'SUCCESS':
              Object.assign(this, this.userTrackerDefault());
              const firebaseSpec = yaml.safeLoad(fs.readFileSync('./uploads/prac.yaml', 'utf-8'));
              const FirebaseBackupper = require('./FirebaseBackupper.js');
              const f_instance = new FirebaseBackupper(firebaseSpec, "* * * * *");
              resp.send({type: 'SUCCESS', data: jwt.sign(secret.payload, secret.key)});
          }
        })

  }

  signIn(idx){

    try{
    // Signs in existing user into the application, requires valid email and password.
    return this.fb_refs[idx].auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        .then((data)=> { //these need to be arrow function or the console log below will throw an error
            console.log('success : ' + this.fb_refs[idx].auth().currentUser.email + ' signed In');
            return {
                type: 'SUCCESS'
            };
        })
        .catch((error)=> {//this catch catches if the user has bad credentials
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('ERROR user_invalid: ' + error.code + ': ' + error.message);
            return {
                type: 'ERROR',
                code: error.code,
                message: error.message
            };
        });
    }catch(error){ //this catch catches if the firebase config is invalid
      var errorCode = error.code;
            var errorMessage = error.message;
            console.log('ERROR app_invalid: ' + error.code + ': ' + error.message);
            return {
                type: 'ERROR',
                code: error.code,
                message: error.message
            };
    }
  }


}

module.exports = UserTracker
