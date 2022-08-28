const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema({
    name: { type: String, default: null },
    description: { type: String, default: null },
    is_active: { type: Boolean, default: 1 },
    is_archive: { type: Boolean, default: null },
    user_id_created: { type: Number, default: 1 }
},
    { timestamps: { createdAt: true } });

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
