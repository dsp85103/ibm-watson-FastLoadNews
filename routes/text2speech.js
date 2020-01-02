const express = require('express');
var router = express.Router();
const logger = require('../tools/logger');
const t2s = require('../services/ibm-watson-text2speech');
const TAG = "Text2Speech";

router.get('/', function (req, res) {
    var accpectType = 'audio/mp3';
    const synthesizeParams = {
        text: req.query.transText,
        accept: accpectType,
        voice: req.query.transVoices,
    };

    logger.log(TAG, "received request: " + JSON.stringify(synthesizeParams));
    t2s.getSynthesize(synthesizeParams)
        .then(audio => {
            const audioStatus = {
                status: audio.status,
                statusText: audio.statusText,
                text: synthesizeParams.text,
                accept: accpectType,
                voice: synthesizeParams.voice
            };

            logger.log(TAG, JSON.stringify(audioStatus));
            if (audio.status == 200) {
                // audio.result.pipe(fs.createWriteStream('happy.mp3'));
                res.set('Content-Type', accpectType);
                audio.result.pipe(res);
            } else {
                res.send(JSON.stringify(audioStatus));
            }
        })
        .catch(err => {
            logger.log(TAG, 'error:', err);
        });
});

module.exports = router;