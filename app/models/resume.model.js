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
        position_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'positions',
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
            enum: i18n.__("system.enums.gender")
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
            enum: i18n.__("system.enums.marital_status")
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
            enum: i18n.__("system.enums.education")
        },
        phone: {
            type: String,
            default: null
        },
        min_salary: {
            type: Number,
            default: null,
            minlength: 0,
            maxlength: 1000000000
        },
        max_salary: {
            type: Number,
            default: null,
            minlength: 0,
            maxlength: 1000000000
        },
        work_experience: {
            type: Number,
            default: null
        },
        military_status: {
            type: String,
            default: null,
            enum: i18n.__("system.enums.military_status")
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
        call_history: {
            type: [
                {
                    result: {
                        type: String,
                        default: null,
                        enum: i18n.__("resume.enums.call_history_status")
                    },
                    calling_date: {
                        type: Date,
                        default: null
                    },
                    description: {
                        type: String,
                    },
                    recall_at: {
                        type: Date,
                        default: null
                    },
                    created_by: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: 'users'
                    },
                }
            ],
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        file: {
            type: Array,
            default: null
        },
        process_duration: {
            type: Number,
            default: null
        },
        hire_status: {
            type: String,
            default: 'not_employed',
            enum: i18n.__("resume.enums.hire_status")
        },
        income: {
            type: Number,
            default: null
        },
        index: {
            type: Number,
            default: null
        }
    }
);

schema.virtual("resumeComments", {
    ref: 'resumeComments',
    localField: "_id",
    foreignField: "resume_id"
});

schema.plugin(basePlugin)

const Resume = mongoose.model("resumes", schema);

export default Resume;