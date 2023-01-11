import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        logo: {
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
            ref: 'users'
        }
    }
)

schema.virtual("projects", {
    ref: 'projects',
    localField: "_id",
    foreignField: "company_id"
});

schema.virtual("managers", {
    ref: 'managers',
    localField: "_id",
    foreignField: "entity_id"
});

schema.plugin(basePlugin)

const Company = mongoose.model('companies', schema);

export default Company;
