const axios = require("axios");

exports.sendSms = async (req, res) => {
    const {code, num, vbl} = req.body
    const response = await axios.post(
        "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        {
          code: code,
          sender: "+983000505",
          recipient: `${num}`,
          variable: {
            code: `${vbl}`,
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
}

exports.sendSms2 = async (req, res) => {
    const {code, num, vbl} = req.body
    const response = await axios.post(
        "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        {
          code: code,
          sender: "+983000505",
          recipient: `${num}`,
          variable: {
            name: `${vbl}`,
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
}


