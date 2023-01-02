import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';


const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'companies'
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
            ref: 'users'
        }
    }
);


schema.virtual("managers", {
    ref: 'managers',
    localField: "_id",
    foreignField: "entity_id"
});

schema.plugin(basePlugin)

const Project = mongoose.model('projects', schema);

export default Project;
