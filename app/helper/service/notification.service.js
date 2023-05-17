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
            title: title,
            body: body,
            user_id: userId,
            step: step,
            entity: 'resumes',
            entity_id: resume._id,
            created_by: req.user._id,
        };
        await this.create(params);
    }

    async sendNotification(limit) {
        let notifications = await Notification
            .find({ "send_state": false })
            .limit(limit)

        for (let notification of notifications) {

            let fcmTokens = await userService.getFCMTokensOfUser(notification.user_id);
            if (fcmTokens.length > 0) {
                const notificationData = {
                    title: notification.title,
                    body: notification.body
                };
                sendNotificationToClient(fcmTokens, notificationData);
            }

            notification.send_state = true
            notification.send_time = new Date()
            notification.save()

        }
    }

}

export default new NotificationService(Notification);