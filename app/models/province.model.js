import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        name_en: {
            type: String,
            required: true,
        }
    }
)

schema.plugin(basePlugin)

const Province = mongoose.model('provinces', schema);

export default Province;
