const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelSecret: 'c1d2bab6c05c09198e296ffd4e3040e2',
  channelAccessToken: 'zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU='
};
const client = new line.Client(config);

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  res.json({})
  const event = req.body.events[0];

  console.log('event');
  console.log(event);
  if (event.type === 'message') {
    const message = event.message;
    console.log('message');
    console.log(message);

    if (message.type === 'text' && message.text === 'bye') {
      if (event.source.type === 'room') {
        client.leaveRoom(event.source.roomId);
      } else if (event.source.type === 'group') {
        client.leaveGroup(event.source.groupId);
      } else {
        client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'I cannot leave a 1-on-1 chat!',
        });
      }
    }
  }
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
