import mongoose from 'mongoose';
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
        manager_id: {
            type: [{
                id: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'users'
            }],
            required: true
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
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }
)

schema.plugin(basePlugin)

const Position = mongoose.model('positions', schema);

export default Position;
