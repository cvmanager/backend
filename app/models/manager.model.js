import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        entity: {
            type: String,
            required: true,
            enum: ['company', 'project', 'position']
        },
        entity_id: {
            type: String,
            required: true,
            ref: 'positions'
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const Manager = mongoose.model('managers', schema);

export default Manager;
