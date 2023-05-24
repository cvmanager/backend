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
        provider: {
            type: String,
            required: true,
            enume: ['sms']
        },
        code: {
            type: Number,
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        receiver: {
            type: Number,
            required: true,
        },
        veriffication_at: {
            type: Date,
            default: null,
        },
        expire_at: {
            type: Date,
            default: null,
        }
    }
)

schema.plugin(basePlugin)

const VerificationRequest = mongoose.model('verificationrequest', schema);

export default VerificationRequest;
