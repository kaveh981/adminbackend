import * as functions from 'firebase-functions';
import * as express from 'express';

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions
const app = express();
app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
})
exports.app = functions.https.onRequest(app);
