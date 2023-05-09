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
        },
        role: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'roles'
        },
        fullname: {
            type: String,
            default: null
        }
    }
);

let options = {
    transform: ['password']
}
schema.plugin(basePlugin, options);

const User = mongoose.model("users", schema);
export default User;