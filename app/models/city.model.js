import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        province_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'provinces'
        },
        name: {
            type: String,
            required: true,
        },
        name_en: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        }
    }
)

schema.plugin(basePlugin)

const City = mongoose.model('cities', schema);

export default City;
