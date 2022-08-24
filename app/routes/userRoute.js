const router = require('express').Router();


router.get('/' , (req,res) => {
    res.send('A');
})

module.exports = router;