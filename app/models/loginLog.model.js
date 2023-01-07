import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
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
        login_time: {
            type: Date,
        },
        platform: {
            type: String,
        },
        platform_distro: {
            type: String,
        },
        platform_release: {
            type: String,
        },
        CPU: {
            type: String,
        },
        CPU_brand: {
            type: String,
        },
        browser_name: {
            type: String,
        },
        browser_version: {
            type: String,
        },
        browser_type: {
            type: String,
        },
        memory_total: {
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
        }
    }
)

schema.plugin(basePlugin)

const loginLogs = mongoose.model('loginLog', schema);

export default loginLogs;
