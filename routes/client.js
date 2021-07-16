const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, (req, res) => {
    res.render('client/index');
})

module.exports = router;