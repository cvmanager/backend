import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';
import Project from './project.model.js';
import Resume from './resume.model.js';

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
        is_banded: {
            type: Boolean,
            default: null,
        }
    }
);

schema.plugin(basePlugin)

schema.virtual('projects', {
    ref: Project,
    localField: '_id',
    foreignField: 'created_by'
});

schema.virtual('resumes', {
    ref: Resume,
    localField: '_id',
    foreignField: 'created_by'
});

const User = mongoose.model("users", schema);
export default User;