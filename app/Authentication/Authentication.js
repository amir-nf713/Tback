const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const authentication = new mongoose.Schema({
   userid: String,
   cartmeliphoto: String,
   codemeli: String,
   name: String,
   lastname: String,
   email: String,
   gnder: String,
   brthday: String,

});
  
  
const Authentication = mongoose.model('authentication', authentication);


exports.getauthentication = async (req, res) => {
    try {
        res.json({
            data : await Authentication.find()
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}


exports.getauthenticationbyid = async (req, res) => {
    try {
        const userid = req.params.id
        res.json({
            data : await Authentication.find({userid})
        }) 
    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}



exports.postauthentication = async (req, res) => {
    try {
       const {userid, cartmeliphoto, codemeli, name, lastname,email ,gnder ,brthday} = req.body
    //    if (!userid || !cartmeliphoto || !codemeli || !name || !lastname || !email || !gnder || !brthday) {
    //     return res.json({ massage: "data cant empty"})
    //    }

    //    console.log(req.body);
       

       const saveauthentication = new Authentication({
        userid,
        cartmeliphoto,
        codemeli,
        name,
        lastname,
        email,
        gnder,
        brthday,
       });

       const save = await saveauthentication.save();
    
      
       res.json({
           massage: "ok"
       })

    } catch (error) {
        res.json({
            massage : error
        }) 
    }
}




exports.closeathu = async (req, res) => {
    try {
        const _id = req.params.id;
        const closeTickettext = await Authentication.findOne({ _id });
        if (!closeTickettext) {
          return res.json({ massage: "tickettext not found" });
        }

        const deletTickettext = await Authentication.deleteOne({ _id });

        res.json({
          data: deletTickettext,
        });
    } catch (error) {
        res.json({
            massage : error
        })
    }
}


