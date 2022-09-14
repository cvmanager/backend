const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: null },
        is_active: { type: Boolean, default: 1 },
        deleted_at: { type: Date, default: null },
        deleted_by: { type: Number, default: null },
        user_id_created: { type: Number, default: 1 }
    },
    { timestamps: { createdAt: true } }
);

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
