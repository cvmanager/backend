import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        entity: {
            type: String,
            required: true,
            enum: ['resumes', 'positions', 'projects', 'companies']
        },
        entity_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const Viewlog = mongoose.model('viewlog', schema);

export default Viewlog;
