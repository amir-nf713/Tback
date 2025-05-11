const express = require('express');
const router = express.Router();
const Class = require('./class')

router.get('/course', Class.getcourse)
router.post('/course', Class.postcourse)
router.delete('/course/:id', Class.deletecourse)

router.get('/video', Class.getvideo)
router.get('/video/:cid', Class.getvideobyid)
router.post('/video', Class.postvideo)
router.delete('/video/:id', Class.deletevideo)


router.get('/users/course', Class.getusersCourse)
router.get('/users/course/:id', Class.getusersCourseById)
router.post('/users/course', Class.postusersCourse)


module.exports = router;