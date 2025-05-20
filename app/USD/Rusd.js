const express = require('express');
const router = express.Router();
const price = require('./usd')

router.get("/usd", price.getUsd)
router.get("/eur", price.getEur)



module.exports = router;