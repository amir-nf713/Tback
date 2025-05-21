const axios  = require("axios");
const path = require('path');


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


const fs = require('fs');
const path = require('path');

// مسیر ذخیره فایل‌های ویدیو
const uploadDir = path.join(__dirname, 'public', 'videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.postvideo = async (req, res) => {
  try {
    const { courseid, videotitle, base64data } = req.body;

    if (!courseid || !videotitle || !base64data) {
      return res.status(400).json({ massage: "مقادیر نمی‌توانند خالی باشند." });
    }

    // استخراج نوع فایل و داده واقعی
    const matches = base64data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ massage: "فرمت base64 نامعتبر است." });
    }

    const mimeType = matches[1]; // مثلا video/mp4
    const extension = mimeType.split('/')[1]; // mp4
    const buffer = Buffer.from(matches[2], 'base64');

    const fileName = `${Date.now()}_video.${extension}`;
    const relativePath = `/videos/${fileName}`;
    const fullPath = path.join(uploadDir, fileName);

    // ذخیره فایل در سرور
    fs.writeFileSync(fullPath, buffer);
    console.log("Saved video:", fullPath);

    // ذخیره در دیتابیس
    const saveVideo = new Video({
      courseid,
      video: relativePath, // مسیر قابل دسترسی از فرانت
      videotitle,
    });

    await saveVideo.save();
    res.json({ massage: "ok" });
  } catch (error) {
    console.error("Error in postvideo:", error);
    res.status(500).json({ massage: error.message });
  }
};




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





