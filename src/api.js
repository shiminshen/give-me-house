const fetch = require("node-fetch");

// const mrtcoods = "4315,4316,4317,4318,4319,4320,4321,4282,4323,4324,4185,4186,4187";
// const mrtcoods = "4320,4321,4282,4323,4319,4318,4257,4314,4315,4316,4317";
// 忠孝復興 to 南港展覽館
const mrtcoods =
  "4187,4186,4185,4324,4323,4282,4321,4320,4319,4318,4317,4316,4315,4314,4257";
const url = `https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=4&mrtline=100&order=posttime&orderType=desc&region=1&mrt=1&mrtcoods=${mrtcoods}&rentpriceMore=4,5&patternMore=3`;

const getHouse = async (searchURL = url) => {
  const res = await fetch("https://rent.591.com.tw");
  const cookie = res.headers
    .raw()
    ["set-cookie"].find((h) => /^591_new_session/.test(h));
  const content = await res.text();
  const token = content.match(/csrf-token" content="(.*)">/)[1];

  const searchResult = await fetch(searchURL, {
    headers: {
      "X-CSRF-TOKEN": token,
      Cookie: cookie,
      "X-Requested-With": "XMLHttpRequest",
    },
  }).then((res) => res.json());
  return searchResult.data.data;
};

module.exports = {
  mrtcoods,
  getHouse,
};
