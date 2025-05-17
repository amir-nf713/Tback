const axios = require("axios");
const connectToMongo = require("../../mongo");
connectToMongo();
const mongoose = require("mongoose");

const loginCode = new mongoose.Schema({
  number: Number,
  code: String,
  expiresAt: { type: Date, default: Date.now, index: { expires: "2m" } },
});

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
  },
  { timestamps: true }
);

const Users = mongoose.model("user", users);

exports.sendsms = async (req, res) => {
  try {
    const Number = req.params.num;
    const randomCode = Math.floor(Math.random() * 999999);
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

exports.login = async (req, res) => {
  try {
    const { number, code } = req.body;
    if (!number && !code) {
      return res.json({ massage: "data is empty" });
    }

    const findCode = await LoginCode.findOne({ number }).sort({
      createdAt: -1,
    }); // مرتب‌سازی بر اساس تاریخ به صورت نزولی (جدیدترین اول)
    if (!findCode) {
      return res.json({ message: "number not found" });
    }

    if (findCode.number === number && findCode.code === code) {
      const findUser = await Users.findOne({ number });
      if (!findUser) {
        const saveuser = new Users({
          number: number,
        });

        const save = await saveuser.save();

        if (!save) {
          return res.json({ massege: "dont save" });
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

exports.getuserbyid = async (req, res) => {
  try {
    const _id = req.params.id;
    res.json({
      data: await Users.findOne({ _id }),
    });
  } catch (error) {
    res.json({
      massage: error,
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
