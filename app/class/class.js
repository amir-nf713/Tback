const axios = require("axios");
const mongoose = require("mongoose");
const connectToMongo = require("../../mongo");

connectToMongo();

const course = new mongoose.Schema({
  title: String,
  explanation: String,
  teachersname: String,
  price: Number,
  photo: String,
});

const Course = mongoose.model("course", course);

const video = new mongoose.Schema({
  courseid: String,
  video: String,
  videotitle: String,
});

const Video = mongoose.model("video", video);

const usersCourse = new mongoose.Schema({
  userid: String,
  courseid: String,
  date: { type: Date, default: Date.now },
});

const UsersCourse = mongoose.model("usersCourse", usersCourse);

// مدل برای ذخیره اطلاعات پرداخت
const paymentSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  amount: Number,
  authority: String,
  status: String,
  refId: String,
  date: { type: Date, default: Date.now },
});

const Payment = mongoose.model("payment", paymentSchema);

const MERCHANT_ID = "682d7237a45c72000e5263b3"; 
const CALLBACK_URL = "https://dash.tadrisyar.com/api/tadrisyar/verify";

exports.pay = async (req, res) => {
  const { courseId, title, userId } = req.body;

  if (!courseId || !title || !userId) {
    return res.status(400).json({ error: "اطلاعات ناقص است" });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json({ error: "دوره یافت نشد" });
  }

  const price = Number(course.price * 10); // تبدیل تومان به ریال

  try {
    const zibalRes = await axios.post("https://api.zibal.ir/v1/request", {
      merchant: MERCHANT_ID,
      amount: price,
      callbackUrl: `${CALLBACK_URL}?amount=${price}&courseId=${courseId}&userId=${userId}`,
      description: `پرداخت برای ${title}`,
    });

    const { result, trackId, message } = zibalRes.data;

    if (result === 100) {
      // ذخیره در دیتابیس
      const newPayment = new Payment({
        userId,
        courseId,
        amount: price,
        authority: trackId,
        status: "در انتظار",
      });

      await newPayment.save();

      return res.json({ url: `https://gateway.zibal.ir/start/${trackId}` });
    } else {
      return res.status(400).json({ error: message });
    }
  } catch (err) {
    console.error("خطا در اتصال به زیبال:", err);
    res.status(500).json({ error: "خطای سرور در پرداخت" });
  }
};


// تایید پرداخت
exports.verify = async (req, res) => {
  const { trackId, amount, courseId, userId } = req.query;

  if (!trackId || !amount || !courseId || !userId) {
    return res.status(400).send("اطلاعات ناقص است");
  }

  try {
    const verifyRes = await axios.post("https://api.zibal.ir/v1/verify", {
      merchant: MERCHANT_ID,
      trackId,
    });

    const { result, message, refNumber } = verifyRes.data;

    if (result === 100) {
      // به‌روزرسانی پرداخت
      await Payment.findOneAndUpdate(
        { authority: trackId },
        { status: "موفق", refId: refNumber }
      );

      // ثبت دوره برای کاربر
      const newUserCourse = new UsersCourse({
        userid : userId,
        courseid : courseId,
      });

      await newUserCourse.save();

      res.redirect("https://dash.tadrisyar.com/userPannle/userCourse");
    } else {
      res.send(`❌ پرداخت ناموفق بود: ${message}`);
    }
  } catch (err) {
    console.error("خطا در تایید پرداخت:", err);
    res.status(500).send("خطای سرور در تایید پرداخت");
  }
};



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


exports.postvideo = async (req, res) => {
    try {
      const { courseid, videotitle, base64data } = req.body;
  
      if (!base64data || !videotitle || !courseid) {
        return res.json({ massage: "اطلاعات ناقص است" });
      }
  
      const newVideo = new Video({
        courseid,
        videotitle,
        video : base64data,  // کل رشته‌ی base64 مثل "data:video/mp4;base64,..."
      });
  
      await newVideo.save();
  
      res.json({ massage: "ok" });
    } catch (error) {
      console.error("خطا در ذخیره ویدیو:", error);
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





