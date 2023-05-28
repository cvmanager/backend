import autoBind from "auto-bind";
import Notification from "../../models/notification.model.js";
import ServiceBase from "./base.service.js";
import { sendNotificationToClient } from '../notify.js'
import userService from "./user.service.js";

class NotificationService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async setNotificationForResume(resume, req, userId, step, title, body) {
        let params = {
            title,
            body,
            user_id: userId,
            step,
            entity: 'resumes',
            entity_id: resume.id,
            created_by: req.user.id,
        };
        await this.create(params);
    }

    async sendNotification(limit) {
        let notifications = await Notification
            .find({ "sent_at": null })
            .limit(limit)
        for (let notification of notifications) {
            let request_data = null;

            let fcmTokens = await userService.getFCMTokensOfUser(notification.user_id);
            if (fcmTokens.length > 0) {
                let notificationData = { title: notification.title, body: notification.body };
                request_data = sendNotificationToClient(fcmTokens, notificationData);
                notification.attempts += 1;
                
                if (request_data && typeof request_data.successes !== 'undefined' && request_data.successes > 0) {
                    notification.sent_at = new Date()
                }
                if (request_data && typeof request_data.response !== 'undefined') {
                    notification.response = request_data.response.toString();
                }

                await notification.save()
            }



        }
    }

}

export default new NotificationService(Notification);