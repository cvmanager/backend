import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: null
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roles"
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    }
);

schema.plugin(basePlugin)

const Role = mongoose.model('roles', schema);

export default Role;
