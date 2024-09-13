const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.json('All good here');
});

module.exports = router;