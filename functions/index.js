require('date-utils');
require('dotenv').config();
const fileconfig = process.env;
const crypto = require('crypto');
const functions = require('firebase-functions');
const firebase = require('firebase');
const config = {
    apiKey            : fileconfig.apiKey           ,
    authDomain        : fileconfig.authDomain       ,
    databaseURL       : fileconfig.databaseURL      ,
    projectId         : fileconfig.projectId        ,
    storageBucket     : fileconfig.storageBucket    ,
    messagingSenderId : fileconfig.messagingSenderId
  };
firebase.initializeApp(config);

/**
 * String to MD5
 * @param {string} str 
 */
function md5hex(str /*: string */) {
    const md5 = crypto.createHash('md5')
    return md5.update(str, 'binary').digest('hex')
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.gitlabautopull = functions.https.onRequest((request, response) => {
    var body = request.body;
    console.log("Requert Body: ",body);
    if(!body || Object.keys(body).length === 0){
        response.status(403).send("{code:403}");
        return;
    }

    var dt = new Date();
    var nowtime = dt.toFormat("YYYYMMDDHH24MISS");

    //Get Gitlab Push infomation
    var obj = {
        "branch": body.ref,
        "is_push": true,
        "project_name": body.repository.name,
        "git_url":body.repository.git_http_url,
        "user":body.user_name,
        "upload_date":nowtime
    };
    
    var branchname = md5hex(obj.branch);
    firebase.database().ref('project_state').child(obj.project_name).child(branchname).set(obj);

    var firebasekey = firebase.database().ref('history').push().key;
    firebase.database().ref('history').child(firebasekey).set(obj);

    console.log("Sucssce Obj:",obj);
    response.status(200).send("{code:200}");
});

