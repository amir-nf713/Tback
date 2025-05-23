const express = require('express');
const router = express.Router();
const login = require('./login')

router.post('/sendsms/:num', login.sendsms)
router.post('/login', login.login)
router.post('/getcode', login.getcode)
router.get('/getuser', login.getuser)
router.get('/getuser/:id', login.getuserbyid)
router.put('/putuser/:id', login.putuser)
router.delete('/deletuser/:id', login.deleteuser)


module.exports = router;