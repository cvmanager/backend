import mongoose from 'mongoose';
import i18n from '../middlewares/lang.middleware.js'
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        resume_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'resumes'
        },
        event_time: {
            type: Date,
            required: true,
        },
        event_type: {
            type: String,
            required: true,
            enum: i18n.__("interview.enums.event_type")
        },
        status: {
            type: String,
            default: 'pending',
            enum: i18n.__("interview.enums.status")
        },
        type: {
            type: String,
            required: true,
            enum: i18n.__("interview.enums.type")
        },
        result: {
            type: String,
            required: false,
            enum: i18n.__("interview.enums.result")
        },
        description: {
            type: String,
            default: null
        },
        contribution: {
            type: Array,
            ref: 'users',
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        rating: {
            type: Number,
            required: true,
            length: 1
        }
    }
)


schema.plugin(basePlugin)

const Interview = mongoose.model('interviews', schema);

export default Interview;
