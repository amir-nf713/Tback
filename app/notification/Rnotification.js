const express = require('express');
const router = express.Router();
const notification = require('./notification')

router.post('/send/notification', notification.sentNotif)
router.get('/send/notification', notification.getNotif)
router.delete('/send/notification/:id', notification.deleteAllNotif)



module.exports = router;