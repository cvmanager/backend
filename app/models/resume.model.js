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
        fullname: {
            type: String,
            default: null
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
        reject_reason: {
            type: String,
            required: false,
            default: null
        },
        reject_description: {
            type: String,
            required: false,
            default: null
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
            type: String,
            required: false,
            default: null
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
            // enum: i18n.__("system.enums.military_status")
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
                    rating: {
                        type: Number,
                        required: true,
                        length: 1
                    },
                    created_by: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: 'users'
                    },
                    createdAt : {
                        type: Date,
                        default: Date.now 
                    }
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
        },
        avatar: {
            type: String,
            default: null,
        },
        tags: {
            type: Array,
            default: null,
            ref: 'tags'
        },
        assigners: {
            type: Array,
            default: null,
            ref: 'users'
        },
        summary_count: {
            type:
            {
                view: {
                    type: Number,
                    default: 0
                },
                comment: {
                    type: Number,
                    default: 0
                },
                file: {
                    type: Number,
                    default: 0
                },
                call_history: {
                    type: Number,
                    default: 0
                },
                interview: {
                    type: Number,
                    default: 0
                },
                tag: {
                    type: Number,
                    default: 0
                }
            },
            default: {
                'view': 0,
                'cumment': 0,
                'file': 0,
                'call_history': 0,
                'interview': 0,
                'tag': 0
            }
        },
        rating: {
            type: Number,
            default: null,
            length: 1
        },
        hired_from_date: {
            type: mongoose.Schema.Types.Date,
            default: null
        },
        end_cooperation_date: {
            type: mongoose.Schema.Types.Date,
            default: null
        },
        end_cooperation_reason: {
            type: String,
            default: null
        },
        end_cooperation_description: {
            type: String,
            default: null
        },
        skills: {
            type: Array,
            default: null,
            ref: 'skills'
        },
    }
);

schema.virtual("comments", {
    ref: 'resumeComments',
    localField: "_id",
    foreignField: "resume_id"
});

schema.virtual("interviews", {
    ref: 'interviews',
    localField: "_id",
    foreignField: "resume_id"
});

schema.virtual("views", {
    ref: 'viewlog',
    localField: "_id",
    foreignField: "entity_id"
});


schema.plugin(basePlugin)

const Resume = mongoose.model("resumes", schema);

export default Resume;