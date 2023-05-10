import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const FCMToken = mongoose.model('fcmTokens', schema);

export default FCMToken;
