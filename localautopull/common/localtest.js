const LineworksBot = require("./lineworksbot");
const lineworksBot = new LineworksBot();


// lineworksBot.registerBot("Azest GitLab","https://pbs.twimg.com/profile_images/757993008461742080/9pAwHBR0_400x400.jpg");
// lineworksBot.registerBotDomain(1323,0);
var lineworksMsg="Azest GitLabにPushされました."+"\n"
        +"Project Name: "+"\n"
        +"Branch: "+"\n"
        +"Message: "+"\n"
        +"User: "+"\n"
        +"aaaaaaaaaaa"+"\n";
 lineworksBot.sendMessage(1323,"tan@azest.biz",lineworksMsg);
