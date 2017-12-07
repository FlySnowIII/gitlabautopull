# Gitlab 自動バックアップ(Pull)

Gitサーバのバックアップ問題を解決するため、当プロジェクトが作られました。

1. DeveloperからGitサーバ(GitLab)にPUSHします。
1. GitLabのWebhook機能を使って、PUSHされたらFirebase Functionsで作ったWebAPIにPUSH情報を送信し、Firebase FunctionsのWebAPIからFirebase DatabaseにPUSH情報を更新します。
1. Firebase Databaseの自動感知の特性を利用し、PUSH情報を更新されたら、バックアップ用サーバにてPULLコマンドを実行します。
1. バックアップサーバがPULLコマンドを実行後、Developerに更新済みのメッセージをLineworksで送信します。



# システム設定

当システムでは、**GitLab**と**Firebase**のアカウントが必須となります。
* [GitLab](https://bitnami.com/stack/gitlab) : Bitnami+GCPで簡単にGitlabサーバが建てられます。
* [Firebase](https://firebase.google.com) : Realtime Database と Cloud Functionsを使います。
* [Lineworks](https://www.azest.co.jp/lineworks) : 最大30日間のお試しできます。


## 1.Firebase Projectを作成し、Realtime Databaseを設定

### 1.Realtime Databaseのアクセスルールを修正

当プロジェクトを素早く動かすために、Realtime Databaseのアクセスルール制限を一時的に外します。
セキュリティ面の配慮をしたいとき、まだRealtime Databaseのアクセスルールを設定してください。

設定方法は下図にご参考ください。

~~~json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
~~~

### 2. **(非必須)** Lineworks通知機能を使いたい場合

Lineworks通知機能を使いたい場合、Firebase Realtime Databaseにて下記の形のデータを追加してください。

~~~json
{
  "lineworks" : {
    "botnum" : 1323,
    "sendlist" : {
      "tan" : "tan@azest.biz"
    }
  }
}
~~~

* lineworks : Lineworks機能を起動するため 
* botnum : LinewroksのBotID
* sendlist : 送信者リスト(複数人可)　[{key(任意):lineworks account id},{key(任意2):lineworks account id2}]

## 2.社内バックアップサーバで当プロジェクトを起動

※下記の例文コマンドはUbuntu 17.10 64bit環境で実行されました。

### **1.Install**

> 1.node.js最新版 

~~~Bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y vim curl
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

> 2.Firebase CLI 

~~~Bash
sudo npm install -g firebase-tools
~~~

### **2. .env配置ファイルを設定**

> フォルダfunctionsにある配置ファイル「readme.env」のファイル名を「.env」に修正してください。  
> そして、下図のようにFireworks認証データを入力してください。

### **3.Firebase Functionsをデプロイ**
> 参考サイト: https://firebase.google.com/docs/functions/get-started?hl=ja  

> 下記のコマンドを実行してください。

~~~Bash
firebase login
firebase init functions
firebase depoly --only functions:gitlabautopull
~~~

> そしてWebAPIのURLが発行されるので、そのURLを記録しておきましょう。



### **4.バックアップサーバ用アプリケーションを設定**
> フォルダlocalautopullにある配置ファイル「readme.env」のファイル名を「.env」に修正してください。  
> そして、下図のようにFireworks認証データを入力してください。

>Local Forlder Infomation と Lineworks Infomationの記入例  
~~~Bash
#Local Forlder Infomation
localForlderPath    ="/home/azest/gitlab_bakup/git.azest.co.jp/"
gitlabAccount       ="pengfei"
gitlabPassword      ="mypassword"
#Lineworks Infomation
API_ID              ="jpsdifjewer"
CONSUMER_KEY        ="_g0djdjwkejwekjhweke"
TOKEN               ="AAAAAAAAAASSSSSSSSSSDDDDDDDDDDDASDAS#$"
~~~

### **5.バックアップサーバ用アプリケーションを実行**
> localautopullフォルダに中にアクセスしてください。

~~~Bash
cd localautopull
npm install
node index.js
~~~

> バックグラウンドで実行したい場合、ツールForeverがおすすめです。
https://www.npmjs.com/package/forever

~~~Bash
cd localautopull
sudo npm install forever -g
forever start index.js
~~~

## 3.GitlabのProject設定にて、Webhookを設定

下図のように、GitlabのProject設定にて、Webhookを設定してください。  
