const express = require('express');
const router = express.Router();
const discovery = require('../services/ibm-watson-discovery');

router.post('/', function (req, res) {
    console.log(req.body.query);
    let discoveryQuery = discovery.query(req.body.query, req.body.count);

    discoveryQuery
        .then(queryResponse => {
            res.send(JSON.stringify(queryResponse, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            res.send('error:', err);
        });

});

module.exports = router;