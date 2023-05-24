import { messaging } from './firebaseInit.js';

export const sendNotificationToClient = (tokens, data) => {
    // Send a message to the devices corresponding to the provided
    // registration tokens.
    messaging
        .sendMulticast({ tokens, data })
        .then(response => {
            // Response is an object of the form { responses: [] }
            let successes = response.responses.filter(r => r.success === true).length;
            let failures = response.responses.filter(r => r.success === false).length;
            return { 'successes': successes, 'failures': failures, 'response': response };
        })
        .catch(error => {
            return { 'successes': 0, 'failures': 0, 'response': error };
        });
};