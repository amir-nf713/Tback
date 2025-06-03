const axios = require("axios");
const connectToMongo = require("../../mongo");
connectToMongo();
const mongoose = require("mongoose");
const { use } = require("./Rlogin");






const referralSettingSchema = new mongoose.Schema({
  priceWithroutMony: { type: Number, default: 0 },
  priceByCourse: { type: Number, default: 0 },
});

const ReferralSetting = mongoose.model("referralSetting", referralSettingSchema);

async function ensureReferralSetting() {
  try {
    const existing = await ReferralSetting.findOne();
    if (!existing) {
      const newSetting = new ReferralSetting();
      await newSetting.save();
      console.log("ReferralSetting ساخته شد.");
    } else {
      console.log("ReferralSetting قبلا وجود داشت.");
    }
  } catch (err) {
    console.error("خطا در بررسی یا ساخت ReferralSetting:", err);
  }
}

// حتما بعد از اتصال به دیتابیس این رو فراخوانی کن
ensureReferralSetting();

// GET تنظیمات رفرال
exports.getReferralSetting = async (req, res) => {
  try {
    const setting = await ReferralSetting.findOne();
    if (!setting) {
      return res.status(404).json({
        message: "ReferralSetting یافت نشد",
      });
    }
    res.json({
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
    });
  }
};

// PUT آپدیت تنظیمات رفرال
exports.updateReferralSetting = async (req, res) => {
  try {
    const { priceWithroutMony, priceByCourse } = req.body;

    const setting = await ReferralSetting.findOne();
    if (!setting) {
      return res.status(404).json({
        message: "ReferralSetting یافت نشد",
      });
    }

    if (priceWithroutMony !== undefined) setting.priceWithroutMony = priceWithroutMony;
    if (priceByCourse !== undefined) setting.priceByCourse = priceByCourse;

    await setting.save();

    res.json({
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
    });
  }
};




const loginCode = new mongoose.Schema({
  number: Number,
  code: String,
  expiresAt: { type: Date, default: Date.now, index: { expires: "2m" } },
});

const smsRequestSchema = new mongoose.Schema({
    number: String,
    requestedAt: { type: Date, default: Date.now }, // زمان درخواست
  });
  
  const SmsRequest = mongoose.model('SmsRequest', smsRequestSchema);
  

const LoginCode = mongoose.model("loginCode", loginCode);




const users = new mongoose.Schema(
  {
    number: { type: String, unique: true },
    name: { type: String, default: "unknown" },
    lastname: { type: String, default: "unknown" },
    date: { type: Date, default: Date.now },
    Authentication: { type: String, default: false },
    wallet: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    photo: { type: String, default: "" },
    cartmeliphoto: { type: String, default: "" },
    codemeli: { type: String, default: "" },
    email: { type: String, default: "" },
    berthday: { type: String, default: "" },
    gender: { type: String, default: "" },
    referralCode: { type: String, unique: true },
    referralFrom: { type: String, default: null },
    referralBy: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    referralPrice: { type: Number, default: 0 },
    
  },
  { timestamps: true }
);

const Users = mongoose.model("user", users);

exports.sendsms = async (req, res) => {
  try {
    const Number = req.params.num;
    const randomCode = Math.floor(Math.random() * 999999);

    const requests = await SmsRequest.find({
        number: Number,
        requestedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // فقط درخواست‌های 5 دقیقه گذشته
      });
      
      // اگر تعداد درخواست‌ها بیشتر از 5 تا باشد، درخواست جدید پذیرفته نمی‌شود
      if (requests.length >= 5) {
        return res.json({ message: "You have reached the limit of requests (5 per 5 minutes)" });
      }
      
    const response = await axios.post(
      "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
      {
        code: "05zezf3afrofqc0",
        sender: "+983000505",
        recipient: `${Number}`,
        variable: {
          code: `${randomCode}`,
        },
      },
      {
        headers: {
          accept: "application/json",
          apikey:
            "OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=", // 👈 جایگزین کن با کلید واقعی خودت
          "Content-Type": "application/json",
        },
      }
    );

    const saveRequest = new SmsRequest({
        number: Number,
      });
      await saveRequest.save();
      

    const savecodee = new LoginCode({
      number: Number,
      code: randomCode,
    });
    const savecode = await savecodee.save();

    if (!savecode) {
      return res.json({ massege: "dont save" });
    }

    res.json({
      massege: "ok",
    });
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};


async function generateUniqueReferralCode() {
  let code, exists;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase(); // مثل: "A1B2C3"
    exists = await Users.findOne({ referralCode: code });
  } while (exists);
  return code;
}

