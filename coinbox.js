const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

const buyDiv = document.querySelector(".buy");
const sellDiv = document.querySelector(".sell");

ws.onopen = () => {
  const msg = {
    type: "subscribe",
    channels: ["full"],
    product_ids: ["BTC-USD"],
  };

  ws.send(JSON.stringify(msg));
};

function getAvg(data) {
  // console.log(data[0]);
  const avg =
    data.reduce((acc, curr) => {
      return acc + Number(curr.price);
    }, 0) / data.length;

  return avg.toFixed(2);
}

function renderData(data, type) {
  if (data) {
    const avg = getAvg(data);
    const avgDiv = document.querySelector(`.${type}Avg`);
    const timeDiv = document.querySelector(`.time`);

    avgDiv.innerHTML = `Avg requested ${type} price: ${avg}`;
    timeDiv.innerHTML = `Time ${new Date().toLocaleTimeString()}`;
  }
}

const buyData = [];
const sellData = [];

const timer = setInterval(() => {
  renderData(buyData, "buy");
  renderData(sellData, "sell");
}, 5000);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // console.log(data)
  for (let key in data) {
    const side = data.side;
    const type = data.type

    if (side == "buy" && type === "received") {
      //   console.log("buy", data); // here we get buy details
      if (buyData.length > 100) {
        buyData.shift();
      }
      buyData.push(data);

    }

    if (side == "sell" && type == "received") {
      //   console.log("sell", data); // here we get sell data
      if (sellData.length > 100) {
        buyData.shift();
      }
      sellData.push(data);
    }
  }


};

