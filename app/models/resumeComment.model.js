import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        resume_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        body: {
            type: String,
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)
const resumeComment = mongoose.model('resumeComments', schema);
export default resumeComment;
