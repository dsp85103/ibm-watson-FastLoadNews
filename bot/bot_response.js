const queryString = require('query-string');
const discovery = require('../services/ibm-watson-discovery');

module.exports = function (controller) {

    controller.hears(['hello', 'hi', '嗨', '你好', '您好'], 'message_received,facebook_postback', function(bot, message) {

        bot.reply(message, 'Hello！:D \n歡迎使用速速聞題鳥！\n使用`新聞`可以查詢想看的新聞唷！');
      });

    // Wildcard hears response, will respond to all user input with 'Hello World!'
    controller.hears(['我想看新聞', '新聞'], 'message_received,facebook_postback', function (bot, message) {
        bot.startConversation(message, function (err, convo) {
            if (!err) {
                convo.say('Hi 你好! 歡迎使用速速聞題鳥～');
                convo.ask('請問您想看什麼新聞呢？', function (response, convo) {
                    convo.say('好的！我收到了！請稍後～');
                    convo.ask('你想要我幫您尋找有關 `' + response.text + '` 的新聞文章嗎?', [
                        {
                            pattern: bot.utterances.yes,
                            callback: function (response, convo) {
                                // since no further messages are queued after this,
                                // the conversation will end naturally with status == 'completed'
                                convo.next();
                            }
                        },
                        {
                            pattern: bot.utterances.no,
                            callback: function (response, convo) {
                                // stop the conversation. this will cause it to end with status == 'stopped'
                                convo.stop();
                            }
                        },
                        {
                            default: true,
                            callback: function (response, convo) {
                                convo.repeat();
                                convo.next();
                            }
                        }
                    ]);

                    convo.next();

                }, { 'key': 'search-query' });

                convo.on('end', function (convo) {
                    if (convo.status == 'completed') {
                        bot.reply(message, '好的，尋找中請稍後...');

                        const qs = queryString.stringify({ query: convo.extractResponse('search-query') });
                        const host = `http://localhost:${port}`;
                        // eslint-disable-next-line no-console
                        console.log(`Slack Bot host route: ${host}`);
                        fetch(`${host}/search/api/search?${qs}`)
                            .then(apiResponse => {
                                if (apiResponse.ok) {
                                    apiResponse.json()
                                        .then(json => {
                                            bot.reply(message, 'Here are some news articles...');
                                            for (let i = 0; i < 3; i++) {
                                                setTimeout(() => {
                                                    bot.reply(message, `<${json.results[i].url}>`);
                                                }, i * 1000);
                                            }
                                        });
                                } else {
                                    throw new Error(apiResponse.json());
                                }
                            })
                            .catch(err => {
                                // eslint-disable-next-line no-console
                                console.error('error', err);
                                bot.reply(message, 'Error fetching news');
                            });
                    } else {
                        // this happens if the conversation ended prematurely for some reason
                        bot.reply(message, 'OK, nevermind!');
                    }
                });
            }
        });


    });

}