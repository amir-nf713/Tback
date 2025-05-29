const axios  = require("axios");
// const connectToMongo = require("../../mongo")
// connectToMongo()
// const mongoose = require('mongoose');

// const loginCode = new mongoose.Schema({
//     number : Number,
//     code: String,
//     expiresAt: { type: Date, default: Date.now, index: { expires: '120m' } }
// });
  
  
// const LoginCode = mongoose.model('loginCodeadmin', loginCode);


exports.sentNotif = async (req, res) => {
    try{

        const {num, msg} = req.body
        if (!num || !msg) {
            return res.json({massege : "data cant empty"})
        }

        const response = await axios.post(
            'https://api2.ippanel.com/api/v1/sms/send/webservice/single',
            {
                "recipient": num,
                "sender": "+983000505",
                "message": msg
            },
            {
              headers: {
                'accept': 'application/json',
                'apikey': 'OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=', // 👈 جایگزین کن با کلید واقعی خودت
                'Content-Type': 'application/json'
              }
            }
          );

          res.json({
            send : response
          })
    } catch (error) {
        res.json({
            error: error
        })
    }
}



















