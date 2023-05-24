import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        step: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
            required: true,
            enume: ['kavehnegar']
        },
        sender: {
            type: Number,
            required: true,
        },
        receiver: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            default: null,
        },
        respone: {
            type: String,
            required: true,
        }
    }
)

schema.plugin(basePlugin)

const City = mongoose.model('smshistory', schema);

export default City;
