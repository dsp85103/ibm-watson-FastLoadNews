const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const logger = require('./logger.js');
const t2s = require('./text2speech.js');
require('dotenv').config();

var TAG = 'app.js';

app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('/views'));
// app.use('/static/', express.static(__dirname + '/static'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.get('/', function(req, res) {
    let listVoices = t2s.getListVoices();
    res.render('index.html', { voices: listVoices.result.voices } );
});

app.get('/text2speech', function(req, res) {
     var accpectType = 'audio/ogg';
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
                    audio.result.pipe(res);
                } else {
                    res.send(JSON.stringify(audioStatus));
                }
            })
            .catch(err => {
                logger.log(TAG, 'error:', err);
            });
});

app.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url);
});