const queryString = require('query-string');
const discovery = require('../services/ibm-watson-discovery');
const fetch = require('node-fetch');

module.exports = function (controller) {

    var queryTxt;
    var countTxt;
    // Wildcard hears response, will respond to all user input with 'Hello World!'
    controller.hears(['我想看新聞', '新聞'], 'message_received,facebook_postback', function (bot, message) {
        bot.startConversation(message, function (err, convo) {
            if (!err) {
                convo.ask('請問您想看什麼新聞呢？', function (response, convo) {
                    convo.say('好的！我收到了！');
                    queryTxt = response.text;

                    convo.ask('請問您想看幾則新聞呢？', [{

                        default: true,
                        callback: function (response, convo) {

                            if (isNaN(parseInt(response.text))) {
                                bot.reply(message, '錯誤格式！');
                                convo.repeat();
                            } else {
                                countTxt = response.text;
                                bot.reply(message, '正在幫您尋找 `' + response.text + '` 則有關 `' + queryTxt + '` 的新聞文章');
                            }

                            convo.next();

                        }

                    }], { 'key': 'query' });

                    convo.next();

                    // convo.ask('你是要我幫您尋找有關 `' + response.text + '` 的新聞文章嗎?', [
                    //     {
                    //         pattern: bot.utterances.yes,
                    //         callback: function (response, convo) {
                    //             // since no further messages are queued after this,
                    //             // the conversation will end naturally with status == 'completed'

                    //             convo.next();
                    //         }
                    //     },
                    //     {
                    //         pattern: bot.utterances.no,
                    //         callback: function (response, convo) {
                    //             // stop the conversation. this will cause it to end with status == 'stopped'
                    //             convo.stop();
                    //         }
                    //     },
                    //     {
                    //         default: true,
                    //         callback: function (response, convo) {
                    //             convo.repeat();
                    //             convo.next();
                    //         }
                    //     }
                    // ]);


                }, { 'key': 'query' });



                convo.on('end', function (convo) {
                    if (convo.status == 'completed') {
                        // bot.reply(message, '好的，尋找中請稍後...');

                        const qs = queryString.stringify({ query: convo.extractResponse('query') });
                        const host = `https://fastloadnews.mybluemix.net`;
                        // const host = `https://60718e9c.ngrok.io`;
                        // eslint-disable-next-line no-console
                        fetch(`${host}/discovery?query=${queryTxt}&count=${countTxt}`)
                            .then(apiResponse => {
                                if (apiResponse.ok) {
                                    apiResponse.json()
                                        .then(json => {
                                            // bot.reply(message, '這邊是我為您找出來有關的新聞...');
                                            for (let i = 0; i < parseInt(countTxt, 10); i++) {
                                                setTimeout(() => {
                                                    bot.reply(message, `${json.result.results[i].title}\n${json.result.results[i].url}`);
                                                    var urlEncodeString = queryString.stringify({transText : `${json.result.results[i].title}`});
                                                    var urlString = host + "/text2speech?" + urlEncodeString + "&transVoices=en-US_LisaV2Voice";
                                                    bot.reply(message, {"attachment":{"type":"audio", "payload": {"url":urlString }}});
                                                }, i * 3000);
                                            }
                                            setTimeout(() => { }, 1500);
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

    controller.hears(['.*'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'Hello！:D \n歡迎使用速速聞題鳥！\n使用`新聞`可以查詢想看的新聞唷！');
    });

}