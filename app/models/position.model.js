import mongoose from 'mongoose';
import i18n from '../middlewares/lang.middleware.js'
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'projects'
        },
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'companies'
        },
        title: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
            enum: i18n.__("enums.positions")
        },
        is_active: {
            type: Boolean,
            default: 1
        }
    }
)

schema.plugin(basePlugin)

const Position = mongoose.model('positions', schema);

export default Position;
