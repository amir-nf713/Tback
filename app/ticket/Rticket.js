const express = require('express');
const router = express.Router();
const ticket = require('./ticket')

router.get("/ticket",ticket.getticket )
router.get("/ticket/:id",ticket.getticketbyid )
router.get("/tickettext",ticket.gettickettext )
router.get("/tickettext/:id",ticket.gettickettextbyid )
router.put("/ticket/:id",ticket.putticket )

router.post("/ticket",ticket.postticket )
router.post("/tickettext",ticket.posttickettext )

router.delete("/ticket/:id",ticket.closeticket)
router.delete("/tickettext/:id",ticket.closetickettext)


module.exports = router;