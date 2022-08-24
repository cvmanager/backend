const router = require('express').Router();


let userRoutng = require('./users/userRoute');
router.use('/user', userRoutng);


module.exports = router;