const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const Botkit = require('botkit');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const express = require('express');
const logger = require('./tools/logger.js');
require('dotenv').config();

var TAG = 'app.js';

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.facebookbot({
    debug: true,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
    access_token: process.env.FACEBOOK_ACCESS_TOKEN,
    // app_secret: process.env.FACEBOOK_APP_SECRET
});

var bot = controller.spawn({});

// Setup botkit webserver & messenger bot webhooks endpoints
controller.setupWebserver(appEnv.port || process.env.PORT, function(err,webserver) {
    controller.createWebhookEndpoints(controller.webserver, bot, function() {
        logger.log(TAG, 'The FLN bot is online. On ' + appEnv.port);
    });
});

// Setup Webserver 
var webserver = controller.webserver;

nunjucks.configure('views', {
    autoescape: true,
    express: webserver
});

webserver.use(bodyParser.urlencoded({ extended: true }))
webserver.use(express.static('/views'));
webserver.set('view engine', 'html');


// Setup Fast Load News routes 
require('./fastloadnews')(webserver);


// Setup bot response handler
require('./bot/bot_response')(controller);