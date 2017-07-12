const yaml = require('js-yaml');
const fs = require('fs');
const firebase = require('firebase');

class UserTracker{

  constructor(){
    this.firebase_spec = yaml.safeLoad(fs.readFileSync('./prac.yaml', 'utf-8'));
    if (this.firebase_spec['General']) 
          delete this.firebase_spec['General'];
    
    this.fb_keys = Object.keys(this.firebase_spec);
    if(this.fb_keys.length ==0) return;

    if(this.trySignIntoAllFirebases(0))//can sign-in, generate a jwt
    {
      console.log('im mister meeseeks!');
    }
    else{
      // reject the user
      console.log('rejected!');
      return;
    }
    
  }

  trySignIntoAllFirebases(idx){
    let db_name = this.fb_keys[idx];
    let db_obj = this.firebase_spec[db_name];
    var db_config = {
          apiKey: db_obj.apiKey,
          authDomain: `${db_name}.firebaseapp.com`,
          databaseURL: `https://${db_name}.firebaseio.com`,
          projectId: db_name
      };
    if(firebase.apps.length !== 0) {
      firebase.app().delete();
    }
    firebase.initializeApp(db_config);
    console.log('the indexes', idx,  this.fb_keys.length);
    this.signIn()
        .then((data)=>{
          switch(data['type']){
            case 'ERROR':
              if(idx === this.fb_keys.length-1)return false;
              else this.trySignIntoAllFirebases(idx++);
            break;
            case 'SUCCESS':
              return true;
          }
        })
    
  }

  signIn(user){
    try{
    // Signs in existing user into the application, requires valid email and password.
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(function(data) {
            console.log('success : ' + firebase.auth().currentUser.email + ' signed In');
            return {
                type: 'SUCCESS'
            };
        })
        .catch(function(error) {//this catch catches if the user has bad credentials
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('ERROR user_invalid: ' + error.code + ': ' + error.message);
            return {
                type: 'ERROR',
                code: error.code,
                message: error.message
            };
        });
    }catch(err){ //this catch catches if the firebase config is invalid
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

let me = new UserTracker();