const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelSecret: 'c1d2bab6c05c09198e296ffd4e3040e2',
  channelAccessToken: 'zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU='
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  res.json({})
  // Promise
  //   .all(req.body.events.map(handleEvent))
  //   .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
