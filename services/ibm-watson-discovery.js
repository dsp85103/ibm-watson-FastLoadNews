require('dotenv').config();

const DISCOVERY_ENVIRONMENT_ID = 'system';
const DISCOVERY_COLLECTION_ID = 'news';
const fs = require('fs');
const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

var version_date = '2019-12-08';

const discovery = new DiscoveryV1({
    version: version_date,
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_WATSON_DISCOVERY_API_KEY,
    }),
    url: process.env.IBM_WATSON_DISCOVERY_API_URL,
});


function query(queryText, queryAmount) {
    const queryParams = {
        query: queryText,
        count: queryAmount,
        environmentId: DISCOVERY_ENVIRONMENT_ID,
        collectionId: DISCOVERY_COLLECTION_ID,
    };

    return discovery.query(queryParams);
}

module.exports.query = query;

// discovery.query(queryParams)
//     .then(queryResponse => {
//         //   console.log(JSON.stringify(queryResponse, null, 2));
//         fs.writeFile('news.json', JSON.stringify(queryResponse, null, 2), function (err) {
//             if (err)
//                 console.log(err);
//             else
//                 console.log('Write operation complete.');
//         });
//     })
//     .catch(err => {
//         console.log('error:', err);
// });