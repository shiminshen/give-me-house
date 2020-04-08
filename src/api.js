const fetch = require('node-fetch');

const getHouse = async (searchURL = 'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=4&mrtline=100&patternMore=3,4&region=1&mrt=1&rentpriceMore=4,5&patternMore=3,4&not_cover=1&mrtcoods=4318,4319,4320,4321,4282&order=posttime&orderType=desc') => {

  const res = await fetch('https://rent.591.com.tw/?kind=1&mrtline=100&mrtline=100&order=posttime&orderType=desc&region=1&mrt=1&mrtcoods=4187,4186,4185,4320&rentprice=4&pattern=3')
  const cookie = res.headers.raw()['set-cookie'].find(h => /^591_new_session/.test(h))
  const content = await res.text();
  const token = content.match(/csrf-token" content="(.*)">/)[1]
  
  const searchResult = await fetch(searchURL, {
    headers: {
      'X-CSRF-TOKEN': token,
      'Cookie': cookie,
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
	.then(res => res.json())
  return searchResult.data.data
}

module.exports = {
  getHouse
}
