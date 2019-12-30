const express = require('express');
const router = express.Router();
const discovery = require('../services/ibm-watson-discovery');

router.get('/', function (req, res) {
    console.log(req.query.query);
    let discoveryQuery = discovery.query(req.query.query, req.query.count);

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