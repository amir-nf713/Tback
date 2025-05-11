const express = require('express');
const router = express.Router();
const loginadmin = require('./admin')

router.post('/admin/sendsms', loginadmin.sendsms)
router.post('/admin/login', loginadmin.login)


module.exports = router;