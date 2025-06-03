const express = require('express');
const router = express.Router();
const withdrawalMoney = require('./withdrawalMoney')

router.get('/withdrawalMoney', withdrawalMoney.getsendmony)
router.get('/withdrawalMoney/:id', withdrawalMoney.getsendmonybyid)
router.post('/withdrawalMoney', withdrawalMoney.postsendmony)
router.post('/withdrawalMoneyref', withdrawalMoney.postsendmonyref)
router.put('/withdrawalMoney/:id', withdrawalMoney.putsendmony)



module.exports = router;