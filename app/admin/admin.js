const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const loginCode = new mongoose.Schema({
    number : Number,
    code: String,
    expiresAt: { type: Date, default: Date.now, index: { expires: '120m' } }
});
  
  
const LoginCode = mongoose.model('loginCodeadmin', loginCode);


exports.sendsms = async (req, res) => {
    try {
        
        const randomCode = Math.floor(Math.random() * 999999)
        const response = await axios.post(
            'https://api2.ippanel.com/api/v1/sms/pattern/normal/send',
            {
                "code": "05zezf3afrofqc0",
                "sender": "+983000505",
                "recipient": `+989336230914`, //+989216069232
                "variable": {
                  "code": `${randomCode}`
                }
              },
            {
              headers: {
                'accept': 'application/json',
                'apikey': 'OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=', // 👈 جایگزین کن با کلید واقعی خودت
                'Content-Type': 'application/json'
              }
            }
          );
         
          

          const savecodee = new LoginCode({
            number: 989336230914,
            code: randomCode
          });
          const savecode = await savecodee.save();

          res.json({
            massage: "ok"
          })


      
          
          
    } catch (error) {
        res.json({
            massage : error
        })    
    }
}


exports.login = async(req, res) => {
    try {
        const {code} = req.body
        if (!code) {
            return res.json({massage: "data is empty"})
        }

        
 
 
        if (code === 'AsAz1323@@13!!!!') {
            
              
            res.json({
                login: "true",
            }) 
           
         }else{
           return res.json({massage: "data is false"})
        }
        

    } catch (error) {
        res.json({
            massage : error
        })  
    }
}