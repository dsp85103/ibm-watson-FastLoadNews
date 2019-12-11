var TAG = "text2speech.js";
const logger = require('../tools/logger.js');
require('dotenv').config();

// Text to Speech 
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_TEXT_TO_SPEECH_API_KEY,
  }),
  url: process.env.IBM_WATSON_TEXT_TO_SPEECH_API_URL,
});

let listVoices;
function doListVoices() {
  textToSpeech.listVoices()
      .then(voices => {
          listVoices = voices;
          logger.log(TAG, "Got a list of voice from Text2Speech api.");
      }).catch(error => {
          logger.log(TAG, error);
      });
}

function getListVoices() {
  return listVoices;
};

function getSynthesize(synthesizeParams) {
  return textToSpeech.synthesize(synthesizeParams);
}

// setup
logger.log(TAG, "Text to speech setup ...");
logger.log(TAG, "run listVoices function");
doListVoices();

module.exports.getListVoices = getListVoices;
module.exports.getSynthesize = getSynthesize;