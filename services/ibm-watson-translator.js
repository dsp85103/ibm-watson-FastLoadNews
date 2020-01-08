const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_TRANSLATOR_API_KEY,
  }),
  url: process.env.IBM_WATSON_TRANSLATOR_API_URL,
});

function translate(translateText) {
    const translateParams = {
        text: translateText,
        modelId: 'zh-en',
      };
    return languageTranslator.translate(translateParams);
}

function identify(identifyText) {
    const identifyParams = {
        text: identifyText
      };
    return languageTranslator.identify(identifyParams)
}


module.exports.translate = translate;