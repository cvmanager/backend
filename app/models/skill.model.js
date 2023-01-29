import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
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

schema.plugin(basePlugin)
const Skill = mongoose.model('skills', schema);
export default Skill;
