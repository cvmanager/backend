import mongoose from 'mongoose';
import i18n from '../middlewares/lang.middleware.js'
import basePlugin from '../helper/mongoose/base.plugin.js';

const schema = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'companies'
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'projects'
        },
        title: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
            enum: i18n.__("position.enums.level")
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        logo: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.virtual("managers" , {
    ref : 'managers',
    localField : '_id',
    foreignField : 'entity_id',
})

schema.plugin(basePlugin)

const Position = mongoose.model('positions', schema);

export default Position;
