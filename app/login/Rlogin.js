const express = require('express');
const router = express.Router();
const login = require('./login')

router.post('/sendsms/:num', login.sendsms)
router.post('/login', login.login)
router.get('/getuser', login.getuser)


module.exports = router;