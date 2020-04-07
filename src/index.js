const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelSecret: 'c1d2bab6c05c09198e296ffd4e3040e2',
  channelAccessToken: 'zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU='
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
