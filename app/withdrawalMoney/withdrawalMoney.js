const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const sendmony = new mongoose.Schema({
    price: Number,
    userid: String,
    shaba: String,
    date: {type: Date, default: Date.now},
    status: {type: String, default: "درحال بررسی"},
});
  
  
const Sendmony = mongoose.model('sendmony', sendmony);


exports.getsendmony = async (req, res) => {
    try {
        res.json({
            data : await Sendmony.find()
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.getsendmonybyid = async (req, res) => {
    try {
        const userid = req.params.id
        res.json({
            data : await Sendmony.find({userid})
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}



exports.postsendmony = async (req, res) => {
    try {
       const {price, userid, shaba} = req.body
       if (!price || !userid || !shaba) {
        return res.json({ massage: "data cant empty"})
       }

       const savesendmony = new Sendmony({
        price,
        userid,
        shaba,
       });

       const save = await savesendmony.save();
    
      
       res.json({
           massage: "ok"
       })

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.putsendmony = async (req, res) => {
    try {
        const _id = req.params.id;
        const findUser = await Sendmony.findOne({ _id });
        if (!findUser) {
          return res.json({ massage: "user not found" });
        }

        const updatedData = req.body;
        const Id = findUser._id;

        const update = await Sendmony.findByIdAndUpdate(
          Id,
          { $set: updatedData },
          { new: true }
        );

        res.json({ update });
    } catch (error) {
        res.json({
            massage : error
        })
    }
}


