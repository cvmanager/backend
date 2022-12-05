import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';
import Company from './company.model.js';
import User from './user.model.js';

const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: Company
        },
        manager_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: User
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: null
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: User
        }
    }
);

schema.plugin(basePlugin)

const Project = mongoose.model('projects', schema);

export default Project;
