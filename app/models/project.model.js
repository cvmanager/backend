const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: null
        },
        is_active: {
            type: Boolean,
            default: 1
        },
        deleted_at: {
            type: Date,
            default: null
        },
        deleted_by: {
            type: Schema.Types.ObjectId,
            default: null
        },
        created_by: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } }
);

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
