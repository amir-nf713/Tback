const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const notification = new mongoose.Schema({
    num : Array,
    msg: String,
    expiresAt: { type: Date, default: Date.now, index: { expires: '20d' } }
});
  
  
const Notification = mongoose.model('notification', notification);


exports.sentNotif = async (req, res) => {
    try{

        const {num, msg} = req.body
        if (!num || !msg) {
            return res.json({massege : "data cant empty"})
        }

        const response = new Notification({
            num,
            msg
        })
        const resp = await response.save()
        if (!resp) {
            return res.json({ data : resp})
        }

        

          res.json({
            send : resp
          })
    } catch (error) {
        res.json({
            error: error
        })
    }
}



















