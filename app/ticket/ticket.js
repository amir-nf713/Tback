const axios  = require("axios");
const connectToMongo = require("../../mongo")
connectToMongo()
const mongoose = require('mongoose');

const ticket = new mongoose.Schema({
    title: String,
    userid: String,
    date: {type : Date, default: Date.now},
    status: {type: String, default: "درحال بررسی"}
});

const Ticket = mongoose.model('ticket', ticket);



const ticketText = new mongoose.Schema({
  text: String,
  rol: String,
  ticketid: String
});

const TicketText = mongoose.model('ticketText', ticketText);




exports.getticket = async (req, res) => {
    try {
        res.json({
            data : await Ticket.find()
        })   
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}

exports.putticket = async (req, res) => {
    try {
      const _id = req.params.id;
      const findTicket = await Ticket.findOne({ _id });
      if (!findTicket) {
        return res.json({ massage: "ticket not found" });
      }
  
      const updatedData = req.body;
      const Id = findTicket._id;
  
      const update = await Ticket.findByIdAndUpdate(
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

exports.getticketbyid = async (req, res) => {
    try {
        const userid = req.params.id
        res.json({
            data : await Ticket.find({userid})
        })   
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}

exports.gettickettext = async (req, res) => {
    try {
        res.json({
            data : await TicketText.find()
        })   
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}
exports.gettickettextbyid = async (req, res) => {
    const ticketid = req.params.id
    try {
        res.json({
            data : await TicketText.find({ticketid})
        })   
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}

exports.postticket = async (req, res) => {
    try {
         const {title, userid} = req.body
         if (!title || !userid) {
            return res.json({ massage: "data cant empty"})
         }

         const saveticket = new Ticket({
            title,
            userid,
        });

        const save = await saveticket.save();
        
          
        res.json({
            massage: "ok",
            save: save
        })
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}

exports.posttickettext = async (req, res) => {
    try {
        const {text, rol, ticketid} = req.body
        if (!text || !rol || !ticketid) {
           return res.json({ massage: "data cant empty"})
        }

        const savetickettext = new TicketText({
           text,
           rol,
           ticketid,
       });

       const save = await savetickettext.save();
       
         
       res.json({
           massage: "ok"
       })
    } catch (error) {
        res.json({
            massage : error
        })   
    }
}


exports.closeticket = async (req, res) => {
    try {
        const _id = req.params.id;
        const closeTicket = await Ticket.findOne({ _id });
        if (!closeTicket) {
          return res.json({ massage: "ticket not found" });
        }

        const deletTicket = await Ticket.deleteOne({ _id });

        res.json({
          data: deletTicket,
        });
    } catch (error) {
        res.json({
            massage : error
        })
    }
}

 
exports.closetickettext = async (req, res) => {
    try {
        const _id = req.params.id;
        const closeTickettext = await TicketText.findOne({ _id });
        if (!closeTickettext) {
          return res.json({ massage: "tickettext not found" });
        }

        const deletTickettext = await TicketText.deleteOne({ _id });

        res.json({
          data: deletTickettext,
        });
    } catch (error) {
        res.json({
            massage : error
        })
    }
}




