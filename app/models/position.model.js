import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';
import Project from './project.model.js';
import Company from './conpany.model.js';

const schema = new mongoose.Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: Project
        },
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: Company
        },
        title: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
            enum: i18n.__("enums.positions")
        },
        is_active: {
            type: Boolean,
            default: 1
        }
    }
)

schema.plugin(basePlugin)

const Position = mongoose.model('positions', schema);

export default Position;
