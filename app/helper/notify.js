import { messaging } from "./firebaseInit.js";

export const sendNotificationToClient = async (tokens, data) => {
  // Send a message to the devices corresponding to the provided
  // registration tokens.
  try {
    const response = await messaging.sendMulticast({ tokens, data });
    let successes = response.responses.filter((r) => r.success === true).length;
    let failures = response.responses.filter((r) => r.success === false).length;
    return { successes: successes, failures: failures, response: response };
  } catch (err) {
    return { successes: 0, failures: 0, response: err };
  }
};
