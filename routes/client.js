const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, (req, res) => {
    res.send('You are now Logged In!');
})

module.exports = router;