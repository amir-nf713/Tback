const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const notification = new mongoose.Schema({
    msg: String,
    title: String,
    tags: Array,
    pinned: String,
    createdAt: {type : Date, default : Date.now()},
    expiresAt: { type: Date, default: Date.now, index: { expires: '20d' } }
});
  
  
const Notification = mongoose.model('notification', notification);


exports.sentNotif = async (req, res) => {
    try{

        const {msg, title ,tags, pinned} = req.body
        if (!msg || !title  || !tags  || !pinned ) {
            return res.json({massege : "data cant empty"})
        }

        const response = new Notification({
            msg,
            title,
            tags,
            pinned
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
exports.getNotif = async (req, res) => {
    try{
      res.json({ data : await Notification.find() })
    } catch (error) {
        res.json({
            error: error
        })
    }
}


exports.deleteAllNotif = async (req, res) => {
    try {
      const result = await Notification.deleteMany({}); // حذف همه رکوردها
  
      res.json({
        message: "تمام نوتیفیکیشن‌ها با موفقیت حذف شدند",
        data: result, // result شامل تعداد اسناد حذف‌شده است
      });
    } catch (error) {
      res.status(500).json({
        message: "خطا در حذف نوتیفیکیشن‌ها",
        error: error.message,
      });
    }
  };
  


















