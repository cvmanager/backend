import mongoose from 'mongoose';
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: null
        },
        count: {
            type: Number,
            default: 0,
        }
    }
)

schema.plugin(basePlugin)
const Tag = mongoose.model('tags', schema);
export default Tag;
