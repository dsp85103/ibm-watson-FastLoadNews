const express = require('express');
const router = express.Router();
const t2s = require('../services/ibm-watson-text2speech');

//Provides utilities for dealing with directories
var path = require('path');

router.get('/', function (req, res) {
    let listVoices = t2s.getListVoices();
    res.render(path.join(__dirname, '../views/translator.html'), { voices: listVoices.result.voices });
});

module.exports = router;