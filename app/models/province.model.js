import mongoose from 'mongoose';

import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cities: {
            type: [{
                id: mongoose.Schema.Types.ObjectId,
                name: {
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
            }]
        }
    }
)

schema.plugin(basePlugin)

const Company = mongoose.model('provinces', schema);

export default Company;
