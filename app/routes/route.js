const router = require('express').Router();

let userRouting = require('./userRoute');
let projectRouting = require('./project-route');


router.use('/user', userRouting);
router.use('/projects', projectRouting);


module.exports = router;