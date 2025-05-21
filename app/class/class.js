const axios  = require("axios");

const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const course = new mongoose.Schema({
   title: String,
   explanation: String,
   teachersname: String,
   price: Number,
   photo: String,
//    student: String,

});
  
  
const Course = mongoose.model('course', course);




const video = new mongoose.Schema({
   courseid: String,
   video: String,
   videotitle: String
});
  
  
const Video = mongoose.model('video', video);




const usersCourse = new mongoose.Schema({
   userid: String,
   courseid: String,
   date: {type: Date, default: Date.now}
});
  
  
const UsersCourse = mongoose.model('usersCourse', usersCourse);



exports.getcourse = async (req, res) => {
    try {
        res.json({
            data : await Course.find()
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.getcoursebyid = async (req, res) => {
    try {
        const _id = req.params.id
        res.json({
            data : await Course.findOne({_id})
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.postcourse = async (req, res) => {
    try {
       const {title, explanation, teachersname, price, photo} = req.body
       if (!title || !explanation || !teachersname || !price || !photo) {
        return res.json({ massage: "data cant empty"})
       }

       const savecourse = new Course({
        title,
        explanation,
        teachersname,
        price,
        photo,
       });

       const save = await savecourse.save();
    
      
       res.json({
           massage: "ok"
       })

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.deletecourse = async (req, res) => {
    try {
        const _id = req.params.id;
        const findCourse = await Course.findOne({ _id });
        if (!findCourse) {
          return res.json({ massage: "course not found" });
        }

        const deleteCourse = await Course.deleteOne({ _id });

        res.json({
          data: deleteCourse,
        });

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}




exports.getvideo = async (req, res) => {
    try {
       res.json({
        data: await Video.find()
       })
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.getvideobyid = async (req, res) => {
    try {
        const courseid = req.params.cid
        res.json({
            data: await Video.find({courseid})
        })

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


const multer = require('multer');
const fs = require('fs');
const path = require('path');

// تنظیمات multer برای آپلود فایل‌ها
const upload = multer({ dest: 'uploads/videos/' });

// مسیر ذخیره فایل‌های ویدیو
const uploadDir = path.join(__dirname, 'public', 'videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// اپلود ویدیو
exports.postvideo = [
  upload.single('video'),  // multer برای پردازش فایل ویدیو
  async (req, res) => {
    try {
      const { courseid, videotitle } = req.body;
      const video = req.file;  // فایل ویدیو در req.file قرار می‌گیرد

    //   if (!courseid || !video || !videotitle) {
    //     return res.json({ massage: "data can't be empty" });
    //   }

      console.log("Received video:", req.body);  // چاپ داده‌های دریافتی

      const videoFileName = `${Date.now()}_${video.originalname}`;
      const videoPath = `/videos/${videoFileName}`; // این مسیر به مرورگر داده میشه
      const fullSavePath = path.join(__dirname, 'public', 'videos', videoFileName); // مسیر واقعی فایل
      
      fs.renameSync(video.path, fullSavePath);
      

      console.log("Video saved at:", videoPath);

      
      // ذخیره اطلاعات ویدیو در دیتابیس
      const saveVideo = new Video({
        courseid,
        video: videoPath, // مثلاً: `/videos/123456789_video.mp4`
        videotitle,
      });

      const save = await saveVideo.save();
      console.log("Video saved to database:", save);

      res.json({ massage: "ok" });
    } catch (error) {
      console.error("Error in postvideo:", error);
      res.json({ massage: error.message });
    }
  }
];




exports.deletevideo = async (req, res) => {
    try {
        const _id = req.params.id;
        const findVideo = await Video.findOne({ _id });
        if (!findVideo) {
          return res.json({ massage: "Video not found" });
        }

        const deleteVideo = await Video.deleteOne({ _id });

        res.json({
          data: deleteVideo,
        });

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}



exports.getusersCourse = async (req, res) => {
    try {
        res.json({
            data : await UsersCourse.find()
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.getusersCourseById = async (req, res) => {
    try {
        const userid = req.params.id
        res.json({
            data : await UsersCourse.find({ userid })
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.postusersCourse = async (req, res) => {
    try {
       const {userid, courseid} = req.body
       if (!userid || !courseid) {
          return res.json({ massage: "data cant empty"})
       }

       const saveUserCourse = new UsersCourse({
        userid,
        courseid,
       });

       const save = await saveUserCourse.save();
    
      
       res.json({
           massage: "ok"
       })

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}





