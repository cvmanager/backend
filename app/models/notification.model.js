import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';
import i18n from '../middlewares/lang.middleware.js'

const schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
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
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        attempts: {
            type: Number,
            default: 0
        },
        sent_at: {
            type: Date,
            default: null
        },
        seen_at: {
            type: Date,
            default: null
        },
        step: {
            type: String,
            required: true,
            enum: i18n.__("notification.enums.step")
        },
        response: {
            type: String,
            default: null,
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
