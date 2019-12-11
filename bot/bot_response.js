module.exports = function (controller) {

    // Wildcard hears response, will respond to all user input with 'Hello World!'
    controller.hears(['.*'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'Hello World! I am FLN BOT.');
    });

}