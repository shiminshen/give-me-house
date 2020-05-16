const line = require("@line/bot-sdk");
const express = require("express");
const fetch = require("node-fetch");
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

const getRecentHouseMessage = async (url) => {
  const currTime = new Date().getTime() / 1000;
  const houseData = await api.getHouse(url);
  const newData = houseData.filter(
    (h) => (currTime - h.updatetime) / duration < 1
  );
  return newData;
};

const house3URL = `https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=4&mrtline=100&order=posttime&orderType=desc&region=1&mrt=1&mrtcoods=${api.mrtcoods}&rentpriceMore=4,5&patternMore=3`;
const house4URL = `https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=4&mrtline=100&order=posttime&orderType=desc&region=1&mrt=1&mrtcoods=${api.mrtcoods}&rentpriceMore=4,5,6&patternMore=4`;

const duration = 1800;
setInterval(async () => {
  const [house3Data, house4Data] = await Promise.all([
    getRecentHouseMessage(house3URL),
    getRecentHouseMessage(house4URL),
  ]).catch((e) => console.log("1111111111111", e));
  // prevent heroku idling every hour
  await fetch("https://give-me-house.herokuapp.com/webhook");
  if (house3Data.length || house4Data.length) {
    const house3Message = generateHouseDataMessage(house3Data);
    const house4Message = generateHouseDataMessage(house4Data);

    client.pushMessage(wholeNewLifeId, [
      ...(house3Data.length
        ? [{ type: "text", text: "有新房子囉(3房)" }, house3Message]
        : []),
      ...(house4Data.length
        ? [{ type: "text", text: "有新房子囉(4房)" }, house4Message]
        : []),
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
      // const house3Data = await api.getHouse();
      // const house3Data = await api.getHouse(house4URL);
      const [house3Data, house4Data] = await Promise.all([
        api.getHouse(),
        api.getHouse(house4URL),
      ]);

      const house3Message = generateHouseDataMessage(house3Data);
      const house4Message = generateHouseDataMessage(house4Data);

      client.replyMessage(event.replyToken, [
        { type: "text", text: "3房" },
        house3Message,
        { type: "text", text: "4房" },
        house4Message,
      ]);
    }
  }
  res.json({});
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
