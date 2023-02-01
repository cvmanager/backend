import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        access_token: {
            type: String,
        },
        refresh_token: {
            type: String,
        },
        os: {
            type: String,
        },
        cpu: {
            type: String,
        },
        browser: {
            type: String,
        },
        memory: {
            type: String,
        },
        ip4: {
            type: String,
        },
        ip6: {
            type: String,
        },
        mac_address: {
            type: String,
        },
        type: {
            type: String,
            enum: ['register', 'login']
        }
    }
)

schema.plugin(basePlugin)

const loginLogs = mongoose.model('loginLog', schema);

export default loginLogs;