exports.login = async (req, res) => {
  try {
    const { number, code , referralFrom} = req.body;
    if (!number || !code) {
      return res.status(400).json({ message: "number or code is missing" });
    }
    



    const findCode = await LoginCode.findOne({ number })
  .sort({ expiresAt: -1 });  // مرتب‌سازی بر اساس تاریخ انقضا به صورت نزولی (جدیدترین اول)
if (!findCode) {
  return res.json({ message: "No valid code found" });
}

const referralCode = await generateUniqueReferralCode();


    if (findCode.number === number && findCode.code === code) {
      const findUser = await Users.findOne({ number });
      if (!findUser) {
        const saveuser = new Users({
          number: number,
          referralCode,
          referralFrom,
        });

        const save = await saveuser.save();

        if (!save) {
          return res.json({ massege: "dont save" });
        }


        
        if (referralFrom) {
          const referrer = await Users.findOne({ referralCode: referralFrom.toUpperCase() });
          if (referrer) {
            await Users.updateOne(
              { _id: referrer._id },
              { $addToSet: { referralBy: save._id } }
            );
          }
        }

      
        


        res.json({
          massage: "ok",
          data: save,
        });
      } else {
        return res.json({ login: "true", data: findUser });
      }
    } else {
      return res.json({ massage: "data is false" });
    }
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};

exports.getcode = async (req, res) => {
  try {
    const { number, code } = req.body;

    const findCode = await LoginCode.findOne({ code });
    if (!findCode) {
      return res.json({ massage: "number is undfind" });
    }
    if (findCode.number == number || findCode.code === code) {
      console.log(findCode.code, code);

      return res.json({ massage: "ok" });
    }
    res.json({
      massage: "no",
    });
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};

exports.getuser = async (req, res) => {
  try {
    res.json({
      data: await Users.find(),
    });
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};

exports.getuserbyref = async (req, res) => {
  try {
    const { referralCode } = req.params;

    const user = await Users.findOne({ referralCode });

    if (!user) {
      return res.status(404).json({ message: "کاربر پیدا نشد" });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "خطا در دریافت کاربر",
    });
  }
};


exports.getuserbyid = async (req, res) => {
    try {
      const _id = req.params.id;
      const user = await Users.findOne({ _id });
      if (!user) {
        return res.json({
          data: "not found"
        });
      }
      res.json({
        data: user
      });
    } catch (error) {
      res.json({
        message: error.message || error,
      });
    }
  };

exports.putuser = async (req, res) => {
  try {
    const _id = req.params.id;
    const findUser = await Users.findOne({ _id });
    if (!findUser) {
      return res.json({ massage: "user not found" });
    }

    const updatedData = req.body;
    const Id = findUser._id;

    const update = await Users.findByIdAndUpdate(
      Id,
      { $set: updatedData },
      { new: true }
    );

    res.json({ update });
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};

exports.deleteuser = async (req, res) => {
  try {
    const _id = req.params.id;
    const findUser = await Users.findOne({ _id });
    if (!findUser) {
      return res.json({ massage: "user not found" });
    }

    const deleteUser = await Users.deleteOne({ _id });

    res.json({
      data: deleteUser,
    });
  } catch (error) {
    res.json({
      massage: error,
    });
  }
};
