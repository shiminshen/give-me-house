const line = require('@line/bot-sdk');
const express = require('express');
const api = require('./api');

// create LINE SDK config from env variables
const config = {
  channelSecret: 'c1d2bab6c05c09198e296ffd4e3040e2',
  channelAccessToken: 'zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU='
};
const client = new line.Client(config);

const app = express();
app.post('/webhook', line.middleware(config), async (req, res) => {
  const event = req.body.events[0];

  if (event.type === 'message') {
    const message = event.message;
    console.log('message');
    console.log(message);

    if (message.type === 'text' && message.text === 'fuck') {
      const houseData = await api.getHouse()
      console.log(houseData);
      const messages = houseData
        .filter(h => h.distance < 2500)
        .slice(0,10)
        .map(h => ({
        "thumbnailImageUrl": h.cover,
        "imageBackgroundColor": "#FFFFFF",
        "title": h.address_img,
        "text": `$${h.price}\n${h.layout}\n${h.posttime}\n${h.search_name} ${h.distance}m`,
        "actions": [
          {
            "type": "uri",
            "label": "View detail",
            "uri": `https://rent.591.com.tw/rent-detail-${h.id}.html`
          }
        ]
      }))
      client.replyMessage(event.replyToken, {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
          "type": "carousel",
          "columns": messages,
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
        }
      });
    }
  }
  res.json({})
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
