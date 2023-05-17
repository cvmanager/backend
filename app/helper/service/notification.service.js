import autoBind from "auto-bind";
import Notification from "../../models/notification.model.js";
import ServiceBase from "./base.service.js";

class NotificationService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async setNotificationForResume(resume, req, userId, title, body) {
        let params = {
            title: title,
            body: body,
            user_id: userId,
            entity: 'resumes',
            entity_id: resume._id,
            created_by: req.user._id,
        };
        await this.create(params);
    }

}

export default new NotificationService(Notification);