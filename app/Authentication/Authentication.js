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
       if (!userid || !cartmeliphoto || !codemeli || !name || !lastname || !email || !gnder || !brthday) {
        return res.json({ massage: "data cant empty"})
       }

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


