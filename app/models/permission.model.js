import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';
import Role from './role.model.js';
import User from './user.model.js';

const schema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        roles: {
            type: [ mongoose.Schema.Types.ObjectId ],
            ref: Role
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        },
        entity: {
            type: String
        }
    }
);

schema.plugin(basePlugin)

const Permission = mongoose.model('permissions', schema);

export default Permission;