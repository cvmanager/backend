import FCMToken from '../../models/fcmToken.model.js'
import { fcmTokens } from './data';

class FCMTokenData {
    getFCMToken() {
        return Object.values(fcmTokens)[0];
    }

    getFCMTokens() {
        return fcmTokens;
    }

    getFCMTokensByUserId(userId) {
        return fcmTokens.find(fcmToken => fcmToken.created_by == userId);
    }

}

export default FCMTokenData