const logger = require('./tools/logger');

var TAG = 'fastloadnews.js';

const index = require('./routes/index');
const translator = require('./routes/translator');
const text2speech = require('./routes/text2speech');
const news = require('./routes/news');
const discovery = require('./routes/discovery');

module.exports = function (app) {

    app.use('/', index);
    app.use('/translator', translator);
    app.use('/text2speech', text2speech);

    app.use('/news', news);
    app.use('/discovery', discovery);

}