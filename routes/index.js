const express = require('express');
const router = express.Router();

//Provides utilities for dealing with directories
var path = require('path');

router.get('/', function (req, res) {
    res.render(path.join(__dirname, '../views/index.html'));
});

module.exports = router;