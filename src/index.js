const line = require("@line/bot-sdk");
const express = require("express");
const api = require("./api");

const wholeNewLifeId = "C2f975b0dd7905f0e8f4da6db716f60df";

// create LINE SDK config from env variables
const config = {
  channelSecret: "c1d2bab6c05c09198e296ffd4e3040e2",
  channelAccessToken:
    "zPZ+AMy9vXfzrJ9AmJxkxdQ+I8EAANlYFFrHzw312BhBoGCVDr0fvEPMt99waz8Qnq1RovA+HrLCn+OOvYA7/OREM2kC0+Z7DAwH0NcGGAP917PIYp1axvXsHPnWqC57+OTRkUXipPR0MN2y6lhACwdB04t89/1O/w1cDnyilFU=",
};
const client = new line.Client(config);

const generateHouseDataMessage = (data) => {
  const columns = data
    .filter((h) => h.distance < 5000)
    .slice(0, 10)
    .map((h) => ({
      thumbnailImageUrl: h.cover,
      imageBackgroundColor: "#FFFFFF",
      title: h.address_img,
      text: `$${h.price}\n${h.layout}\n${h.posttime}\n${h.search_name} ${h.distance}m`,
      actions: [
        {
          type: "uri",
          label: "View detail",
          uri: `https://rent.591.com.tw/rent-detail-${h.id}.html`,
        },
      ],
    }));

  return {
    type: "template",
    altText: "this is a carousel template",
    template: {
      type: "carousel",
      columns,
      imageAspectRatio: "rectangle",
      imageSize: "cover",
    },
  };
};

const duration = 1800;
setInterval(async () => {
  const currTime = new Date().getTime() / 1000;

  // const mrtcoods = "4319,4318,4320,4321,4282";
  // const url = `https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=4&mrtline=100&patternMore=3,4&region=1&mrt=1&rentpriceMore=4,5&patternMore=3,4&not_cover=1&mrtcoods=${mrtcoods}&order=posttime&orderType=desc`;
  const houseData = await api.getHouse();
  // only get data in last one hour
  const newData = houseData.filter(
    (h) => (currTime - h.updatetime) / duration < 1
  );
  console.log("times up !!!!!!!!");
  console.log(newData);
  if (newData.length) {
    console.log("push message");
    const message = generateHouseDataMessage(newData);
    client.pushMessage(wholeNewLifeId, [
      { type: "text", text: "有新房子囉!!!" },
      message,
    ]);
  }
}, duration * 1000);

const app = express();
app.post("/webhook", line.middleware(config), async (req, res) => {
  const event = req.body.events[0];

  if (event.type === "message") {
    const message = event.message;
    console.log("message");
    console.log(message);

    if (message.type === "text" && message.text === "fuck") {
      const houseData = await api.getHouse();
      const message = generateHouseDataMessage(houseData);
      client.replyMessage(event.replyToken, message);
    }
  }
  res.json({});
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
