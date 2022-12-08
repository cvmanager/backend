import mongoose from 'mongoose';
import i18n from '../middlewares/lang.middleware.js'
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'companies',
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'projects',
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: i18n.__("enums.gender")
        },
        email: {
            type: String,
            required: true
        },
        birth_year: {
            type: Number,
            required: true
        },
        marital_status: {
            type: String,
            required: true,
            enum: i18n.__("enums.marital_status")
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: i18n.__("resume.enums.status")
        },
        mobile: {
            type: String,
            required: true
        },
        residence_city: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        work_city: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        education: {
            type: String,
            required: true,
            enum: i18n.__("enums.education")
        },
        major: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        min_salary: {
            type: Number,
            default: null
        },
        max_salary: {
            type: Number,
            default: null
        },
        work_experience: {
            type: Number,
            default: null
        },
        military_status: {
            type: String,
            default: null,
            enum: i18n.__("enums.military_status")
        },
        status_updated_at: {
            type: Date,
            default: null
        },
        status_history: {
            type: [
                {
                    old_status: {
                        type: String,
                        required: true,
                        enum: i18n.__("resume.enums.status")
                    },
                    new_status: {
                        type: String,
                        required: true,
                        enum: i18n.__("resume.enums.status")
                    },
                    created_by: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: 'users'
                    },
                    createdAt: {
                        type: mongoose.Schema.Types.Date,
                        required: true
                    },
                }
            ],
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
);

schema.plugin(basePlugin)

const Resume = mongoose.model("resumes", schema);

export default Resume;