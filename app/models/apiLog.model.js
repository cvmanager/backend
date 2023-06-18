import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: 'output',
            enum: ['input', 'output']
        },
        uri: {
            type: String,
            required: true
        },
        param: {
            type: String,
            default: null,
        },
        response: {
            type: String,
            default: null,
        },
        response_code: {
            type: String,
            default: null,
        },
        response_time: {
            type: Date,
            default: null,
        }
    }
)

schema.plugin(basePlugin)

const ApiLog = mongoose.model('apilogs', schema);

export default ApiLog;
