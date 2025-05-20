const axios = require("axios");

exports.sendSms = async (req, res) => {
  try {
    const { code, num, vbl } = req.body;
    const response = await axios.post(
      "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
      {
        code: code,
        sender: "+983000505",
        recipient: `${num}`,
        variable: {
          code: `${vbl}`, // به نظر می‌رسه اینجا باید vbl باشه نه variable
        },
      },
      {
        headers: {
          accept: "application/json",
          apikey: "OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendSms2 = async (req, res) => {
  try {
    const { code, num, vbl } = req.body;
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
          apikey: "OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
