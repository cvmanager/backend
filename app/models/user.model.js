import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';
import Role from './role.model.js';

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
        fullname: {
            type: String,
            default: null
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        email: { type: String, trim: true, index: true, unique: true, sparse: true },
        password: {
            type: String,
            required: true,
        },
        mobile_verified_at: {
            type: Date,
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
        },
        last_visit: {
            type: Date,
            default: null,
        },
        role: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: Role
        }
    }
);

schema.virtual("fcmtokens", {
    ref: 'fcmTokens',
    localField: "_id",
    foreignField: "created_by"
});

let options = {
    transform: ['password']
}
schema.plugin(basePlugin, options);

const User = mongoose.model("users", schema);
export default User;