require('dotenv').config();
const fileconfig = process.env;
const LineworksBot = require("./common/lineworksbot");
const lineworksBot = new LineworksBot();
const fs = require('fs');
const exec = require('child_process').exec;
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

var isFirstRun = true;
console.log("GitLab Auto Pull is running...");
exec("git config --global http.sslVerify false");

firebase.database().ref('project_state').orderByChild('is_push').equalTo(true).on('value',function(snip){
  
  if(isFirstRun){
    isFirstRun = false;
    return;
  }

  var dbObjs = snip.val();
  if(!dbObjs){
    return;
  }

  var firebasekey = Object.keys(dbObjs)[0];
  var gitlabObj   = dbObjs[firebasekey];
  var gitPath     = gitlabObj.git_url.replace("https://","");
  var branch      = gitlabObj.branch.replace("refs/heads/","");
  var projectPath = fileconfig.localForlderPath + gitlabObj.project_name + "/" + branch;

  //git pull or git clone
  var execCommand = ""
  if(fs.existsSync(projectPath) && fs.statSync(projectPath).isDirectory()){//git pull
    execCommand = "cd " + projectPath + " && git pull https://"+fileconfig.gitlabAccount +":"+fileconfig.gitlabPassword+"@"+ gitPath + " " +branch;
    console.log("Git Pull");
    console.log("Exec Command: ",execCommand);
  }
  else{//git clone
    exec("mkdir " + projectPath + " -p");
    execCommand = "git clone https://" +fileconfig.gitlabAccount +":"+fileconfig.gitlabPassword+"@"+ gitPath + " " +projectPath;
    console.log("Git Clone");
    console.log("Exec Command: ",execCommand);
  }
  exec(execCommand);
  
  //Change Firebase DataBase State
  firebase.database().ref('project_state').child(firebasekey).child('is_push').set(false);

  //Send Message to user by Lineworks
  firebase.database().ref('lineworks').once("value",snaponce =>{
    var lineworksObj = snaponce.val();
    if(!lineworksObj){
      return ;
    }

    var sendListObjs = lineworksObj.sendlist;

    var lineworksMsg="Azest GitLabにPushされました."+"\n\n"
                      +"Project Name: "+gitlabObj.project_name+"\n"
                      +"Branch: "+branch+"\n"
                      +"User: "+gitlabObj.user+"\n"
                      +"Message:\n"+gitlabObj.message+"\n"
                      +gitlabObj.git_url+"\n";
  
    for (const key in sendListObjs) {
      if (sendListObjs.hasOwnProperty(key)) {
        const element = sendListObjs[key];
        lineworksBot.sendMessage(lineworksObj.botnum,element,lineworksMsg);
      }
    }
  });



});