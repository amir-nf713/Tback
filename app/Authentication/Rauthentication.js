const express = require('express');
const router = express.Router();
const authentication = require('./Authentication')

router.get('/authentication', authentication.getauthentication)
router.get('/authentication/:id', authentication.getauthenticationbyid)
router.post('/authentication', authentication.postauthentication)
router.delete('/authentication/:id', authentication.closeathu)



module.exports = router;