const express = require('express');
const router = express.Router();
const translator = require('../services/ibm-watson-translator');

//Provides utilities for dealing with directories
var path = require('path');

router.get('/', function (req, res) {
    let result = translator.translate(req.query.text);
    result
        .then(translationResult => {
            console.log('translator result: ', translationResult);
            res.send(JSON.stringify(translationResult, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });
});

module.exports = router;