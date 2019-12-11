const express = require('express');
const router = express.Router();
const discovery = require('../services/ibm-watson-discovery');

//Provides utilities for dealing with directories
var path = require('path');

// Home page route
router.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, '../views/news.html'));

});

module.exports = router;