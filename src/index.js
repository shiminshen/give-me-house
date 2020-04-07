// 引用linebot SDK
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1654051232',
  channelSecret: 'c1d2bab6c05c09198e296ffd4e3040e2',
  channelAccessToken: 'zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU='
});

// 當有人傳送訊息給Bot時
bot.on('message',  (event) => {
  event.reply(event.message.text).then( (data) => {
  }).catch( (error) => {
  });
});

const PORT = 3000;
// env PORT for heroku
bot.listen('/linewebhook', process.env.PORT || PORT, () => {
    console.log(`bot is active at localhost:${PORT}`);
});
