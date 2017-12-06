'use strict';
require('date-utils');
const request = require('request');
require('dotenv').config();
const config = process.env;

module.exports = function LineworksBot(){

  //ヘッダーを定義
  this.headers = {
    'Content-Type':'application/json; charset=UTF-8',
    'consumerKey':config.CONSUMER_KEY,
    'Authorization':'Bearer '+config.TOKEN
  };

  /**
   * 0.POST送信
   * @param apiUri /message/apiname
   * @param parmObj JSON Object (Line Request Parameter)
   */
  this.requestToLineworks = function(apiUri,parmObj){
    var api = 'https://apis.worksmobile.com/' + config.API_ID + apiUri;
    //オプションを定義
    var options = {
        url: api,
        method: 'POST',
        headers: this.headers,
        json: false,
        body: JSON.stringify(parmObj)
      }
  
      //リクエスト送信
      request(options, function (error, response, body) {
        var dt = new Date();
        var formatted = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

        console.log("**********************************");
        console.log("Time:",formatted);
        console.log("API:",apiUri);
        console.log("Response:\n",response.body);
        console.log("Error:\n",error);
        console.log("**********************************");
      })
  };

  /**
   * 1.トーク Bot の登録
   */
  this.registerBot = function(name,photoUrl){
    var apiUri = '/message/registerBot/v2';
    var bodyObj = {
        "name":name,
        "photoUrl":photoUrl,
        "status":1
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 2.トーク Bot の修正
   */
  this.updateBot = function(botNo,name,photoUrl,status){
    var apiUri = '/message/updateBot/v2';
    var bodyObj = {
        "botNo":Number(botNo),
        "name":name,
        "photoUrl":photoUrl,
        "status":Number(status)
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 3.トーク Bot のドメイン登録
   */
  this.registerBotDomain = function(botNo,domainId){
    var apiUri = '/message/registerBotDomain/v2';
    domainId = domainId ? domainId : 0;
    var bodyObj = {
        "botNo":Number(botNo),
        "domainId":Number(domainId)
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 4.トーク Bot のドメイン削除
   */
  this.removeBotDomain = function(botNo,domainId){
    var apiUri = '/message/removeBotDomain/v2';
    var bodyObj = {
        "botNo":Number(botNo),
        "domainId":Number(domainId)
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 5.トーク Bot リスト照会
   */
  this.getBotList = function(isActive){
    var apiUri = '/message/getBotList/v2';
    isActive = isActive ? isActive : false;
    var bodyObj = {
        "isActive":isActive
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 6.トーク Bot 詳細情報の照会
   */
  this.getBotInfo = function(botNo){
    var apiUri = '/message/getBotInfo/v2';
    var bodyObj = {
        "botNo":Number(botNo)
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 7.メッセージ送信
   */
  this.sendMessage = function(botNum,accountId,msg,content){
    var apiUri = '/message/sendMessage/v2';
    content = content ? content : {"type":"text","text":msg};
    var bodyObj = {
        "botNo":Number(botNum),
        "accountId":accountId,
        "content":content
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

  /**
   * 8.メッセージ受信サーバー追加
   */
  this.setCallback = function(botNo,callbackUrl){
    var apiUri = '/message/setCallback/v2';
    var bodyObj = {
        "botNo":Number(botNo),
        "callbackUrl":callbackUrl,
        "callbackEventList": ["text"]
    };

    this.requestToLineworks(apiUri,bodyObj);
  };

};