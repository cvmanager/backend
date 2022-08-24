const router = require('express').Router();

router.post('/', (req, res) => {
    res.send(req.body);
});

module.exports = router;