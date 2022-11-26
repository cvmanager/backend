import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';
import User from './user.model.js';

const schema = new mongoose.Schema({
    old_status: {
        type: String,
        required: true
    },
    new_status: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
}, { _id: false });

schema.plugin(basePlugin)

const ResumeStatusLog = mongoose.model("resumeStatusLogs", schema);

export default ResumeStatusLog;