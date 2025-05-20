const { default: axios } = require("axios");


let USD = null;
let EUR = null;


const fetchUsdPrice = async () => {
  try {
    const response = await axios.get("https://BrsApi.ir/Api/Market/Cryptocurrency.php?key=FreeyD7ZoFEmluZwQHgEJlwffqDt0FPr");

    response.data.forEach(element => {
        if (element.name === "Tether") {
            USD = element.price_toman;
           
        }
        if (element.name === "Euro Coin") {
            EUR = element.price_toman;
           
        }
    });
    
    
  } catch (err) {
    console.error("❌ خطا در گرفتن قیمت:", err.message);
  }
};


fetchUsdPrice()


setInterval(fetchUsdPrice, 60 * 1000);


exports.getUsd = async (req, res) => {
  try {
    res.json({
        data : USD
    })
  } catch (error) {
    console.log(error);
    
  }
}

exports.getEur = async (req, res) => {
  try {
    res.json({
        data : EUR
    })
  } catch (error) {
    console.log(error);
    
  }
}