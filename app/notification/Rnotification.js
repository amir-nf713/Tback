const express = require('express');
const router = express.Router();
const notification = require('./notification')

router.post('/send/notification', notification.sentNotif)



module.exports = router;