const router = require('express').Router();

let userRouting = require('./userRoute');
let projectRouting = require('./projectRoute');


router.use('/user', userRouting);
router.use('/projects', projectRouting);


module.exports = router;