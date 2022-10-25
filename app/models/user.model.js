import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            default: null,
        },
        lastname: {
            type: String,
            default: null,
        },
        mobile: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile_verified_at: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        is_banned: {
            type: Boolean,
            default: null,
        },
        banned_by: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        banned_at: {
            type: Date,
            default: null,
        }
    }
);

schema.plugin(basePlugin)

const User = mongoose.model("users", schema);
export default User;