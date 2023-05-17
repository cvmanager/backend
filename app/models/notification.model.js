import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';
import i18n from '../middlewares/lang.middleware.js'

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        send_state: {
            type: Boolean,
            default: false
        },
        send_time: {
            type: Date,
            required: null
        },
        step: {
            type: String,
            required: true,
            enum: i18n.__("notification.enums.step")
        },
        entity: {
            type: String,
            required: true,
            enum: i18n.__("notification.enums.entity")
        },
        entity_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const Notification = mongoose.model('notifications', schema);

export default Notification;
