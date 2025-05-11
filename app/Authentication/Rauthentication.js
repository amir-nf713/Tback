const express = require('express');
const router = express.Router();
const authentication = require('./Authentication')

router.get('/authentication', authentication.getauthentication)
router.get('/authentication/:id', authentication.getauthenticationbyid)
router.post('/authentication', authentication.postauthentication)



module.exports = router;